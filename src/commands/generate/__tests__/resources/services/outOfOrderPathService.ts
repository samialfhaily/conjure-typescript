import { IHttpApiBridge, Result, Success } from "conjure-client";

/** Constant reference to `undefined` that we expect to get minified and therefore reduce total code size */
const __undefined: undefined = undefined;

export interface IOutOfOrderPathService {
    foo(param1: string, param2: string): Promise<void>;
    fooOrError(param1: string, param2: string): Promise<Result<void, never>>;
}

export class OutOfOrderPathService {
    constructor(private bridge: IHttpApiBridge) {
    }

    public foo(param1: string, param2: string): Promise<void> {
        return this.bridge.call<void>(
            "OutOfOrderPathService",
            "foo",
            "GET",
            "/{param2}/{param1}",
            __undefined,
            __undefined,
            __undefined,
            [
                param2,

                param1,
            ],
            __undefined,
            __undefined
        );
    }

    public fooOrError(param1: string, param2: string): Promise<Result<void, never>> {
        return this.foo(param1, param2)
            .then(response => ({ status: "success", response }) as Success<void>);
    }
}
