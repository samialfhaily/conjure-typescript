import { IHttpApiBridge, Result, Success } from "conjure-client";

/** Constant reference to `undefined` that we expect to get minified and therefore reduce total code size */
const __undefined: undefined = undefined;

export interface IOptionalService {
    foo(header: string, name?: string | null): Promise<void>;
    fooOrError(header: string, name?: string | null): Promise<Result<void, never>>;
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

    public fooOrError(header: string, name?: string | null): Promise<Result<void, never>> {
        return this.foo(header, name)
            .then(response => ({ status: "success", response }) as Success<void>);
    }
}
