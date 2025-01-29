<template>
  <ion-app>
    <ion-router-outlet />
    <CreateListComponent />
    <CreateArticleModal />
    <AlertComponent />
  </ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import CreateListComponent from "@/components/List/CreateListModal.vue";
import AlertComponent from "@/components/AlertComponent.vue";
import CreateArticleModal from "@/components/Article/CreateArticleModal.vue";

</script>
