import {UserService} from "@/services/UserService";
import {supabase} from "@/config/supabaseClientConfig";
import {User} from "@/models/User";

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
}