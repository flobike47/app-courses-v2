import {List} from "@/models/List";
import {supabase} from "@/config/supabaseClientConfig";

export class ListService {

    TABLE_NAME = "List"

    constructor() {
    }

    async getLists(): List[] {

        const {data: lists, status,error} = await supabase
            .from(this.TABLE_NAME)
            .select()

        if (status == 200) return lists
        else throw error
    }

    async createList(list: List): boolean {
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