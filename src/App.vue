<template>
  <ion-app>
    <ion-router-outlet />
    <CreateListComponent />
    <toaster-component />
  </ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import CreateListComponent from "@/components/CreateListComponent.vue";
import ToasterComponent from "@/components/ToasterComponent.vue";

</script>
