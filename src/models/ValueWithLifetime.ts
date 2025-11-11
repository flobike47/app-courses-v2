export class ValueWithLifetime {
    value: string;
    expirationDate: Date;

    constructor(value: string, lifetimeInMinutes: number) {
        this.value = value;
        this.expirationDate = new Date(Date.now() + lifetimeInMinutes * 60000);
    }
}