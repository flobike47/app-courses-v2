import {toastController} from "@ionic/vue";
import eventBus from "@/services/EventBus";
import {ErrorCommands} from "@/models/eventCommand/ErrorCommands";


const initializeGlobalHandlers = (): void => {
    eventBus.on(ErrorCommands.ERROR, handleError)
}

const handleError = (error: any): void => {
    console.error(`Erreur:`, error);

    toastController.create({
        message: error.message,
        duration: 3000,
        color: 'danger',
    }).then(toast => toast.present())

}
export const ErrorHandlerService = {initializeGlobalHandlers};