import {Storage} from '@ionic/storage';
import eventBus from "@/services/EventBus";
import {StorageCommands} from "@/models/eventCommand/StorageCommands";


let storageConnector: Storage

const DARK_MODE_KEY = "DARK_MODE"
const SAVED_ARTICLE_BASE = "SELECTED_ARTICLE_"


const initStorageConnector = async (): Storage => {
    if (!storageConnector) {
        const storage = new Storage();
        await storage.create();

        storageConnector = storage
    }

    return storageConnector;
}
const getDarkMode = async (): Promise<boolean> => {
    return await storageConnector.get(DARK_MODE_KEY)
}

const setDarkMode = async (value: boolean): Promise<void> => {
    await storageConnector.set(DARK_MODE_KEY, value)
}


const getSelectedArticles = async (listId: number): Promise<number[]> => {
    return await storageConnector.get(SAVED_ARTICLE_BASE + listId)
}

const setSelectedArticles = async (listId: number, value: number[]): Promise<void> => {
    await storageConnector.set(SAVED_ARTICLE_BASE + listId, value)
}

const removeSelectedArticles = async (listId: number): Promise<void> => {
    await storageConnector.remove(SAVED_ARTICLE_BASE + listId)
}

const getStorageConnector = async (): Promise<Storage> => {
    await initStorageConnector();
    return storageConnector;
}

const openStorage = (): void => {
    initStorageConnector();
    eventBus.on(StorageCommands.OFFLINE_SAVE, async (pair) => {
        await storageConnector.set(pair.key, pair.value);
    });

    eventBus.on(StorageCommands.OFFLINE_GET, async (key) => {
        const value = await storageConnector.get(key);
        eventBus.emit(key, value);
    });

    eventBus.on(StorageCommands.OFFLINE_DELETE, async (key) => {
        await storageConnector.remove(key);
    });
}

export const AppStorageService = {
    getDarkMode,
    setDarkMode,
    getSelectedArticles,
    setSelectedArticles,
    removeSelectedArticles,
    getStorageConnector,
    openStorage
};