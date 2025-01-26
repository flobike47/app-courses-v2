<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Mes listes</ion-title>
        <ion-progress-bar type="indeterminate" v-if="isLoading"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div v-if="!isLoading">
        <div v-if="lists && lists.length" class="ion-padding">
          <ion-card
              v-for="list in lists"
              :key="list.id"
              class="ion-margin-bottom grid-item"
          >
            <div class="list-header">
              <div
                  class="color-pastille"
                  :style="{ 'background-color': list.color }"
              ></div>
              <ion-card-content class="ion-text-center">
                <h2 class="ion-text-wrap">{{ list.name }}</h2>
              </ion-card-content>
            </div>
          </ion-card>
        </div>
        <div v-else class="ion-padding">
          <ion-card>
            <ion-card-content class="ion-text-center">
              <p>Aucune liste trouvée</p>
              <ion-button expand="block" @click="createNewList">
                Créer une nouvelle liste
              </ion-button>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
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
  IonCard,
  IonCardContent,
  IonButton,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent
} from '@ionic/vue';
import {onMounted, onUnmounted, ref} from 'vue';
import { ListService } from '@/services/ListService';
import { List } from '@/models/List';
import eventBus from "@/services/EventBus";

const service = new ListService()

const lists = ref<List[] | null>(null);
const isLoading = ref(true);

onMounted(() => {
  fetchLists()
  eventBus.on('listCreated', () => fetchLists());
});

onUnmounted(() => {
  eventBus.off('listCreated', () => fetchLists());
});
const fetchLists = async () => {
  try {
    isLoading.value = true;
    lists.value = await service.getLists();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleRefresh = async (event: CustomEvent) => {
  await fetchLists();
  (event.target as any).complete();
};

const createNewList = () => {
  eventBus.emit("openCreateListModal")
};
</script>

<style scoped>
.list-header {
  display: flex;
  align-items: center;
}

.color-pastille {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: 10px;
}
</style>