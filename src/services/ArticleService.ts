import {supabase} from "@/config/supabaseClientConfig";
import {Article} from "@/models/Article";

export class ArticleService{
    TABLE_NAME = "Article"

    constructor() {
    }

    async getListArticle(listId: number): Article[] {


        const {data: lists, status} = await supabase
            .from(this.TABLE_NAME)
            .select(`id,
                created_at,
                name,
                unity(id, name),
                unity_value,
                list(id, name),
                added_by,
                deleted,
                deleted_at,
                label(id,name)
            `)
            .eq('list', listId)

        switch (status){
            case 200:
                if (lists){
                    return lists
                }else {
                    throw new Error("Pas d'articles trouvé pour cette liste")
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
}