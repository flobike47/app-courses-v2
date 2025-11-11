import eventBus from "@/services/EventBus";
import {StorageCommands} from "@/models/eventCommand/StorageCommands";
import {List} from "@/models/List";
import {Pair} from "@/models/Pair";
import {ValueWithLifetime} from "@/models/ValueWithLifetime";
import {NetworkService} from "@/services/NetworkService";

const getOfflineData = async (storageKey: string) => {
    await eventBus.emit(StorageCommands.OFFLINE_GET, storageKey)
    return await new Promise((resolve) => {
        eventBus.on(storageKey, (offlineData: any[] | ValueWithLifetime) => {
            eventBus.off(storageKey)
            if (offlineData && offlineData.expirationDate) {
                const now = new Date().getTime()
                if (now > offlineData.expirationDate && NetworkService.networkAvailable) {
                    eventBus.emit(StorageCommands.OFFLINE_DELETE, storageKey)
                    resolve([])
                } else {
                    resolve(offlineData.value)
                }
            }
            resolve(offlineData)
        })
    })
}

const handleFetchResult = async (result, storageKey: string, duration?: number): List[] => {

    const {data: lists, status, error} = result

    if (status == 200) {
        console.log("duration", duration)
        if (duration) {
            const valueWithExpiry = new ValueWithLifetime(lists, duration)
            saveOfflineData(new Pair(storageKey, valueWithExpiry))
        } else {
            saveOfflineData(new Pair(storageKey, lists))
        }
        return lists
    } else throw error
}

const saveOfflineData = async (pair) => {
    eventBus.emit(StorageCommands.OFFLINE_SAVE, pair)
}

export {getOfflineData, handleFetchResult, saveOfflineData};