<script setup lang="ts">
import {toastController} from "@ionic/vue";
import {onMounted, onUnmounted} from "vue";
import eventBus from "@/services/EventBus";
import {Haptics, NotificationType} from "@capacitor/haptics";
import {ToasterCommands} from "@/models/eventCommand/ToasterCommands";

function showError(message: string) {
  Haptics.impact({ style: NotificationType.Error });
  toastController.create({
    message: message,
    duration: 3000,
    position: 'bottom',
    color: "danger",
  }).then(res => res.present());
}

onMounted(() => {
  eventBus.on(ToasterCommands.ERROR, showError);
});

onUnmounted(() => {
  eventBus.off(ToasterCommands.ERROR);
});
</script>