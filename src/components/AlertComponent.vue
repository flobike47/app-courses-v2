<script setup lang="ts">
import {alertController} from "@ionic/vue";
import {onMounted, onUnmounted} from "vue";
import eventBus from "@/services/EventBus";
import {Haptics, NotificationType} from "@capacitor/haptics";

async function showDeletionAlert(instructions: string[]) {
  await Haptics.impact({style: NotificationType.Warning});
  const alert = await alertController.create({
    header: 'Confirmation de suppression',
    message: instructions[0],
    buttons: alertButtons(instructions[1]),
  });
  await alert.present();
}

function alertButtons(busEvent: string) {

  return [
    {
      text: 'Annuler',
      role: 'cancel',
      handler: () => {
        eventBus.emit(busEvent, false)
      },
    },
    {
      text: 'Supprimer',
      role: 'destructive',
      color: 'red',
      handler: () => {
        eventBus.emit(busEvent, true)
      },
    },
  ];
}

onMounted(() => {
  eventBus.on('deletionConfirmation', showDeletionAlert);
});

onUnmounted(() => {
  eventBus.off('deletionConfirmation', showDeletionAlert);
});
</script>