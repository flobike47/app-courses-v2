import {code} from "ionicons/icons";

export class Circle {
    private _id: string
    public code: string
    private private_code:string


    constructor(code: string) {
        this.code = code;
    }

    get id(): string {
        return this._id;
    }


    get private_code(): string {
        return this.private_code;
    }

    set private_code(value: string) {
        this.private_code = value;
    }
}