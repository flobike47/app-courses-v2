import {List} from "@/models/List";
import {supabase} from "@/config/supabaseClientConfig";

export class ListService {

    constructor() {
    }

    async getLists() : List[]{
        try {
            const { data: lists } = await supabase
                .from('List')
                .select();

            return lists
        } catch (error) {
            return null;
        }
    }
}