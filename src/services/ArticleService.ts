import {supabase} from "@/config/supabaseClientConfig";
import {Article} from "@/models/Article";
import {getOfflineData, handleFetchResult} from "@/utils/DataServiceUtils";
import {NetworkService} from "@/services/NetworkService";

export class ArticleService {
    TABLE_NAME = "Article"

    constructor() {
    }

    async getListArticle(listId: number): Article[] {
        const storageKey = `LIST_ARTICLES_${listId}`

        if (!NetworkService.networkAvailable) {
            return await getOfflineData(storageKey);
        }

        const result = await supabase
            .from(this.TABLE_NAME)
            .select(`id,
                created_at,
                name,
                unity(id, name),
                unity_value,
                list(id, name),
                added_by(name),
                deleted,
                deleted_at,
                label(id,name)
            `)
            .eq('list', listId)
            .order("label")

        return handleFetchResult(result, storageKey);
    }


    async createArticle(name: string, unity: number, unity_value: number, list: number, label: number) {
        const user = await supabase.auth.getUser()

        const {error} = await supabase
            .from('Article')
            .insert([{
                name: name,
                unity: unity,
                unity_value: unity_value,
                list: list,
                label: label,
                added_by: user.data.user?.id
            }])
            .select()

        if (error) throw error
        else return true
    }

    async deleteArticles(ids: number[]) {
        const {error} = await supabase
            .from('Article')
            .update({deleted: true, deleted_at: new Date().toISOString()})
            //géré dans le back pour être vraiment supprimé après 24h
            .in('id', ids)

        if (error) throw error
        else return true
    }
}