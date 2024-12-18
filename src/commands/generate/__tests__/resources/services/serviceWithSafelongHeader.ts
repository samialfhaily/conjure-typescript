import { IHttpApiBridge } from "conjure-client";

/** Constant reference to `undefined` that we expect to get minified and therefore reduce total code size */
const __undefined: undefined = undefined;

export interface IServiceWithSafelongHeader {
    foo(investigation: number): Promise<void>;
    fooOrError(investigation: number): Promise<{ status: "success", response: void } | { status: "failure", error: never }>;
}

export class ServiceWithSafelongHeader {
    constructor(private bridge: IHttpApiBridge) {
    }

    public foo(investigation: number): Promise<void> {
        return this.bridge.call<void>(
            "ServiceWithSafelongHeader",
            "foo",
            "GET",
            "/foo",
            __undefined,
            {
                "X-Investigation": investigation.toString(),
            },
            __undefined,
            __undefined,
            __undefined,
            __undefined
        );
    }

    public fooOrError(investigation: number): Promise<{ status: "success", response: void } | { status: "failure", error: never }> {
        return this.foo(investigation)
            .then(response => ({ status: "success", response }) as { status: "success", response: void });
    }
}
