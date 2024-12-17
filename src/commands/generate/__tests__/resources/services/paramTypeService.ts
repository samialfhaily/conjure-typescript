import { IHttpApiBridge } from "conjure-client";

/** Constant reference to `undefined` that we expect to get minified and therefore reduce total code size */
const __undefined: undefined = undefined;

export interface IParamTypeService {
    foo(body: string, header: string, path: string, query: string): Promise<void>;
    fooOrError(body: string, header: string, path: string, query: string): Promise<{ status: "success", response: void }>;
}

export class ParamTypeService {
    constructor(private bridge: IHttpApiBridge) {
    }

    public foo(body: string, header: string, path: string, query: string): Promise<void> {
        return this.bridge.call<void>(
            "ParamTypeService",
            "foo",
            "GET",
            "/foo/{path}",
            body,
            {
                "Header": header,
            },
            {
                "Query": query,
            },
            [
                path,
            ],
            __undefined,
            __undefined
        );
    }

    public async fooOrError(body: string, header: string, path: string, query: string): Promise<{ status: "success", response: void }> {
        try {
            return { status: "success", response: await this.foo(body, header, path, query) }
        } catch (e: any) {
            if (e == null || e.body == null) {
                throw e;
            }
            throw e;
        }
    }
}
