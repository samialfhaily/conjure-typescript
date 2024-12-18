import { IBackingFileSystem } from "../product-datasets/backingFileSystem";
import { IDataset } from "../product-datasets/dataset";
import { ICreateDatasetRequest } from "../product/createDatasetRequest";
import { IHttpApiBridge } from "conjure-client";

/** Constant reference to `undefined` that we expect to get minified and therefore reduce total code size */
const __undefined: undefined = undefined;

/**
 * A Markdown description of the service.
 *
 */
export interface ITestService {
    /**
     * Returns a mapping from file system id to backing file system configuration.
     *
     */
    getFileSystems(): Promise<{ readonly [key: string]: IBackingFileSystem }>;
    /**
     * Returns a mapping from file system id to backing file system configuration.
     *
     */
    getFileSystemsOrError(): Promise<{ status: "success", response: { readonly [key: string]: IBackingFileSystem } }>;
    createDataset(request: ICreateDatasetRequest, testHeaderArg: string): Promise<IDataset>;
    createDatasetOrError(request: ICreateDatasetRequest, testHeaderArg: string): Promise<{ status: "success", response: IDataset }>;
    getDataset(datasetRid: string): Promise<IDataset | null>;
    getDatasetOrError(datasetRid: string): Promise<{ status: "success", response: IDataset | null }>;
    getRawData(datasetRid: string): Promise<ReadableStream<Uint8Array>>;
    getRawDataOrError(datasetRid: string): Promise<{ status: "success", response: ReadableStream<Uint8Array> }>;
    getAliasedRawData(datasetRid: string): Promise<ReadableStream<Uint8Array>>;
    getAliasedRawDataOrError(datasetRid: string): Promise<{ status: "success", response: ReadableStream<Uint8Array> }>;
    maybeGetRawData(datasetRid: string): Promise<ReadableStream<Uint8Array> | null>;
    maybeGetRawDataOrError(datasetRid: string): Promise<{ status: "success", response: ReadableStream<Uint8Array> | null }>;
    getAliasedString(datasetRid: string): Promise<string>;
    getAliasedStringOrError(datasetRid: string): Promise<{ status: "success", response: string }>;
    uploadRawData(input: ReadableStream<Uint8Array> | BufferSource | Blob): Promise<void>;
    uploadRawDataOrError(input: ReadableStream<Uint8Array> | BufferSource | Blob): Promise<{ status: "success", response: void }>;
    uploadAliasedRawData(input: ReadableStream<Uint8Array> | BufferSource | Blob): Promise<void>;
    uploadAliasedRawDataOrError(input: ReadableStream<Uint8Array> | BufferSource | Blob): Promise<{ status: "success", response: void }>;
    getBranches(datasetRid: string): Promise<ReadonlyArray<string>>;
    getBranchesOrError(datasetRid: string): Promise<{ status: "success", response: ReadonlyArray<string> }>;
    /**
     * Gets all branches of this dataset.
     *
     * @deprecated use getBranches instead
     */
    getBranchesDeprecated(datasetRid: string): Promise<ReadonlyArray<string>>;
    /**
     * Gets all branches of this dataset.
     *
     * @deprecated use getBranches instead
     */
    getBranchesDeprecatedOrError(datasetRid: string): Promise<{ status: "success", response: ReadonlyArray<string> }>;
    resolveBranch(datasetRid: string, branch: string): Promise<string | null>;
    resolveBranchOrError(datasetRid: string, branch: string): Promise<{ status: "success", response: string | null }>;
    testParam(datasetRid: string): Promise<string | null>;
    testParamOrError(datasetRid: string): Promise<{ status: "success", response: string | null }>;
    testQueryParams(query: string, something: string, implicit: string, setEnd: ReadonlyArray<string>, optionalMiddle?: string | null, optionalEnd?: string | null): Promise<number>;
    testQueryParamsOrError(query: string, something: string, implicit: string, setEnd: ReadonlyArray<string>, optionalMiddle?: string | null, optionalEnd?: string | null): Promise<{ status: "success", response: number }>;
    testNoResponseQueryParams(query: string, something: string, implicit: string, setEnd: ReadonlyArray<string>, optionalMiddle?: string | null, optionalEnd?: string | null): Promise<void>;
    testNoResponseQueryParamsOrError(query: string, something: string, implicit: string, setEnd: ReadonlyArray<string>, optionalMiddle?: string | null, optionalEnd?: string | null): Promise<{ status: "success", response: void }>;
    testBoolean(): Promise<boolean>;
    testBooleanOrError(): Promise<{ status: "success", response: boolean }>;
    testDouble(): Promise<number | "NaN">;
    testDoubleOrError(): Promise<{ status: "success", response: number | "NaN" }>;
    testInteger(): Promise<number>;
    testIntegerOrError(): Promise<{ status: "success", response: number }>;
    testPostOptional(maybeString?: string | null): Promise<string | null>;
    testPostOptionalOrError(maybeString?: string | null): Promise<{ status: "success", response: string | null }>;
    testOptionalIntegerAndDouble(maybeInteger?: number | null, maybeDouble?: number | "NaN" | null): Promise<void>;
    testOptionalIntegerAndDoubleOrError(maybeInteger?: number | null, maybeDouble?: number | "NaN" | null): Promise<{ status: "success", response: void }>;
}

