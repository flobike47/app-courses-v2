<template>
  <ion-page>
    <ion-tabs @ionTabsDidChange="HapticService.selectingHaptic">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button @click.prevent="handleDynamicAction">
          <ion-icon aria-hidden="true" :icon="addCircleOutline" />
          <ion-label>{{ currentLabel }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon aria-hidden="true" :icon="cogOutline" />
          <ion-label>Paramètres</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { homeOutline, addCircleOutline, cogOutline } from 'ionicons/icons';
import {onMounted, ref, watch} from 'vue';
import eventBus from '@/services/EventBus';
import { ListCommands } from '@/models/eventCommand/ListCommands';
import { useRoute } from 'vue-router';
import {ArticleCommands} from "@/models/eventCommand/ArticleCommands";
import {AppStorageService} from "@/services/AppStorageService";
import {HapticService} from "@/services/HapticService";


const route = useRoute();
const currentLabel = ref('Ajouter une liste');
const storageService = AppStorageService.getInstance();


onMounted(async () => {

  const savedDarkMode = await storageService.getDarkMode()

  if (savedDarkMode !== null) {
    const isDark = JSON.parse(savedDarkMode);
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  } else {
    document.documentElement.classList.toggle('ion-palette-dark', false);
  }
});

function openCreatingListModal() {
  HapticService.selectingHaptic()
  eventBus.emit(ListCommands.OPEN_CREATION);
}

function openCreatingArticleModal() {
  HapticService.selectingHaptic()
  const listId = route.query.listId
  eventBus.emit(ArticleCommands.OPEN_CREATION,listId);
}



watch(() => route.path, () => {
  updateButtonState();
});

function updateButtonState() {
  switch (route.path) {
    case '/tabs/home':
      currentLabel.value = 'Ajouter une liste';
      break;
    case '/articles':
      currentLabel.value = 'Ajouter un article';
      break;
    default:
      currentLabel.value = 'Ajouter une liste';
      break;
  }
}

function handleDynamicAction() {
  switch (route.path) {
    case '/tabs/home':
      openCreatingListModal();
      break;
    case '/articles':
      openCreatingArticleModal();
      break;
    default:
      openCreatingListModal();
      break;
  }
}
</script>