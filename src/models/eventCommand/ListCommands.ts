export class ListCommands {
    static readonly RELOAD = "RELOAD_LIST"
    static readonly OPEN_CREATION = "OPEN_CREATION_MODAL"

    static DELETE(id: number): string {
        return `DELETE_LIST_${id}`;
    }
}