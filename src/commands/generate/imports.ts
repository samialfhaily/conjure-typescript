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
    IExternalReference,
    IListType,
    IMapType,
    IOptionalType,
    ISetType,
    IType,
    ITypeDefinition,
    ITypeName,
    ITypeVisitor,
    PrimitiveType,
} from "conjure-api";
import * as path from "path";
import { ImportDeclarationStructure, SourceFile, StructureKind } from "ts-morph";
import { ITypeGenerationFlags } from "./typeGenerationFlags";
import { createHashableTypeName, isFlavorizable } from "./utils";

export class ImportsVisitor implements ITypeVisitor<ImportDeclarationStructure[]> {
    constructor(
        private knownTypes: Map<string, ITypeDefinition>,
        private currType: ITypeName,
        private typeGenerationFlags: ITypeGenerationFlags,
    ) {}

    public primitive = (_: PrimitiveType): ImportDeclarationStructure[] => [];

    public map = (obj: IMapType): ImportDeclarationStructure[] => {
        return IType.visit(obj.keyType, this).concat(IType.visit(obj.valueType, this));
    };
    public list = (obj: IListType): ImportDeclarationStructure[] => {
        return IType.visit(obj.itemType, this);
    };
    public set = (obj: ISetType): ImportDeclarationStructure[] => {
        return IType.visit(obj.itemType, this);
    };
    public optional = (obj: IOptionalType): ImportDeclarationStructure[] => {
        return IType.visit(obj.itemType, this);
    };
    public reference = (obj: ITypeName): ImportDeclarationStructure[] => {
        if (obj.package === this.currType.package) {
            return [];
        }

        const typeDefinition = this.knownTypes.get(createHashableTypeName(obj));
        if (typeDefinition == null) {
            throw new Error(`unknown reference type. package: '${obj.package}', name: '${obj.name}'`);
        }

        if (
            ITypeDefinition.isAlias(typeDefinition) &&
            !isFlavorizable(typeDefinition.alias.alias, this.typeGenerationFlags.flavorizedAliases)
        ) {
            return IType.visit(typeDefinition.alias.alias, this);
        }

        return [
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: relativePath(this.currType, obj),
                namespaceImport: module(obj),
                isTypeOnly: true,
            },
        ];
    };
    public external = (obj: IExternalReference): ImportDeclarationStructure[] => {
        return IType.visit(obj.fallback, this);
    };
    public unknown = (_obj: IType): ImportDeclarationStructure[] => {
        throw new Error("unknown");
    };
}

function relativePath(currType: ITypeName, toType: ITypeName) {
    const relativeImport = path.relative(dir(currType), dir(toType));
    return relativeImport;
}

export function dir(typeName: ITypeName) {
    const parts = typeName.package.split(".");
    if (parts.length < 3) {
        throw new Error("package should have at least 3 segments");
    }
    return parts.slice(2).join("-");
}

/** Pascal cases the name. */
export function module(typeName: ITypeName) {
    const directoryName = dir(typeName);
    const camelCaseModule = directoryName.replace(/-(\w)/g, x => x[1].toUpperCase());
    return camelCaseModule.charAt(0).toUpperCase() + camelCaseModule.slice(1);
}

export function sortImports(imports: ImportDeclarationStructure[]): ImportDeclarationStructure[] {
    const namespaceImports: Map<string, ImportDeclarationStructure> = new Map();

    imports.forEach(i => {
        const existingImportDeclaration = namespaceImports.get(i.moduleSpecifier);
        if (existingImportDeclaration != null && existingImportDeclaration.namespaceImport !== i.namespaceImport) {
            throw new Error(`only one namespace import for module '${i.moduleSpecifier}' is permitted`);
        } else {
            namespaceImports.set(i.moduleSpecifier, i);
        }
    });

    return Array.from(namespaceImports.values()).sort((a, b) =>
        a.moduleSpecifier < b.moduleSpecifier ? -1 : a.moduleSpecifier > b.moduleSpecifier ? 1 : 0,
    );
}

export function combineImports(sourceFile: SourceFile, importDeclarations: ReadonlyArray<ImportDeclarationStructure>) {
    for (const declaration of importDeclarations) {
        const existingDeclaration = sourceFile.getImportDeclaration(declaration.moduleSpecifier);
        if (existingDeclaration == null) {
            sourceFile.addImportDeclaration(declaration);
        }
    }
}
