import {Unity} from "@/models/Unity";
import {supabase} from "@/config/supabaseClientConfig";
import {getOfflineData, handleFetchResult} from "@/utils/DataServiceUtils";

export class UnityService {

    private CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    async getUnities() : Unity[] {
        const storageKey = "UNITIES"

        const unities = await getOfflineData(storageKey);

        if (unities) {
            return unities;
        }

        const result = await supabase
            .from('Unity')
            .select('id, name')

        return handleFetchResult(result, storageKey, this.CACHE_DURATION);
    }
}