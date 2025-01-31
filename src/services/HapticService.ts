import {Haptics, ImpactStyle} from "@capacitor/haptics";

export class HapticService {

    static async selectingHaptic() {
        await Haptics.impact({style: ImpactStyle.Light});
    }
}