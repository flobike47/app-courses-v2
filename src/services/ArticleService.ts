import {supabase} from "@/config/supabaseClientConfig";
import {Article} from "@/models/Article";
import {getOfflineData, handleFetchResult} from "@/utils/DataServiceUtils";
import {NetworkService} from "@/services/NetworkService";
import {QueueItem} from "@/models/QueueItem";
import {OfflineQueueService} from "@/services/OfflineQueueService";

const TABLE_NAME = "Article"

const getListArticle = async (listId: number): Promise<Article[]> => {
    const storageKey = `LIST_ARTICLES_${listId}`

    if (!NetworkService.networkAvailable) {
        return await getOfflineData(storageKey);
    }

    const result = await supabase
        .from(TABLE_NAME)
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


const createArticle = async (name: string, unity: number, unity_value: number, list: number, label: number) => {

    if (!NetworkService.networkAvailable) {
        const article: Article = new Article(name, unity, unity_value, list, {name: "you"}, label);

        const offlineArticle = new QueueItem(article, "ARTICLE", list);
        await OfflineQueueService.saveToOfflineQueue(offlineArticle);
        return null;
    }


    const user = await supabase.auth.getUser()

    const {error, data: article} = await supabase
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
        .single()

    if (error) throw error
    else return article.id
}

const deleteArticles = async (ids: number[]) => {
    const {error} = await supabase
        .from('Article')
        .update({deleted: true, deleted_at: new Date().toISOString()})
        //géré dans le back pour être vraiment supprimé après 24h
        .in('id', ids)

    if (error) throw error
    else return true

}

export const ArticleService = {
    getListArticle,
    createArticle,
    deleteArticles
};