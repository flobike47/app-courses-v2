import {Label} from "@/models/Label";
import {supabase} from "@/config/supabaseClientConfig";
import {getOfflineData, handleFetchResult} from "@/utils/DataServiceUtils";


const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const getLabels = async (): Promise<Label[]> => {
    const storageKey = "LABELS"

    const labels = await getOfflineData(storageKey);

    if (labels) {
        return labels;
    }

    const result = await supabase
        .from('Label')
        .select('id, name')

    return handleFetchResult(result, storageKey, CACHE_DURATION);
}

export const LabelService = {getLabels};