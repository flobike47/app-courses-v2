import {supabase} from "@/config/supabaseClientConfig";
import {Capacitor} from "@capacitor/core";
import {User} from "@/models/User";
import {Circle} from "@/models/Circle";


const TABLE_NAME = "User"


const getUserSession = async () => {
    return await supabase.auth.getSession();
}

const setUserSession = async (accessToken: string, refresh_token: string) => {
    const {data, error} = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refresh_token
    });

    if (error) throw error
    else return true

}

const signIn = async (email: string, password: string) => {
    const {error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) throw error;

}

const signInWithGoogle = async () => {
    supabase?.auth.signInWithOAuth({
        provider: "google",
        options: Capacitor.isNativePlatform()
            ? {
                redirectTo: "app-courses://localhost",
            }
            : {},
    });
}

const signUp = async (email: string, password: string, name: string) => {
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

const createUserInDB = async (data) => {
    const {error} = await supabase
        .from(TABLE_NAME)
        .insert([{id: data.user.id, name: data.user.user_metadata.full_name}])

    if (error) throw error

}

const getUserInDB = async (): Promise<User> => {
    const uuid = (await getUserSession()).data.session?.user.id
    const {data, error} = await supabase
        .from(TABLE_NAME)
        .select('id, name, circle(id, code, private_code)')
        .eq("id", uuid)

    if (error) throw error;
    return data[0]

}

const finishGoogleLogin = async (userSession) => {
    const userFound: User = await getUserInDB()
    if (!userFound) {
        await createUserInDB(userSession ?? null)
    }
}

const updateCircleUserInDB = async (circle: Circle) => {
    const uuid = (await getUserSession()).data.session?.user.id

    const {error} = await supabase
        .from(TABLE_NAME)
        .update({circle: circle.id})
        .eq("id", uuid)

    if (error) throw error

}

export const UserService = {
    getUserSession,
    setUserSession,
    signIn,
    signInWithGoogle,
    signUp,
    createUserInDB,
    getUserInDB,
    finishGoogleLogin,
    updateCircleUserInDB
};