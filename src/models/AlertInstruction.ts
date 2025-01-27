export class AlertInstruction {
    public message: string
    public eventCallback: string


    constructor(message: string, eventCallback: string) {
        this.message = message;
        this.eventCallback = eventCallback;
    }
}