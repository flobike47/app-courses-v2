import { Storage } from '@ionic/storage';


export class AppStorageService {

    static #instance: AppStorageService;
    private storageConnector: Storage

    private DARK_MODE_KEY = "DARK_MODE"
    private SAVED_ARTICLE_BASE= "SAVED_ARTICLE_"

    constructor() {
        const storage = new Storage();
        storage.create();

        this.storageConnector = storage
    }

    public static getInstance(): AppStorageService {
        if (!AppStorageService.#instance) {
            AppStorageService.#instance = new AppStorageService();
        }

        return AppStorageService.#instance;
    }


    public async getDarkMode(): boolean {
        return await this.storageConnector.get(this.DARK_MODE_KEY)
    }

    public async setDarkMode(value: boolean): void {
        await this.storageConnector.set(this.DARK_MODE_KEY, value)
    }


    public async getSavedArticles(listId: number): number[] {
        return await this.storageConnector.get(this.SAVED_ARTICLE_BASE+listId)
    }

    public async setSavedArticles(listId: number, value: number[]): void {
        await this.storageConnector.set(this.SAVED_ARTICLE_BASE+listId, value)
    }

    public async removeSavedArticles(listId: number): void {
        await this.storageConnector.remove(this.SAVED_ARTICLE_BASE+listId)
    }

}