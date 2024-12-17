import { IHttpApiBridge, Result, Success } from "conjure-client";

/** Constant reference to `undefined` that we expect to get minified and therefore reduce total code size */
const __undefined: undefined = undefined;

export interface IPrimitiveService {
    getPrimitive(): Promise<number>;
    getPrimitiveOrError(): Promise<Result<number, never>>;
}

export class PrimitiveService {
    constructor(private bridge: IHttpApiBridge) {
    }

    public getPrimitive(): Promise<number> {
        return this.bridge.call<number>(
            "PrimitiveService",
            "getPrimitive",
            "GET",
            "/getPrimitive",
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined,
            __undefined
        );
    }

    public getPrimitiveOrError(): Promise<Result<number, never>> {
        return this.getPrimitive()
            .then(response => ({ status: "success", response }) as Success<number>)
            .catch((e: any) => {
                if (e == null || e.body == null) {
                    throw e;
                }
                throw e;
            });
    }
}
