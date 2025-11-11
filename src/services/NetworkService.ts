import {Network} from '@capacitor/network';
import eventBus from "@/services/EventBus";
import {NetworkCommands} from "@/models/eventCommand/NetworkCommands";
import {toastController} from "@ionic/vue";

export class NetworkService {

    static networkAvailable: boolean = false;

    constructor() {

        Network.addListener('networkStatusChange', status => {
            this.changeCurrentNetworkStatus(status.connected);
        });
        this.changeCurrentNetworkStatus(Network.getStatus().then(status => {
            return status.connected;
        }), true);
    }

    changeCurrentNetworkStatus(newNetworkStatus, init = false) {
        if (NetworkService.networkAvailable != newNetworkStatus) {
            NetworkService.networkAvailable = newNetworkStatus;
            eventBus.emit(NetworkCommands.NETWORK_CHANGE, newNetworkStatus);
            if (!init || (init && !newNetworkStatus)) {
                this.notifyUserNetworkStatus();
            }
        }
    }

    notifyUserNetworkStatus() {
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
}
