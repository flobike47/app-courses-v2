import {Unity} from "@/models/Unity";
import {supabase} from "@/config/supabaseClientConfig";

export class UnityService {


    async getUnities() : Unity[] {
        const { data, error } = await supabase
            .from('Unity')
            .select('id, name')

        if (!error) return data
        else throw error
    }
}