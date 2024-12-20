/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    IArgumentDefinition,
    IEndpointDefinition,
    IParameterType,
    IParameterType_Header,
    IParameterType_Query,
    IServiceDefinition,
    IType,
    ITypeDefinition,
    ITypeVisitor,
} from "conjure-api";
import { MediaType } from "conjure-client";
import {
    CodeBlockWriter,
    ImportDeclarationStructure,
    MethodDeclarationStructure,
    MethodSignatureStructure,
    ParameterDeclarationStructure,
    Scope,
    StructureKind,
    VariableDeclarationKind,
} from "ts-morph";
import { ImportsVisitor, sortImports } from "./imports";
import { MediaTypeVisitor } from "./mediaTypeVisitor";
import { SimpleAst } from "./simpleAst";
import { StringConversionTypeVisitor } from "./stringConversionTypeVisitor";
import { TsArgumentTypeVisitor } from "./tsArgumentTypeVisitor";
import { TsReturnTypeVisitor } from "./tsReturnTypeVisitor";
import { ITypeGenerationFlags } from "./typeGenerationFlags";
import { addDeprecatedToDocs, addErrorsToDocs, addIncubatingToDocs, CONJURE_CLIENT } from "./utils";

/** Type used in the generation of the service class. Expected to be provided by conjure-client */
const FAILURE_TYPE = "Failure";
const HTTP_API_BRIDGE_TYPE = "IHttpApiBridge";
const RESULT_TYPE = "Result";
const SUCCESS_TYPE = "Success";

/** Variable name used in the generation of the service class. */
const BRIDGE = "bridge";

/** Default imports used in the generation of the service class. */
const CONJURE_CLIENT_IMPORTS_WITH_FAILURE_TYPE: ImportDeclarationStructure = {
    kind: StructureKind.ImportDeclaration,
    moduleSpecifier: CONJURE_CLIENT,
    namedImports: [
        { name: FAILURE_TYPE },
        { name: HTTP_API_BRIDGE_TYPE },
        { name: RESULT_TYPE },
        { name: SUCCESS_TYPE },
    ],
};
const CONJURE_CLIENT_IMPORTS_WITHOUT_FAILURE_TYPE: ImportDeclarationStructure = {
    kind: StructureKind.ImportDeclaration,
    moduleSpecifier: CONJURE_CLIENT,
    namedImports: [{ name: HTTP_API_BRIDGE_TYPE }, { name: RESULT_TYPE }, { name: SUCCESS_TYPE }],
};

const UNDEFINED_CONSTANT = "__undefined";

