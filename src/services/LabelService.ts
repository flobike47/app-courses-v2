import {Label} from "@/models/Label";
import {supabase} from "@/config/supabaseClientConfig";

export class LabelService {

    async getLabels() : Label[] {
        const { data, error } = await supabase
            .from('Label')
            .select('id, name')

        if (!error) return  data
        else throw error
    }
}