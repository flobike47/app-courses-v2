import {UserService} from "@/services/UserService";
import {supabase} from "@/config/supabaseClientConfig";
import {User} from "@/models/User";
import {Circle} from "@/models/Circle";
import {ErrorsUtils} from "@/models/ErrorsUtils";

export class CircleService{
    TABLE_NAME = "Circle"

    private userService = new UserService()

    async getUserCircle(){
        const user : User = await this.userService.getUserInDB()

        if (user.circle){
            return user.circle
        }else {
            return null
        }
    }

    async getCircleByCode(code: string): Circle{
        console.log(code)
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('id, code')
            .eq("code",code)

        if (error) throw error;
        console.log(data)
        return data[0]
    }

    async joinCircle(code:string){
        const circle = await this.getCircleByCode(code)
        console.log(circle)

        if (!circle) throw Error(ErrorsUtils.CIRCLE_NOT_FOUND)

        await this.userService.updateCircleUserInDB(circle)
    }

    async createCircle(circle:Circle){
        const { status ,error} = await supabase.from(this.TABLE_NAME).insert(circle)

        if (status == 201){
            return true
        }else {
            throw error
        }
    }
}