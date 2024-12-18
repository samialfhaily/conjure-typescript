import { IHttpApiBridge } from "conjure-client";

/** Constant reference to `undefined` that we expect to get minified and therefore reduce total code size */
const __undefined: undefined = undefined;

export interface IOptionalService {
    foo(header: string, name?: string | null): Promise<void>;
    fooOrError(header: string, name?: string | null): Promise<{ status: "success", response: void } | { status: "failure", error: never }>;
}

export class OptionalService {
    constructor(private bridge: IHttpApiBridge) {
    }

    public foo(header: string, name?: string | null): Promise<void> {
        return this.bridge.call<void>(
            "OptionalService",
            "foo",
            "GET",
            "/foo",
            __undefined,
            {
                "Header": header,
            },
            {
                "Query": name,
            },
            __undefined,
            __undefined,
            __undefined
        );
    }

    public fooOrError(header: string, name?: string | null): Promise<{ status: "success", response: void } | { status: "failure", error: never }> {
        return this.foo(header, name)
            .then(response => ({ status: "success", response }) as { status: "success", response: void })
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }
}
