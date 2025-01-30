import {List} from "@/models/List";
import {supabase} from "@/config/supabaseClientConfig";
import {UserService} from "@/services/UserService";

export class ListService {

    TABLE_NAME = "List"

    userService = new UserService()

    constructor() {
    }

    async getCircleLists(): List[] {
        const user = await this.userService.getUserInDB()
        const {data: lists, status,error} = await supabase
            .from(this.TABLE_NAME)
            .select()
            .eq('circle', user.circle.id)

        if (status == 200) return lists
        else throw error
    }

    async createList(list: List): boolean {
        const user = await this.userService.getUserInDB()
        list.circle = user.circle.id
        const { status ,error} = await supabase.from(this.TABLE_NAME).insert(list)
        if (status == 201){
            return true
        }else {
            throw error
        }

    }

    async deleteList(id: number): boolean {
        const { error,status } = await supabase
            .from('List')
            .delete()
            .eq('id', id)

        if (status == 204){
            return true
        }else {
            throw error
        }
    }


}