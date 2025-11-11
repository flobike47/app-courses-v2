import {Label} from "@/models/Label";
import {supabase} from "@/config/supabaseClientConfig";
import {getOfflineData, handleFetchResult} from "@/utils/DataServiceUtils";

export class LabelService {

    private CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    async getLabels() : Label[] {
        const storageKey = "LABELS"

        const labels = await getOfflineData(storageKey);

        if (labels) {
            return labels;
        }

        const result = await supabase
            .from('Label')
            .select('id, name')

        return handleFetchResult(result, storageKey, this.CACHE_DURATION);
    }
}