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

defineProps<{
  title: string,
  canBack?: boolean,
  option?: Array<ionButton>,
  isLoading?: boolean
  returnPath?: string

}>();


</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href="{{returnPath ?? '/tabs/home'}}"></ion-back-button>
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