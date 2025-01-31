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

    async getCircleByCode(code: string, private_code:string): Circle{
        console.log(code)
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('id, code')
            .eq("code",code)
            .eq("private_code",private_code)

        if (error) throw error;
        console.log(data)
        return data[0]
    }

    async joinCircle(code:string, private_code:string){
        const circle = await this.getCircleByCode(code,private_code)

        if (!circle) throw Error(ErrorsUtils.CIRCLE_NOT_FOUND)

        await this.userService.updateCircleUserInDB(circle)
    }

    async createCircle(circle:Circle){
        circle.private_code = this.generateRandomPrivateCode()
        const { status ,error, data:circleInserted} = await supabase
            .from(this.TABLE_NAME)
            .insert(circle)
            .select()

        if (status == 201){
            console.log(circleInserted)
            return circleInserted[0]
        }else {
            throw error
        }
    }

    private generateRandomPrivateCode(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}