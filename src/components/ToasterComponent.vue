<script setup lang="ts">
import {toastController} from "@ionic/vue";
import {onMounted, onUnmounted} from "vue";
import eventBus from "@/services/EventBus";

function showError(message: string) {
  toastController.create({
    message: message,
    duration: 3000,
    position: 'bottom',
    color: "danger",
  }).then(res => res.present());
}

onMounted(() => {
  eventBus.on('errorToaster', showError);
});

onUnmounted(() => {
  eventBus.off('errorToaster', showError);
});
</script>