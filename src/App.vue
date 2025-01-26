<template>
  <ion-app>
    <ion-router-outlet />
    <CreateListComponent />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import CreateListComponent from "@/components/CreateListComponent.vue";

</script>
