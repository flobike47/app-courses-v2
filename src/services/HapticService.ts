import {Haptics, ImpactStyle} from "@capacitor/haptics";


const selectingHaptic = async () => {
    await Haptics.impact({style: ImpactStyle.Light});
}

export const HapticService = {selectingHaptic};