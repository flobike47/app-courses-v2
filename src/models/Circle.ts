
export class Circle {
    private _id: string
    public code: string


    constructor(code: string) {
        this.code = code;
    }

    get id(): string {
        return this._id;
    }
}