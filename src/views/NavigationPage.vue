<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button @click="hapticsImpactLight" tab="Accueil" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button @click="openCreatingListModal">
          <ion-icon aria-hidden="true" :icon="addCircleOutline" />
          <ion-label>Ajouter une liste</ion-label>
        </ion-tab-button>

        <ion-tab-button @click="hapticsImpactLight" tab="Paramètres" href="/tabs/settings">
          <ion-icon aria-hidden="true" :icon="cogOutline" />
          <ion-label>Paramètres</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { homeOutline,addCircleOutline,cogOutline } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';


import {onMounted} from "vue";
import eventBus from "@/services/EventBus";


onMounted(() => {

  const savedDarkMode = localStorage.getItem('darkMode');

  if (savedDarkMode !== null) {
    const isDark = JSON.parse(savedDarkMode);
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  } else {
    document.documentElement.classList.toggle('ion-palette-dark', prefersDark.matches);
  }
});

function openCreatingListModal(){
  hapticsImpactLight()
  eventBus.emit("openCreateListModal")
}

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};
</script>

