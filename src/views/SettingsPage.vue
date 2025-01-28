<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Paramètres</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list :inset="true">
        <ion-item>
          <ion-toggle
              :checked="paletteToggle"
              @ionChange="toggleChange($event)"
              justify="space-between"
          >
            Mode sombre
          </ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonToggle,
  ToggleCustomEvent
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import {AppStorageService} from "@/services/AppStorageService";

const paletteToggle = ref(false);
const storageService = AppStorageService.getInstance();


const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const toggleDarkPalette = (shouldAdd: boolean) => {
  document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  storageService.setDarkMode(shouldAdd)
};

const initializeDarkPalette = (isDark: boolean) => {
  paletteToggle.value = isDark;
  toggleDarkPalette(isDark);
};

onMounted(async () => {
  const savedDarkMode =  await storageService.getDarkMode()

  if (savedDarkMode !== null) {
    const isDark = JSON.parse(savedDarkMode);
    initializeDarkPalette(isDark);
  } else {
    initializeDarkPalette(prefersDark.matches);
  }

  prefersDark.addEventListener('change', (mediaQuery) => {
    if (savedDarkMode === null) {
      initializeDarkPalette(mediaQuery.matches);
    }
  });
});

const toggleChange = (event: ToggleCustomEvent) => {
  toggleDarkPalette(event.detail.checked);
};
</script>