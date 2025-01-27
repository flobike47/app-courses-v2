<template>
  <ion-list>
    <ion-item>
      <ion-label>Articles supprimés</ion-label>
      <ion-toggle @update:model-value="onToggle" :model-value="showDeleted" slot="end"></ion-toggle>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonList, IonToggle } from '@ionic/vue';
defineProps({
  showDeleted: Boolean,
  onToggle: Function,
});
</script>

<style scoped>

</style>