<template>
  <ion-page>
    <AppHeader :title="'Paramètres'"/>
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
        <ion-item>
          <ion-button class="full-width-button" size="default" @click="signOut">Déconnexion</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonContent, IonItem, IonList, IonPage, IonToggle, ToggleCustomEvent} from '@ionic/vue';
import {onMounted, ref} from 'vue';
import {AppStorageService} from "@/services/AppStorageService";
import router from "@/router";
import {supabase} from "@/config/supabaseClientConfig";
import AppHeader from "@/components/Header/AppHeader.vue";

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

async function signOut() {
  const {error} = await supabase.auth.signOut();
  if (error) {
    console.error('Erreur lors de la déconnexion:', error);
    await supabase.auth.setSession(null);
  }
  await router.push('/login');

}

onMounted(async () => {
  const savedDarkMode = await storageService.getDarkMode()

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

<style scoped>
.full-width-button {
  margin: 15px;
  width: 100%;
}

</style>