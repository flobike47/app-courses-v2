import {supabase} from "@/config/supabaseClientConfig";
import {Capacitor} from "@capacitor/core";
import {User} from "@/models/User";
import {Circle} from "@/models/Circle";

export class UserService {
    TABLE_NAME = "User"

    constructor() {
    }

    async getUserSession() {
        return await supabase.auth.getSession();
    }

    async setUserSession(accessToken:string, refresh_token:string){
        const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refresh_token
        });

        if (error) throw error
        else return true

    }

    async signIn(email: string, password: string){
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) throw error;

    }

    async signInWithGoogle(){
        supabase?.auth.signInWithOAuth({
            provider: "google",
            options: Capacitor.isNativePlatform()
                ? {
                    redirectTo: "app-courses://localhost",
                }
                : {},
        });
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

    async createUserInDB(data){
        const { error } = await supabase
            .from(this.TABLE_NAME)
            .insert([{id:data.user.id, name:data.user.user_metadata.full_name}])

        if (error) throw error

    }

    async getUserInDB() : User{
        const uuid = (await this.getUserSession()).data.session?.user.id
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('id, name, circle(id, code)')
            .eq("id",uuid)

        if (error) throw error;
        return data[0]

    }

    async finishGoogleLogin(userSession){
        const userFound: User = await this.getUserInDB()
        if (!userFound) {
            await this.createUserInDB(userSession??null)
        }
    }

    async updateCircleUserInDB(circle: Circle){
        const uuid = (await this.getUserSession()).data.session?.user.id

        const { error } = await supabase
            .from(this.TABLE_NAME)
            .update({circle: circle.id})
            .eq("id",uuid)

        if (error) throw error

    }


}