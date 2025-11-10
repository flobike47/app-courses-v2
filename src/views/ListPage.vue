<template>
  <ion-page>
    <AppHeader :isLoading="isLoading"
               :option="[
                          {
                            id: 'join-button',
                            icon: enterOutline,
                            onClick: () => join()
                          },
                          {
                            id: 'share-button',
                            icon: shareOutline,
                            onClick: () => share()
                          }
                        ]"
               :title="'Mes listes'"
    />
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div v-if="!isLoading">
        <div v-if="lists && lists.length" class="ion-padding">
          <ListCard
              v-for="list in lists"
              :key="list.id"
              :list="list"
          />
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
import {IonButton, IonCard, IonCardContent, IonContent, IonPage, IonRefresher, IonRefresherContent,} from '@ionic/vue';
import {onMounted, onUnmounted, ref} from 'vue';
import {ListService} from '@/services/ListService';
import {List} from '@/models/List';
import eventBus from "@/services/EventBus";
import ListCard from "@/components/List/ListCard.vue";
import {ListCommands} from "@/models/eventCommand/ListCommands";
import {ErrorsUtils} from "@/models/ErrorsUtils";
import {ErrorCommands} from "@/models/eventCommand/ErrorCommands";
import {enterOutline, shareOutline} from "ionicons/icons";
import {CircleService} from "@/services/CircleService";
import {AlertCommands} from "@/models/eventCommand/AlertCommands";
import router from "@/router";
import {AlertShareCircleInstruction} from "@/models/AlertShareCircleInstruction";
import AppHeader from "@/components/Header/AppHeader.vue";

const service = new ListService()
const circleService = new CircleService()

const lists = ref<List[] | null>(null);
const isLoading = ref(true);

onMounted(() => {
  fetchLists()
  eventBus.on(ListCommands.RELOAD, () => fetchLists());
});

onUnmounted(() => {
  eventBus.off(ListCommands.RELOAD, () => fetchLists());
});
const fetchLists = async () => {
  try {
    isLoading.value = true;
    lists.value = await service.getCircleLists();
  } catch (error) {
    eventBus.emit(ErrorCommands.ERROR, new Error(ErrorsUtils.RETRIEVE_LISTS))
  } finally {
    isLoading.value = false;
  }
};

const handleRefresh = async (event: CustomEvent) => {
  await fetchLists();
  (event.target as any).complete();
};

async function join(){
  router.push("/circle")
}

async function share(){
  const instruction = new AlertShareCircleInstruction("",null);
  instruction.circle = await circleService.getUserCircle()
  eventBus.emit(AlertCommands.CIRCLE_SHARE, instruction)
}

const createNewList = () => {
  eventBus.emit(ListCommands.OPEN_CREATION)
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

.align {
  padding-top: 5px;
}
</style>