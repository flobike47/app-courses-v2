import {UserService} from "@/services/UserService";
import {supabase} from "@/config/supabaseClientConfig";
import {User} from "@/models/User";
import {Circle} from "@/models/Circle";
import {ErrorsUtils} from "@/models/ErrorsUtils";

const TABLE_NAME = "Circle"

const getUserCircle = async () => {
    const user: User = await UserService.getUserInDB()

    if (user.circle) {
        return user.circle
    } else {
        return null
    }
}

const getCircleByCode = async (code: string, private_code: string): Circle => {
    console.log(code)
    const {data, error} = await supabase
        .from(TABLE_NAME)
        .select('id, code')
        .eq("code", code)
        .eq("private_code", private_code)

    if (error) throw error;
    console.log(data)
    return data[0]
}

const joinCircle = async (code: string, private_code: string) => {
    const circle = await getCircleByCode(code, private_code)

    if (!circle) throw Error(ErrorsUtils.CIRCLE_NOT_FOUND)

    await UserService.updateCircleUserInDB(circle)
}

const createCircle = async (circle: Circle) => {
    circle.private_code = generateRandomPrivateCode()
    const {status, error, data: circleInserted} = await supabase
        .from(TABLE_NAME)
        .insert(circle)
        .select()

    if (status == 201) {
        console.log(circleInserted)
        return circleInserted[0]
    } else {
        throw error
    }
}

const generateRandomPrivateCode = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const CircleService = {
    getUserCircle,
    getCircleByCode,
    joinCircle,
    createCircle
}