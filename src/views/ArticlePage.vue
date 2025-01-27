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
                  :model-value="article.selected"
                  v-model:selected="article.selected"
                  @select="handleArticleSelection"
              />
            </div>
            <div v-else class="ion-padding">
              <ion-card class="not-found">
                <ion-card-content class="ion-text-center">
                  <p>Aucun article trouvé</p>
                  <ion-button @click="openAddingModal" expand="block">
                    Ajouter un article
                  </ion-button>
                </ion-card-content>
              </ion-card>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="deleteSelectedArticles" :disabled="!selectedArticles.length">
          <ion-icon :icon="trash"></ion-icon>
        </ion-fab-button>
      </ion-fab>

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
  popoverController,
  IonFab,
  IonFabButton
} from "@ionic/vue";
import { useRoute } from "vue-router";
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { ArticleService } from "@/services/ArticleService";
import ArticleCard from "@/components/Article/ArticleCard.vue";
import eventBus from "@/services/EventBus";
import { ArticleCommands } from "@/models/eventCommand/ArticleCommands";
import { ellipsisVertical, trash } from "ionicons/icons";
import PopoverComponent from "@/components/Article/PopoverComponent.vue";
import {Article} from "@/models/Article";

const route = useRoute();
const service = new ArticleService();
const isLoading = ref(false);

const listId = route.query.listId;
const listName = route.query.listName?.toString().toUpperCase();

const UNIQUE_STORAGE_KEY = 'selectedArticles-'+listId

const allArticles = ref<Article[]>([]);
const filteredArticles = ref<Article[]>([]);
const selectedArticles = ref<Article[]>([]);

const showDeleted = ref(false);

function openAddingModal() {
  eventBus.emit(ArticleCommands.OPEN_CREATION, listId);
}

async function presentPopover(e: Event) {
  const popover = await popoverController.create({
    component: PopoverComponent,
    componentProps: {
      showDeleted: showDeleted.value,
      onToggle: (value: boolean) => applyFilterArticles(value),
    },
    event: e,
    cssClass: 'my-popover',
    translucent: true,
    keepContentsMounted: true,
  });
  await popover.present();
  await popover.onDidDismiss();
}

function applyFilterArticles(displayDeleted: boolean = showDeleted.value) {
  showDeleted.value = displayDeleted;
  filteredArticles.value = displayDeleted
      ? allArticles.value
      : allArticles.value.filter(article => !article.deleted);
}

onMounted(() => {
  fetchArticles();
  eventBus.on(ArticleCommands.RELOAD(listId), fetchArticles);
});

onUnmounted(() => {
  eventBus.off(ArticleCommands.RELOAD(listId));
});

const fetchArticles = async () => {
  try {
    isLoading.value = true;
    allArticles.value = await service.getListArticle(listId);

    const selectedIds = JSON.parse(localStorage.getItem(UNIQUE_STORAGE_KEY) || '[]');

    allArticles.value = allArticles.value.map(article => ({
      ...article,
      selected: selectedIds.includes(article.id),
    }));
    selectedArticles.value = allArticles.value.filter(article => article.selected);

    applyFilterArticles();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleArticleSelection = (article: Article) => {
  article.selected = !article.selected;
  if (article.selected) {
    selectedArticles.value.push(article);
  } else {
    selectedArticles.value = selectedArticles.value.filter(a => a.id !== article.id);
  }

  const selectedIds = selectedArticles.value.map(a => a.id);
  localStorage.setItem(UNIQUE_STORAGE_KEY, JSON.stringify(selectedIds));
};

const deleteSelectedArticles = async () => {
  if (!selectedArticles.value.length) return;

  try {
    isLoading.value = true;
    const idsToDelete = selectedArticles.value.map(article => article.id);
    await service.deleteArticles(idsToDelete);

    await fetchArticles();

    selectedArticles.value = [];
    localStorage.removeItem(UNIQUE_STORAGE_KEY);
  } catch (error) {
    console.error("Erreur lors de la suppression des articles:", error);
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
}
</style>