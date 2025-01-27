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
            .order("label")

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


    async createArticle(name: string, unity: number, unity_value: number, list: number, label: number) {
        const { error } = await supabase
            .from('Article')
            .insert([{
                name: name,
                unity: unity,
                unity_value: unity_value,
                list: list,
                label: label
            }])
            .select()

        if (error) throw error
        else return true
    }

    async deleteArticles(ids: number[]) {
        const { error } = await supabase
            .from('Article')
            .delete()
            .in('id', ids)

        if (error) throw error
        else return true
    }
}