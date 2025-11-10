<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import eventBus from "@/services/EventBus";
import {NetworkCommands} from "@/models/eventCommand/NetworkCommands";
import {NetworkService} from "@/services/NetworkService";
import {cloudOfflineOutline} from "ionicons/icons";

const isOnline = ref(NetworkService.networkAvailable);

onMounted(() => {
  eventBus.on(NetworkCommands.NETWORK_CHANGE, () => {
    isOnline.value = NetworkService.networkAvailable
  });
});

onUnmounted(() => {
  eventBus.off(NetworkCommands.NETWORK_CHANGE);
});


</script>

<template>
  <ion-button v-if="!isOnline">
    <ion-icon slot="icon-only" :icon="cloudOfflineOutline" color="danger" size="medium"></ion-icon>
  </ion-button>
</template>

<style scoped>

</style>