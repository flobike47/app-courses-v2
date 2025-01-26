<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="Accueil" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Ajouter">
          <ion-icon aria-hidden="true" :icon="addCircleOutline" />
          <ion-label>Lieux</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Paramètres" href="/tabs/settings">
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

import {onMounted} from "vue";


onMounted(() => {
  // Check if there's a saved preference
  const savedDarkMode = localStorage.getItem('darkMode');

  if (savedDarkMode !== null) {
    // Use saved preference if it exists
    const isDark = JSON.parse(savedDarkMode);
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  } else {
    // Otherwise, use system preference
    document.documentElement.classList.toggle('ion-palette-dark', prefersDark.matches);
  }
});


</script>
