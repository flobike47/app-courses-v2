import {App} from '@capacitor/app';
import {Router} from 'vue-router';
import {toastController} from "@ionic/vue";
import {ErrorsUtils} from "@/models/ErrorsUtils";

export class ErrorHandlerService {
    private router: Router;

    constructor(router: Router) {
        this.router = router;
        this.initializeGlobalHandlers();
    }

    private initializeGlobalHandlers(): void {
        App.config.errorHandler = (err, vm, info) => {
            this.handleError(err, 'Vue', info);
        };

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Promise');
        });
    }

    public handleError(error: any, type: string, info?: any): void {
        console.error(`Erreur globale (${type}):`, error);


        switch (true) {
            case error.toString().includes("Invalid login credentials"):
                this.showErrorToast(ErrorsUtils.INVALID_CREDENTIALS)
                break
            default:
                this.showErrorToast(error.message)
        }


    }

    private async showErrorToast(message: string): Promise<void> {
        const toast = await toastController.create({
            message: message,
            duration: 3000,
            color: 'danger',
        });
        await toast.present();
    }
}