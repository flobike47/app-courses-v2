<script lang="ts" setup>

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonProgressBar,
  IonTitle,
  IonToolbar
} from "@ionic/vue";
import NetworkToolBarStatus from "@/components/Header/NetworkToolBarStatus.vue";

withDefaults(defineProps<{
  title: string;
  canBack?: boolean;
  option?: Array<IonButton>;
  isLoading?: boolean;
  returnPath?: string;
}>(), {
  canBack: true,
  returnPath: '/tabs/home'
});

</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons v-if="canBack" slot="start">
        <ion-back-button :default-href="returnPath"></ion-back-button>
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
      <ion-progress-bar v-if="isLoading" type="indeterminate"></ion-progress-bar>
      <ion-buttons slot="end">
        <NetworkToolBarStatus/>
        <ion-button v-for="btn in option" :key="btn.id" @click="btn.onClick">
          <ion-icon slot="icon-only" :icon="btn.icon"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<style scoped>

</style>