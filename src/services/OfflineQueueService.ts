import {AppStorageService} from "@/services/AppStorageService";
import {QueueItem} from "@/models/QueueItem";
import eventBus from "@/services/EventBus";
import {NetworkCommands} from "@/models/eventCommand/NetworkCommands";
import {ListService} from "@/services/ListService";
import {ArticleService} from "@/services/ArticleService";
import {Article} from "@/models/Article";
import {Storage} from '@ionic/storage';
import {ArticleCommands} from "@/models/eventCommand/ArticleCommands";
import {List} from "@/models/List";
import {ListCommands} from "@/models/eventCommand/ListCommands";

const OFFLINE_QUEUE_KEY = 'OFFLINE_QUEUE';
let appStorage: Storage

const openOfflineQueue = async () => {
    appStorage = await AppStorageService.getStorageConnector();
    eventBus.on(NetworkCommands.ONLINE, async () => {

        const queue = await getOfflineQueue();

        if (!queue) return

        const listToPersist: QueueItem[] = queue.filter(item => item.instance === "LIST")
        const articleToPersist: QueueItem[] = queue.filter(item => item.instance === "ARTICLE");

        for (const listItem of listToPersist) {
            if (listItem.persistedItemId) continue;

            listItem.item.id = undefined;
            listItem.persistedItemId = await ListService.createList(listItem.item);

            await appStorage.set(OFFLINE_QUEUE_KEY, [...listToPersist, ...articleToPersist]);

        }

        if (listToPersist.length != 0) eventBus.emit(ListCommands.RELOAD);

        for (const articleItem of articleToPersist) {

            if (articleItem.referenceId) {
                const correspondingList = listToPersist.find(listItem => listItem.tempItemId.toString() === articleItem.referenceId?.toString());
                if (correspondingList && correspondingList.persistedItemId) {
                    articleItem.item.list = correspondingList.persistedItemId;
                }
            }

            if (articleItem.persistedItemId) continue;

            articleItem.persistedItemId = await ArticleService.createArticle(
                articleItem.item.name,
                articleItem.item.unity,
                articleItem.item.unity_value,
                articleItem.item.list,
                articleItem.item.label);

            await appStorage.set(OFFLINE_QUEUE_KEY, [...listToPersist, ...articleToPersist]);
        }

        articleToPersist
            .map(articleItem => articleItem.item.list)
            .filter((value, index, self) => self.indexOf(value) === index)
            .forEach(listId => eventBus.emit(ArticleCommands.RELOAD(listId)))

        await appStorage.remove(OFFLINE_QUEUE_KEY);
    });
}

const saveToOfflineQueue = async (item: QueueItem) => {
    if (item.instance === "LIST") handleListItem(item);
    if (item.instance === "ARTICLE") handleArticleItem(item);

    const queue = await getOfflineQueue();
    queue.push(item);
    appStorage.set(OFFLINE_QUEUE_KEY, queue);
}

const handleListItem = async (item: QueueItem) => {
    const listsStorageKey = "CIRCLE_LISTS"
    const lists: List[] = await appStorage.get(listsStorageKey) || [];
    item.item.id = item.tempItemId;
    lists.push(item.item);
    appStorage.set(listsStorageKey, lists);
    appStorage.set(`LIST_ARTICLES_${item.item.id}`, []);
}

const handleArticleItem = async (item: QueueItem) => {
    const storageKey = `LIST_ARTICLES_${item.referenceId}`;
    const listArticles: Article[] = await appStorage.get(storageKey) || [];
    listArticles.push(item.item);
    await appStorage.set(storageKey, listArticles);
}

const getOfflineQueue = async (): Promise<QueueItem[]> => {
    const queue = await appStorage.get(OFFLINE_QUEUE_KEY);
    return queue || [];
}

export const OfflineQueueService = {openOfflineQueue, saveToOfflineQueue};