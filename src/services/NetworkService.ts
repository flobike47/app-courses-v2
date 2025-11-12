import {Network} from '@capacitor/network';
import eventBus from "@/services/EventBus";
import {NetworkCommands} from "@/models/eventCommand/NetworkCommands";
import {toastController} from "@ionic/vue";

const networkAvailable: boolean = false;

const openNetworkListener = () => {

    Network.addListener('networkStatusChange', status => {
        changeCurrentNetworkStatus(status.connected);
    });
    Network.getStatus()
        .then(status => {
            changeCurrentNetworkStatus(status.connected, true);
        })
        .catch(() => changeCurrentNetworkStatus(false, true));
}

const changeCurrentNetworkStatus = (newNetworkStatus: boolean, init = false) => {
    if (NetworkService.networkAvailable != newNetworkStatus) {
        NetworkService.networkAvailable = newNetworkStatus;
        eventBus.emit(NetworkCommands.NETWORK_CHANGE, newNetworkStatus);
        if (newNetworkStatus) eventBus.emit(NetworkCommands.ONLINE);
        if (!init || (init && !newNetworkStatus)) {
            notifyUserNetworkStatus();
        }
    }
}

const notifyUserNetworkStatus = () => {
    if (NetworkService.networkAvailable) {
        toastController.create({
            message: "Vous êtes en ligne.",
            duration: 3000,
            color: 'success',
        }).then(toast => toast.present())
    } else {
        toastController.create({
            message: "Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.",
            duration: 3000,
            color: 'warning',
        }).then(toast => toast.present())
    }
}

export const NetworkService = {
    networkAvailable,
    openNetworkListener,
};
