<template>
  <ion-app>
    <ion-router-outlet />
    <CreateListComponent />
    <toaster-component />
    <AlertComponent />
  </ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import CreateListComponent from "@/components/List/CreateListModal.vue";
import ToasterComponent from "@/components/ToasterComponent.vue";
import AlertComponent from "@/components/AlertComponent.vue";

</script>