export class TestService {
    constructor(private bridge: IHttpApiBridge) {
    }

    /**
     * Returns a mapping from file system id to backing file system configuration.
     *
     */
    public getFileSystems(): Promise<{ readonly [key: string]: IBackingFileSystem }> {
        return this.bridge.call<{ readonly [key: string]: IBackingFileSystem }>(
            "TestService",
            "getFileSystems",
            "GET",
            "/catalog/fileSystems",
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined
        );
    }

    /**
     * Returns a mapping from file system id to backing file system configuration.
     *
     */
    public getFileSystemsOrError(): Promise<{ status: "success", response: { readonly [key: string]: IBackingFileSystem } }> {
        return this.getFileSystems()
            .then(response => ({ status: "success", response }) as { status: "success", response: { readonly [key: string]: IBackingFileSystem } })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public createDataset(request: ICreateDatasetRequest, testHeaderArg: string): Promise<IDataset> {
        return this.bridge.call<IDataset>(
            "TestService",
            "createDataset",
            "POST",
            "/catalog/datasets",
            request,
            {
                "Test-Header": testHeaderArg,
            },
            __undefined,
            __undefined,
            __undefined,
            __undefined
        );
    }

    public createDatasetOrError(request: ICreateDatasetRequest, testHeaderArg: string): Promise<{ status: "success", response: IDataset }> {
        return this.createDataset(request, testHeaderArg)
            .then(response => ({ status: "success", response }) as { status: "success", response: IDataset })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public getDataset(datasetRid: string): Promise<IDataset | null> {
        return this.bridge.call<IDataset | null>(
            "TestService",
            "getDataset",
            "GET",
            "/catalog/datasets/{datasetRid}",
            __undefined,
            __undefined,
            __undefined,
            [
                datasetRid,
            ],
            __undefined,
            __undefined
        );
    }

    public getDatasetOrError(datasetRid: string): Promise<{ status: "success", response: IDataset | null }> {
        return this.getDataset(datasetRid)
            .then(response => ({ status: "success", response }) as { status: "success", response: IDataset | null })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public getRawData(datasetRid: string): Promise<ReadableStream<Uint8Array>> {
        return this.bridge.call<ReadableStream<Uint8Array>>(
            "TestService",
            "getRawData",
            "GET",
            "/catalog/datasets/{datasetRid}/raw",
            __undefined,
            __undefined,
            __undefined,
            [
                datasetRid,
            ],
            __undefined,
            "application/octet-stream"
        );
    }

    public getRawDataOrError(datasetRid: string): Promise<{ status: "success", response: ReadableStream<Uint8Array> }> {
        return this.getRawData(datasetRid)
            .then(response => ({ status: "success", response }) as { status: "success", response: ReadableStream<Uint8Array> })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public getAliasedRawData(datasetRid: string): Promise<ReadableStream<Uint8Array>> {
        return this.bridge.call<ReadableStream<Uint8Array>>(
            "TestService",
            "getAliasedRawData",
            "GET",
            "/catalog/datasets/{datasetRid}/raw-aliased",
            __undefined,
            __undefined,
            __undefined,
            [
                datasetRid,
            ],
            __undefined,
            "application/octet-stream"
        );
    }

    public getAliasedRawDataOrError(datasetRid: string): Promise<{ status: "success", response: ReadableStream<Uint8Array> }> {
        return this.getAliasedRawData(datasetRid)
            .then(response => ({ status: "success", response }) as { status: "success", response: ReadableStream<Uint8Array> })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public maybeGetRawData(datasetRid: string): Promise<ReadableStream<Uint8Array> | null> {
        return this.bridge.call<ReadableStream<Uint8Array> | null>(
            "TestService",
            "maybeGetRawData",
            "GET",
            "/catalog/datasets/{datasetRid}/raw-maybe",
            __undefined,
            __undefined,
            __undefined,
            [
                datasetRid,
            ],
            __undefined,
            "application/octet-stream"
        );
    }

    public maybeGetRawDataOrError(datasetRid: string): Promise<{ status: "success", response: ReadableStream<Uint8Array> | null }> {
        return this.maybeGetRawData(datasetRid)
            .then(response => ({ status: "success", response }) as { status: "success", response: ReadableStream<Uint8Array> | null })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public getAliasedString(datasetRid: string): Promise<string> {
        return this.bridge.call<string>(
            "TestService",
            "getAliasedString",
            "GET",
            "/catalog/datasets/{datasetRid}/string-aliased",
            __undefined,
            __undefined,
            __undefined,
            [
                datasetRid,
            ],
            __undefined,
            __undefined
        );
    }

    public getAliasedStringOrError(datasetRid: string): Promise<{ status: "success", response: string }> {
        return this.getAliasedString(datasetRid)
            .then(response => ({ status: "success", response }) as { status: "success", response: string })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public uploadRawData(input: ReadableStream<Uint8Array> | BufferSource | Blob): Promise<void> {
        return this.bridge.call<void>(
            "TestService",
            "uploadRawData",
            "POST",
            "/catalog/datasets/upload-raw",
            input,
            __undefined,
            __undefined,
            __undefined,
            "application/octet-stream",
            __undefined
        );
    }

    public uploadRawDataOrError(input: ReadableStream<Uint8Array> | BufferSource | Blob): Promise<{ status: "success", response: void }> {
        return this.uploadRawData(input)
            .then(response => ({ status: "success", response }) as { status: "success", response: void })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public uploadAliasedRawData(input: ReadableStream<Uint8Array> | BufferSource | Blob): Promise<void> {
        return this.bridge.call<void>(
            "TestService",
            "uploadAliasedRawData",
            "POST",
            "/catalog/datasets/upload-raw-aliased",
            input,
            __undefined,
            __undefined,
            __undefined,
            "application/octet-stream",
            __undefined
        );
    }

    public uploadAliasedRawDataOrError(input: ReadableStream<Uint8Array> | BufferSource | Blob): Promise<{ status: "success", response: void }> {
        return this.uploadAliasedRawData(input)
            .then(response => ({ status: "success", response }) as { status: "success", response: void })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public getBranches(datasetRid: string): Promise<ReadonlyArray<string>> {
        return this.bridge.call<ReadonlyArray<string>>(
            "TestService",
            "getBranches",
            "GET",
            "/catalog/datasets/{datasetRid}/branches",
            __undefined,
            __undefined,
            __undefined,
            [
                datasetRid,
            ],
            __undefined,
            __undefined
        );
    }

    public getBranchesOrError(datasetRid: string): Promise<{ status: "success", response: ReadonlyArray<string> }> {
        return this.getBranches(datasetRid)
            .then(response => ({ status: "success", response }) as { status: "success", response: ReadonlyArray<string> })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    /**
     * Gets all branches of this dataset.
     *
     * @deprecated use getBranches instead
     */
    public getBranchesDeprecated(datasetRid: string): Promise<ReadonlyArray<string>> {
        return this.bridge.call<ReadonlyArray<string>>(
            "TestService",
            "getBranchesDeprecated",
            "GET",
            "/catalog/datasets/{datasetRid}/branchesDeprecated",
            __undefined,
            __undefined,
            __undefined,
            [
                datasetRid,
            ],
            __undefined,
            __undefined
        );
    }

    /**
     * Gets all branches of this dataset.
     *
     * @deprecated use getBranches instead
     */
    public getBranchesDeprecatedOrError(datasetRid: string): Promise<{ status: "success", response: ReadonlyArray<string> }> {
        return this.getBranchesDeprecated(datasetRid)
            .then(response => ({ status: "success", response }) as { status: "success", response: ReadonlyArray<string> })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public resolveBranch(datasetRid: string, branch: string): Promise<string | null> {
        return this.bridge.call<string | null>(
            "TestService",
            "resolveBranch",
            "GET",
            "/catalog/datasets/{datasetRid}/branches/{branch:.+}/resolve",
            __undefined,
            __undefined,
            __undefined,
            [
                datasetRid,

                branch,
            ],
            __undefined,
            __undefined
        );
    }

    public resolveBranchOrError(datasetRid: string, branch: string): Promise<{ status: "success", response: string | null }> {
        return this.resolveBranch(datasetRid, branch)
            .then(response => ({ status: "success", response }) as { status: "success", response: string | null })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public testParam(datasetRid: string): Promise<string | null> {
        return this.bridge.call<string | null>(
            "TestService",
            "testParam",
            "GET",
            "/catalog/datasets/{datasetRid}/testParam",
            __undefined,
            __undefined,
            __undefined,
            [
                datasetRid,
            ],
            __undefined,
            __undefined
        );
    }

    public testParamOrError(datasetRid: string): Promise<{ status: "success", response: string | null }> {
        return this.testParam(datasetRid)
            .then(response => ({ status: "success", response }) as { status: "success", response: string | null })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public testQueryParams(query: string, something: string, implicit: string, setEnd: ReadonlyArray<string>, optionalMiddle?: string | null, optionalEnd?: string | null): Promise<number> {
        return this.bridge.call<number>(
            "TestService",
            "testQueryParams",
            "POST",
            "/catalog/test-query-params",
            query,
            __undefined,
            {
                "different": something,

                "implicit": implicit,

                "setEnd": setEnd,

                "optionalMiddle": optionalMiddle,

                "optionalEnd": optionalEnd,
            },
            __undefined,
            __undefined,
            __undefined
        );
    }

    public testQueryParamsOrError(query: string, something: string, implicit: string, setEnd: ReadonlyArray<string>, optionalMiddle?: string | null, optionalEnd?: string | null): Promise<{ status: "success", response: number }> {
        return this.testQueryParams(query, something, implicit, setEnd, optionalMiddle, optionalEnd)
            .then(response => ({ status: "success", response }) as { status: "success", response: number })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public testNoResponseQueryParams(query: string, something: string, implicit: string, setEnd: ReadonlyArray<string>, optionalMiddle?: string | null, optionalEnd?: string | null): Promise<void> {
        return this.bridge.call<void>(
            "TestService",
            "testNoResponseQueryParams",
            "POST",
            "/catalog/test-no-response-query-params",
            query,
            __undefined,
            {
                "different": something,

                "implicit": implicit,

                "setEnd": setEnd,

                "optionalMiddle": optionalMiddle,

                "optionalEnd": optionalEnd,
            },
            __undefined,
            __undefined,
            __undefined
        );
    }

    public testNoResponseQueryParamsOrError(query: string, something: string, implicit: string, setEnd: ReadonlyArray<string>, optionalMiddle?: string | null, optionalEnd?: string | null): Promise<{ status: "success", response: void }> {
        return this.testNoResponseQueryParams(query, something, implicit, setEnd, optionalMiddle, optionalEnd)
            .then(response => ({ status: "success", response }) as { status: "success", response: void })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public testBoolean(): Promise<boolean> {
        return this.bridge.call<boolean>(
            "TestService",
            "testBoolean",
            "GET",
            "/catalog/boolean",
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined
        );
    }

    public testBooleanOrError(): Promise<{ status: "success", response: boolean }> {
        return this.testBoolean()
            .then(response => ({ status: "success", response }) as { status: "success", response: boolean })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public testDouble(): Promise<number | "NaN"> {
        return this.bridge.call<number | "NaN">(
            "TestService",
            "testDouble",
            "GET",
            "/catalog/double",
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined
        );
    }

    public testDoubleOrError(): Promise<{ status: "success", response: number | "NaN" }> {
        return this.testDouble()
            .then(response => ({ status: "success", response }) as { status: "success", response: number | "NaN" })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public testInteger(): Promise<number> {
        return this.bridge.call<number>(
            "TestService",
            "testInteger",
            "GET",
            "/catalog/integer",
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined
        );
    }

    public testIntegerOrError(): Promise<{ status: "success", response: number }> {
        return this.testInteger()
            .then(response => ({ status: "success", response }) as { status: "success", response: number })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public testPostOptional(maybeString?: string | null): Promise<string | null> {
        return this.bridge.call<string | null>(
            "TestService",
            "testPostOptional",
            "POST",
            "/catalog/optional",
            maybeString,
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined
        );
    }

    public testPostOptionalOrError(maybeString?: string | null): Promise<{ status: "success", response: string | null }> {
        return this.testPostOptional(maybeString)
            .then(response => ({ status: "success", response }) as { status: "success", response: string | null })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }

    public testOptionalIntegerAndDouble(maybeInteger?: number | null, maybeDouble?: number | "NaN" | null): Promise<void> {
        return this.bridge.call<void>(
            "TestService",
            "testOptionalIntegerAndDouble",
            "GET",
            "/catalog/optional-integer-double",
            __undefined,
            __undefined,
            {
                "maybeInteger": maybeInteger,

                "maybeDouble": maybeDouble,
            },
            __undefined,
            __undefined,
            __undefined
        );
    }

    public testOptionalIntegerAndDoubleOrError(maybeInteger?: number | null, maybeDouble?: number | "NaN" | null): Promise<{ status: "success", response: void }> {
        return this.testOptionalIntegerAndDouble(maybeInteger, maybeDouble)
            .then(response => ({ status: "success", response }) as { status: "success", response: void })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }
}
