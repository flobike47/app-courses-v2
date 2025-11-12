export class QueueItem {
    tempItemId: number = Math.floor(100000000 + Math.random() * 900000000);
    item: any;
    instance: "LIST" | "ARTICLE";
    persistedItemId?: number;
    referenceId?: number;

    constructor(item: any, instance: "LIST" | "ARTICLE", referenceId?: number) {
        this.referenceId = referenceId;
        this.item = item;
        this.instance = instance;
    }
}