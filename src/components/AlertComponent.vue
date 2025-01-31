<script setup lang="ts">
import {alertController, toastController} from "@ionic/vue";
import {onMounted, onUnmounted} from "vue";
import eventBus from "@/services/EventBus";
import {Haptics, NotificationType} from "@capacitor/haptics";
import {AlertInstruction} from "@/models/AlertInstruction";
import {AlertCommands} from "@/models/eventCommand/AlertCommands";
import {AlertShareCircleInstruction} from "@/models/AlertShareCircleInstruction";
import {ErrorCommands} from "@/models/eventCommand/ErrorCommands";


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

async function showShareCircleAlert(instructions: AlertShareCircleInstruction) {
  await Haptics.impact({style: NotificationType.Warning});
  const alert = await alertController.create({
    header: 'Partager un cercle',
    message: instructions.message,
    inputs:[{
      label: "Code du cercle",
      type: "text",
      disabled: true,
      value: instructions.circle.code
    },
      {
        label: "Code privé du cercle",
        type: "text",
        disabled: true,
        value: instructions.circle.private_code
      }],
    buttons: [
      {
        text: "Copier le code",
        handler: async () => {
          const circleCopyText = `Code du cercle: ${instructions.circle.code}\nCode privé: ${instructions.circle.private_code}`;
          try {
            await navigator.clipboard.writeText(circleCopyText);
            toastController.create({
              message: "Informations du cercle copié !",
              duration: 3000,
              color: 'success',
            }).then(toast => toast.present())
            await Haptics.notification({ style: NotificationType.Success });
          } catch (error) {
            eventBus.emit(ErrorCommands.ERROR, error)
          }
        }
      },
      {
        text: "Ok"
      }
    ]
  });
  await alert.present();
}




onMounted(() => {
  eventBus.on(AlertCommands.DELETION, showDeletionAlert);
  eventBus.on(AlertCommands.CIRCLE_SHARE, showShareCircleAlert);
  eventBus.on(AlertCommands.CIRCLE_PRIVATE_CODE, showPrivateCodeCircleAlert)
});

onUnmounted(() => {
  eventBus.off(AlertCommands.DELETION);
  eventBus.off(AlertCommands.CIRCLE_SHARE);
  eventBus.off(AlertCommands.CIRCLE_PRIVATE_CODE);
});
</script>