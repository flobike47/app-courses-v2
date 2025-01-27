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

onMounted(() => {
  eventBus.on(AlertCommands.DELETION, showDeletionAlert);
});

onUnmounted(() => {
  eventBus.off(AlertCommands.DELETION, showDeletionAlert);
});
</script>