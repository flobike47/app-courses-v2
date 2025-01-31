<script setup lang="ts">
import {alertController} from "@ionic/vue";
import {onMounted, onUnmounted} from "vue";
import eventBus from "@/services/EventBus";
import {Haptics, NotificationType} from "@capacitor/haptics";
import {AlertInstruction} from "@/models/AlertInstruction";
import {AlertCommands} from "@/models/eventCommand/AlertCommands";


async function showDeletionAlert(instructions: AlertInstruction) {
  await Haptics.impact({style: NotificationType.Warning});
  const alert = await alertController.create({
    header: 'Confirmation de suppression',
    message: instructions.message,
    buttons: alertButtons(instructions.eventCallback),
  });
  await alert.present();
}

function alertButtons(busEventCallBack: string) {

  return [
    {
      text: 'Annuler',
      role: 'cancel',
      handler: () => {
        eventBus.emit(busEventCallBack, false)
      },
    },
    {
      text: 'Supprimer',
      role: 'destructive',
      color: 'red',
      handler: () => {
        eventBus.emit(busEventCallBack, true)
      },
    },
  ];
}

async function showPrivateCodeCircleAlert(instructions: AlertInstruction) {
  await Haptics.impact({style: NotificationType.Warning});
  const alert = await alertController.create({
    header: 'Rejoindre un cercle',
    message: instructions.message,
    buttons: alertConfirmationButtons(instructions.eventCallback),
    inputs:[{
      name:"circlePrivateCode",
      placeholder: 'code d\'acces',
    }]
  });
  await alert.present();
}

function alertConfirmationButtons(busEventCallBack: string) {

  return [
    {
      text: 'Annuler',
      role: 'cancel',
      handler: () => {
        eventBus.emit(busEventCallBack, null)
      },
    },
    {
      text: 'Rejoindre',
      role: '',
      handler: (alertData) => {
        eventBus.emit(busEventCallBack, alertData)
      },
    },
  ];
}




onMounted(() => {
  eventBus.on(AlertCommands.DELETION, showDeletionAlert);
  eventBus.on(AlertCommands.CIRCLE_PRIVATE_CODE, showPrivateCodeCircleAlert)
});

onUnmounted(() => {
  eventBus.off(AlertCommands.DELETION);
  eventBus.off(AlertCommands.CIRCLE_PRIVATE_CODE);
});
</script>