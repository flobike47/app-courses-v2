import {Storage} from '@ionic/storage';
import eventBus from "@/services/EventBus";
import {StorageCommands} from "@/models/eventCommand/StorageCommands";


export class AppStorageService {

    static #instance: AppStorageService;
    private storageConnector: Storage

    private DARK_MODE_KEY = "DARK_MODE"
    private SAVED_ARTICLE_BASE = "SELECTED_ARTICLE_"

    constructor() {
        const storage = new Storage();
        storage.create();

        this.storageConnector = storage
    }

    public static getInstance(): AppStorageService {
        if (!AppStorageService.#instance) {
            AppStorageService.#instance = new AppStorageService();
            this.#instance.openStorage();
        }

        return AppStorageService.#instance;
    }


    public async getDarkMode(): boolean {
        return await this.storageConnector.get(this.DARK_MODE_KEY)
    }

    public async setDarkMode(value: boolean): void {
        await this.storageConnector.set(this.DARK_MODE_KEY, value)
    }


    public async getSelectedArticles(listId: number): number[] {
        return await this.storageConnector.get(this.SAVED_ARTICLE_BASE+listId)
    }

    public async setSelectedArticles(listId: number, value: number[]): void {
        await this.storageConnector.set(this.SAVED_ARTICLE_BASE+listId, value)
    }

    public async removeSelectedArticles(listId: number): void {
        await this.storageConnector.remove(this.SAVED_ARTICLE_BASE+listId)
    }

    public getStorageConnector(): Storage {
        return this.storageConnector;
    }

    public openStorage(): void {
        eventBus.on(StorageCommands.OFFLINE_SAVE, (pair) => {
            console.log("Saving data offline:", pair);
            this.storageConnector.set(pair.key, pair.value);
        });

        eventBus.on(StorageCommands.OFFLINE_GET, async (key) => {
            const value = await this.storageConnector.get(key);
            console.log("Retrieving offline data for key:", key, "Value:", value);
            eventBus.emit(key, value);
        });

        eventBus.on(StorageCommands.OFFLINE_DELETE, (key) => {
            this.storageConnector.remove(key);
        });
    }
}