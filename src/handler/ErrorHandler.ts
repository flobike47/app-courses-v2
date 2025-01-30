import {App} from '@capacitor/app';
import {Router} from 'vue-router';
import {toastController} from "@ionic/vue";
import eventBus from "@/services/EventBus";
import {ErrorCommands} from "@/models/eventCommand/ErrorCommands";

export class ErrorHandlerService {
    private router: Router;

    constructor(router: Router) {
        this.router = router;
        this.initializeGlobalHandlers();
    }

    private initializeGlobalHandlers(): void {
        eventBus.on(ErrorCommands.ERROR,this.handleError)
    }

    public handleError(error: any): void {
        console.error(`Erreur:`, error);

        toastController.create({
            message: error.message,
            duration: 3000,
            color: 'danger',
        }).then(toast => toast.present())

    }
}