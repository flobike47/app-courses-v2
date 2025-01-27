<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ listName }}</ion-title>
        <ion-progress-bar type="indeterminate" v-if="isLoading"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="!isLoading">

        <ion-card>
          <ion-card-header>
            <ion-card-title>Articles:</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div v-if="articles && articles.length">
              <ArticleCard
                  v-for="article in articles"
                  :key="article.id"
                  :article="article"
              />
            </div>
            <div v-else class="ion-padding">
              <ion-card class="not-found">
                <ion-card-content class="ion-text-center">
                  <p>Aucun article trouvée</p>
                  <ion-button @click="openAddingModal" expand="block" >
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
  IonCardContent, IonButton
} from "@ionic/vue";
import {useRoute} from "vue-router";
import {onMounted, onUnmounted, ref} from "vue";
import {ArticleService} from "@/services/ArticleService";
import ArticleCard from "@/components/Article/ArticleCard.vue";
import eventBus from "@/services/EventBus";
import {ArticleCommands} from "@/models/eventCommand/ArticleCommands";

const route = useRoute();
const service = new ArticleService()
const isLoading = ref(false);

let listId, listName;
const articles = ref()

function openAddingModal(){
  eventBus.emit(ArticleCommands.OPEN_CREATION,listId)
}

onMounted(() => {
  listId = route.query.listId
  listName = route.query.listName?.toString().toUpperCase()

  fetchArticles()

  eventBus.on(ArticleCommands.RELOAD(listId), fetchArticles)
})

onUnmounted(() => {
  eventBus.off(ArticleCommands.RELOAD(listId))
})

const fetchArticles = async () => {
  try {
    isLoading.value = true;
    articles.value = await service.getListArticle(listId);
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

.not-found{
  background-color: var(--ion-background-color);
}
.ion-text-center{
  margin: 5px 10px 0 10px;
}
</style>