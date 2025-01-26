import {List} from "@/models/List";
import {supabase} from "@/config/supabaseClientConfig";

export class ListService {

    TABLE_NAME = "List"

    constructor() {
    }

    async getLists() : List[]{
        try {
            const { data: lists } = await supabase
                .from(TABLE_NAME)
                .select();

            return lists
        } catch (error) {
            return null;
        }
    }

    async createList(list: List): boolean {
        const { status } = await supabase
            .from(this.TABLE_NAME)
            .insert(list)
        if (status == 201){
            return true
        }else {
            console.log(status)
        }

    }
}