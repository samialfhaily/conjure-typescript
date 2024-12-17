import { IHttpApiBridge } from "conjure-client";

/** Constant reference to `undefined` that we expect to get minified and therefore reduce total code size */
const __undefined: undefined = undefined;

export interface IPrimitiveService {
    getPrimitive(): Promise<number>;
    getPrimitiveOrError(): Promise<{ status: "success", response: number }>;
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

    public async getPrimitiveOrError(): Promise<{ status: "success", response: number }> {
        try {
            return { status: "success", response: await this.getPrimitive() }
        } catch (e: any) {
            if (e == null || e.body == null) {
                throw e;
            }
            throw e;
        }
    }
}