export function generateService(
    definition: IServiceDefinition,
    knownTypes: Map<string, ITypeDefinition>,
    simpleAst: SimpleAst,
    typeGenerationFlags: ITypeGenerationFlags,
): Promise<void> {
    const sourceFile = simpleAst.createSourceFile(definition.serviceName);
    const tsReturnTypeVisitor = new TsReturnTypeVisitor(knownTypes, definition.serviceName, true, typeGenerationFlags);
    const tsArgumentTypeVisitor = new TsArgumentTypeVisitor(
        knownTypes,
        definition.serviceName,
        true,
        typeGenerationFlags,
    );
    const importsVisitor = new ImportsVisitor(knownTypes, definition.serviceName, typeGenerationFlags);
    const mediaTypeVisitor = new MediaTypeVisitor(knownTypes);
    const endpointSignatures: MethodSignatureStructure[] = [];
    const endpointImplementations: MethodDeclarationStructure[] = [];
    const imports: ImportDeclarationStructure[] = [];
    let throwsAtLeastOneError = false;

    sourceFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        docs: ["Constant reference to `undefined` that we expect to get minified and therefore reduce total code size"],
        declarations: [{ name: UNDEFINED_CONSTANT, type: "undefined", initializer: "undefined" }],
    });

    definition.endpoints.forEach(endpointDefinition => {
        const parameters: ParameterDeclarationStructure[] = endpointDefinition.args
            .sort((a, b) => {
                const aIsOptional = IType.isOptional(a.type);
                const bIsOptional = IType.isOptional(b.type);
                // Maintain order except optional arguments are pushed to the back
                return aIsOptional && !bIsOptional ? 1 : !aIsOptional && bIsOptional ? -1 : 0;
            })
            .map(argDefinition => {
                const argType = IType.visit(argDefinition.type, tsArgumentTypeVisitor);
                imports.push(...IType.visit(argDefinition.type, importsVisitor));
                return {
                    kind: StructureKind.Parameter,
                    hasQuestionToken: IType.isOptional(argDefinition.type),
                    name: argDefinition.argName,
                    type: argType,
                };
            });

        let returnTsType = "void";
        if (endpointDefinition.returns != null) {
            returnTsType = IType.visit(endpointDefinition.returns, tsReturnTypeVisitor);
            imports.push(...IType.visit(endpointDefinition.returns, importsVisitor));
        }

        const docs = addDeprecatedToDocs(endpointDefinition);
        const docsWithoutThrownErrors = addIncubatingToDocs(endpointDefinition, docs);
        const docsWithThrownErrors = addErrorsToDocs(endpointDefinition, docsWithoutThrownErrors);

        // Generate the throwing methods
        endpointSignatures.push({
            kind: StructureKind.MethodSignature,
            name: endpointDefinition.endpointName,
            parameters,
            returnType: `Promise<${returnTsType}>`,
            docs: docsWithThrownErrors != null ? [docsWithThrownErrors] : undefined,
        });
        endpointImplementations.push({
            kind: StructureKind.Method,
            statements: generateEndpointThrowingBody(
                definition.serviceName.name,
                endpointDefinition,
                returnTsType,
                mediaTypeVisitor,
            ),
            name: endpointDefinition.endpointName,
            parameters,
            returnType: `Promise<${returnTsType}>`,
            // this appears to be a no-op by ts-simple-ast, since default in typescript is public
            scope: Scope.Public,
            docs: docsWithThrownErrors != null ? [docsWithThrownErrors] : undefined,
        });

        // Generate the orError methods
        endpointDefinition.errors?.forEach(error => {
            // TODO: Get rid of the visitor, because the type (reference) is already known
            const errorImports: ImportDeclarationStructure[] = IType.visit(
                {
                    reference: {
                        name: error.error.name,
                        package: error.error.package,
                    },
                    type: "reference",
                },
                importsVisitor,
            ).map(i => ({ ...i, isTypeOnly: true }));
            imports.push(...errorImports);
        });

        const errorNames = endpointDefinition.errors?.map(error => `I${error.error.name}`) ?? [];
        throwsAtLeastOneError = throwsAtLeastOneError || errorNames.length > 0;

        if (errorNames.length === 0) {
            errorNames.push("never");
        }

        endpointSignatures.push({
            kind: StructureKind.MethodSignature,
            name: `${endpointDefinition.endpointName}OrError`,
            parameters,
            returnType: `Promise<Result<${returnTsType}, ${errorNames.join(" | ")}>>`,
            docs: docsWithoutThrownErrors != null ? [docsWithoutThrownErrors] : undefined,
        });
        endpointImplementations.push({
            kind: StructureKind.Method,
            statements: generateEndpointOrErrorBody(endpointDefinition, parameters, returnTsType),
            name: `${endpointDefinition.endpointName}OrError`,
            parameters,
            returnType: `Promise<Result<${returnTsType}, ${errorNames.join(" | ")}>>`,
            // this appears to be a no-op by ts-simple-ast, since default in typescript is public
            scope: Scope.Public,
            docs: docsWithoutThrownErrors != null ? [docsWithoutThrownErrors] : undefined,
        });
    });

    imports.push(
        throwsAtLeastOneError ? CONJURE_CLIENT_IMPORTS_WITH_FAILURE_TYPE : CONJURE_CLIENT_IMPORTS_WITHOUT_FAILURE_TYPE,
    );

    sourceFile.addImportDeclarations(sortImports(imports));

    const iface = sourceFile.addInterface({
        isExported: true,
        methods: endpointSignatures,
        name: "I" + definition.serviceName.name,
    });
    if (definition.docs != null) {
        iface.addJsDoc({ description: definition.docs });
    }

    sourceFile.addClass({
        ctors: [
            {
                parameters: [
                    {
                        name: BRIDGE,
                        scope: Scope.Private,
                        type: HTTP_API_BRIDGE_TYPE,
                    },
                ],
            },
        ],
        isExported: true,
        methods: endpointImplementations,
        name: definition.serviceName.name,
    });

    sourceFile.formatText();
    return sourceFile.save();
}

