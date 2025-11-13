<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import eventBus from "@/services/EventBus";
import {NetworkCommands} from "@/models/eventCommand/NetworkCommands";
import {NetworkService} from "@/services/NetworkService";
import {cloudOfflineOutline} from "ionicons/icons";

const isOnline = ref(NetworkService.networkAvailable);

onMounted(() => {
  isOnline.value = NetworkService.networkAvailable;
  eventBus.on(NetworkCommands.NETWORK_CHANGE, (newStatus) => {
    isOnline.value = newStatus
  });
});


</script>

<template>
  <ion-button v-if="!isOnline">
    <ion-icon slot="icon-only" :icon="cloudOfflineOutline" color="danger" size="medium"></ion-icon>
  </ion-button>
</template>

<style scoped>

</style>