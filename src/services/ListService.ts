import {List} from "@/models/List";
import {supabase} from "@/config/supabaseClientConfig";
import {UserService} from "@/services/UserService";
import {NetworkService} from "@/services/NetworkService";
import {getOfflineData, handleFetchResult} from "@/utils/DataServiceUtils";
import {QueueItem} from "@/models/QueueItem";
import {OfflineQueueService} from "@/services/OfflineQueueService";


const TABLE_NAME = "List"

const userService = UserService


const getCircleLists = async (): List[] => {
    const storageKey = "CIRCLE_LISTS"

    if (!NetworkService.networkAvailable) {
        return await getOfflineData(storageKey);
    }

    const user = await userService.getUserInDB()
    const result = await supabase
        .from(TABLE_NAME)
        .select()
        .eq('circle', user.circle.id)

    return handleFetchResult(result, storageKey);
}

const createList = async (list: List): Promise<number> => {

    if (!NetworkService.networkAvailable) {

        const offlineArticle = new QueueItem(list, "LIST");
        await OfflineQueueService.saveToOfflineQueue(offlineArticle);
        return true;
    }


    const user = await userService.getUserInDB()
    list.circle = user.circle.id
    const {status, data: listPersisted, error} = await supabase
        .from(TABLE_NAME)
        .insert(list)
        .select()
        .single()

    if (status == 201) {
        return listPersisted.id
    } else {
        throw error
    }

}

const deleteList = async (id: number): Promise<boolean> => {
    const {error, status} = await supabase
        .from('List')
        .delete()
        .eq('id', id)

    if (status == 204) {
        return true
    } else {
        throw error
    }
}

export const ListService = {
    getCircleLists,
    createList,
    deleteList
};