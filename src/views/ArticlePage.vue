<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ listName }}</ion-title>
        <ion-progress-bar type="indeterminate" v-if="isLoading"></ion-progress-bar>
        <ion-buttons slot="end">
          <ion-button id="trigger-button" @click="presentPopover($event)">
            <ion-icon slot="icon-only" :icon="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="!isLoading">

        <ion-card>
          <ion-card-header>
            <ion-card-title>Articles:</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div v-if="filteredArticles && filteredArticles.length">
              <ArticleCard
                  v-for="article in filteredArticles"
                  :key="article.id"
                  :article="article"
              />
            </div>
            <div v-else class="ion-padding">
              <ion-card class="not-found">
                <ion-card-content class="ion-text-center">
                  <p>Aucun article trouvée</p>
                  <ion-button @click="openAddingModal" expand="block">
                    Ajouter un article
                  </ion-button>
                </ion-card-content>
              </ion-card>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonProgressBar,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonButton,
  popoverController
} from "@ionic/vue";
import {useRoute} from "vue-router";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {ArticleService} from "@/services/ArticleService";
import ArticleCard from "@/components/Article/ArticleCard.vue";
import eventBus from "@/services/EventBus";
import {ArticleCommands} from "@/models/eventCommand/ArticleCommands";
import {ellipsisVertical} from "ionicons/icons";
import PopoverComponent from "@/components/Article/PopoverComponent.vue";

const route = useRoute();
const service = new ArticleService()
const isLoading = ref(false);

let listId, listName;
const allArticles = ref([])
const filteredArticles = ref()

let showDeleted = ref(false)


function openAddingModal() {
  eventBus.emit(ArticleCommands.OPEN_CREATION, listId)
}

async function presentPopover(e: Event) {
  const popover = await popoverController.create({
    component: PopoverComponent,
    componentProps: {
      showDeleted: showDeleted.value,
      onToggle: (value) => applyFilterArticles(value),
    },
    event: e,
    cssClass: 'my-popover',
    translucent: true,
    keepContentsMounted: true,
  });
  await popover.present();
  await popover.onDidDismiss();
}

function applyFilterArticles(displayDeleted: boolean) {

  showDeleted.value = displayDeleted

  filteredArticles.value = displayDeleted
      ? allArticles.value
      : allArticles.value.filter(article => !article.deleted)
}

onMounted(() => {
  listId = route.query.listId
  listName = route.query.listName?.toString().toUpperCase()

  fetchArticles(showDeleted.value)

  eventBus.on(ArticleCommands.RELOAD(listId), fetchArticles)
})

onUnmounted(() => {
  eventBus.off(ArticleCommands.RELOAD(listId))
})

const fetchArticles = async () => {
  try {
    isLoading.value = true;
    allArticles.value = await service.getListArticle(listId);

    applyFilterArticles()

  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>


<style scoped>
ion-card-content {
  padding: 0 0 20px 0;
}

.not-found {
  background-color: var(--ion-background-color);
}

.ion-text-center {
  margin: 5px 10px 0 10px;
}

.my-popover {
  --width: 250px;
  --height: auto;
  /* Evitez: width: 0; height: 0; opacity: 0; display: none; */
}
</style>