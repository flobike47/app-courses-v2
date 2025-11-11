import {List} from "@/models/List";
import {supabase} from "@/config/supabaseClientConfig";
import {UserService} from "@/services/UserService";
import {NetworkService} from "@/services/NetworkService";
import {getOfflineData, handleFetchResult} from "@/utils/DataServiceUtils";

export class ListService {

    TABLE_NAME = "List"

    userService = new UserService()

    constructor() {
    }

    async getCircleLists(): List[] {
        const storageKey = "CIRCLE_LISTS"

        if (!NetworkService.networkAvailable) {
            return await getOfflineData(storageKey);
        }

        const user = await this.userService.getUserInDB()
        const result = await supabase
            .from(this.TABLE_NAME)
            .select()
            .eq('circle', user.circle.id)

        return handleFetchResult(result, storageKey);
    }

    async createList(list: List): boolean {
        const user = await this.userService.getUserInDB()
        list.circle = user.circle.id
        const {status, error} = await supabase.from(this.TABLE_NAME).insert(list)
        if (status == 201) {
            return true
        } else {
            throw error
        }

    }

    async deleteList(id: number): boolean {
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

}