import {Network} from '@capacitor/network';
import eventBus from "@/services/EventBus";
import {NetworkCommands} from "@/models/eventCommand/NetworkCommands";

export class NetworkService {

    static networkAvailable: boolean = true;

    constructor() {

        Network.addListener('networkStatusChange', status => {
            this.changeCurrentNetworkStatus(status.connected);
        });
        console.log('NetworkService initialized');
        this.changeCurrentNetworkStatus(Network.getStatus().then(status => {
            return status.connected;
        }));
    }

    changeCurrentNetworkStatus(newNetworkStatus) {
        console.log("Network status: ", newNetworkStatus);
        if (newNetworkStatus != NetworkService.networkAvailable) {
            NetworkService.networkAvailable = newNetworkStatus;
            eventBus.emit(NetworkCommands.NETWORK_CHANGE, newNetworkStatus);
        }

    }
}
