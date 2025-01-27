import {List} from "@/models/List";
import {supabase} from "@/config/supabaseClientConfig";

export class ListService {

    TABLE_NAME = "List"

    constructor() {
    }

    async getLists(): List[] {

        const {data: lists, status} = await supabase
            .from(this.TABLE_NAME)
            .select()

        switch (status){
            case 200:
                if (lists){
                    return lists
                }else {
                    throw new Error("Pas de Liste trouvé")
                }
                break
            case 404:
                throw new Error("Table not found")
                break
            case 401:
                throw new Error("Appel non autorisé")
                break
        }
    }

    async createList(list: List): boolean {
        const { status } = await supabase.from(this.TABLE_NAME).insert(list)
        if (status == 201){
            return true
        }else {
            console.log(status)
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
            console.log(error)
        }
    }


}