function generateEndpointThrowingBody(
    serviceName: string,
    endpointDefinition: IEndpointDefinition,
    returnTsType: string,
    mediaTypeVisitor: ITypeVisitor<string>,
): (writer: CodeBlockWriter) => void {
    const bodyArgs: IArgumentDefinition[] = [];
    const headerArgs: IArgumentDefinition[] = [];
    const queryArgs: IArgumentDefinition[] = [];

    endpointDefinition.args.forEach(argDefinition => {
        if (IParameterType.isBody(argDefinition.paramType)) {
            bodyArgs.push(argDefinition);
        } else if (IParameterType.isHeader(argDefinition.paramType)) {
            headerArgs.push(argDefinition);
        } else if (IParameterType.isQuery(argDefinition.paramType)) {
            queryArgs.push(argDefinition);
        }
    });

    const pathParamsFromPath = parsePathParamsFromPath(endpointDefinition.httpPath);

    if (bodyArgs.length > 1) {
        throw Error("endpoint cannot have more than one body arg, found: " + bodyArgs.length);
    }

    const data = bodyArgs.length === 0 ? UNDEFINED_CONSTANT : bodyArgs[0].argName;
    // It's not quite correct to default to application/json for body less and return less requests.
    // We do this to preserve existing behaviour.
    const requestMediaType =
        bodyArgs.length === 0 ? MediaType.APPLICATION_JSON : IType.visit(bodyArgs[0].type, mediaTypeVisitor);
    const responseMediaType =
        endpointDefinition.returns != null && endpointDefinition.returns != null
            ? IType.visit(endpointDefinition.returns, mediaTypeVisitor)
            : MediaType.APPLICATION_JSON;
    const formattedHeaderArgs = headerArgs.map(argDefinition => {
        const paramId = (argDefinition.paramType as IParameterType_Header).header.paramId!;
        if (paramId == null) {
            throw Error("header arguments must define a 'param-id': " + argDefinition.argName);
        }
        const stringConversion = IType.visit(argDefinition.type, new StringConversionTypeVisitor());
        return `"${paramId}": ${argDefinition.argName}${stringConversion},`;
    });
    const formattedQueryArgs = queryArgs.map(argDefinition => {
        const paramId = (argDefinition.paramType as IParameterType_Query).query.paramId;
        if (paramId == null) {
            throw Error("query arguments must define a 'param-id': " + argDefinition.argName);
        }
        return `"${paramId}": ${argDefinition.argName},`;
    });

    return writer => {
        writer
            .write(`return this.${BRIDGE}.call<${returnTsType}>(`)
            .writeLine(`"${serviceName}",`)
            .writeLine(`"${endpointDefinition.endpointName}",`)
            .writeLine(`"${endpointDefinition.httpMethod}",`)
            .writeLine(`"${endpointDefinition.httpPath}",`)
            .writeLine(`${data},`);

        if (formattedHeaderArgs.length === 0) {
            writer.writeLine(`${UNDEFINED_CONSTANT},`);
        } else {
            writer.write("{");
            formattedHeaderArgs.forEach(formattedHeader => writer.indent().writeLine(formattedHeader));
            writer.writeLine("},");
        }

        if (formattedQueryArgs.length === 0) {
            writer.writeLine(`${UNDEFINED_CONSTANT},`);
        } else {
            writer.write("{");
            formattedQueryArgs.forEach(formattedQuery => writer.indent().writeLine(formattedQuery));
            writer.writeLine("},");
        }

        if (pathParamsFromPath.length === 0) {
            writer.writeLine(`${UNDEFINED_CONSTANT},`);
        } else {
            writer.write("[");
            pathParamsFromPath.forEach(pathArgName => writer.indent().writeLine(pathArgName + ","));
            writer.writeLine("],");
        }
        writer.writeLine(
            `${requestMediaType === MediaType.APPLICATION_JSON ? UNDEFINED_CONSTANT : `"${requestMediaType}"`},`,
        );
        writer.writeLine(
            `${responseMediaType === MediaType.APPLICATION_JSON ? UNDEFINED_CONSTANT : `"${responseMediaType}"`}`,
        );
        writer.write(");");
    };
}

function generateEndpointOrErrorBody(
    endpointDefinition: IEndpointDefinition,
    parameters: ParameterDeclarationStructure[],
    returnTsType: string,
): (writer: CodeBlockWriter) => void {
    return writer => {
        const wrappedMethodCall = `this.${endpointDefinition.endpointName}(${parameters
            .map(parameter => parameter.name)
            .join(", ")})`;

        writer
            .writeLine(`return ${wrappedMethodCall}`)
            .write(`.then(response => ({ status: "success", response }) as Success<${returnTsType}>)`);

        if (endpointDefinition.errors != null && endpointDefinition.errors.length > 0) {
            writer
                .writeLine(".catch((e: any) => {")
                .writeLine("if (e == null || e.body == null) {")
                .writeLine("throw e;")
                .writeLine("}");
            for (const error of endpointDefinition.errors) {
                writer
                    .writeLine(`if (e.body.errorName === "${error.error.namespace}:${error.error.name}") {`)
                    .writeLine(`return { status: "failure", error: e.body } as Failure<I${error.error.name}>;`)
                    .writeLine("}");
            }
            writer.writeLine("throw e;").writeLine("});");
        } else {
            writer.write(";");
        }
    };
}

function parsePathParamsFromPath(httpPath: string): string[] {
    // first fix up the path to remove any ':.+' stuff in path params
    const fixedPath = httpPath.replace(/{(.*):[^}]*}/, "{$1}");
    // follow-up by just pulling out any path segment with a starting '{' and trailing '}'
    return fixedPath
        .split("/")
        .filter(segment => segment.startsWith("{") && segment.endsWith("}"))
        .map(segment => segment.slice(1, -1));
}
