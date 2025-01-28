import {supabase} from "@/config/supabaseClientConfig";

export class UserService {
    TABLE_NAME = "Article"

    constructor() {
    }

    async getUserSession() {
        return await supabase.auth.getSession();
    }

    async signIn(email: string, password: string){
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error
        else return true
    }

    async signUp(email: string, password: string, name:string){
        const {error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });

        if (error) throw error
        else return true
    }


}