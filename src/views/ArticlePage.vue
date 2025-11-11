<template>
  <ion-page>
    <AppHeader :isLoading="isLoading"
               :option="[
                          {
                            id: 'popover-button',
                            icon: ellipsisVertical,
                            onClick: (e: Event) => presentPopover(e)
                          }
                        ]"
               :title="listName"
    />
    <ion-content>
      <div v-if="!isLoading">
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
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
  popoverController
} from "@ionic/vue";
import {useRoute} from "vue-router";
import {onMounted, onUnmounted, ref} from 'vue';
import {ArticleService} from "@/services/ArticleService";
import ArticleCard from "@/components/Article/ArticleCard.vue";
import eventBus from "@/services/EventBus";
import {ArticleCommands} from "@/models/eventCommand/ArticleCommands";
import {ellipsisVertical, trash} from "ionicons/icons";
import PopoverComponent from "@/components/Article/PopoverComponent.vue";
import {Article} from "@/models/Article";
import {AppStorageService} from "@/services/AppStorageService";
import {ErrorsUtils} from "@/models/ErrorsUtils";
import {ErrorCommands} from "@/models/eventCommand/ErrorCommands";
import AppHeader from "@/components/Header/AppHeader.vue";
import {AlertCommands} from "@/models/eventCommand/AlertCommands";

const route = useRoute();
const service = new ArticleService();
const storageService = AppStorageService.getInstance()

const isLoading = ref(false);

const listId = route.query.listId;
const listName = route.query.listName?.toString().toUpperCase();

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

    const selectedIds = await storageService.getSelectedArticles(listId) ?? []

    allArticles.value = allArticles.value.map(article => ({
      ...article,
      selected: selectedIds.includes(article.id),
    }));
    selectedArticles.value = allArticles.value.filter(article => article.selected);

    applyFilterArticles();
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    eventBus.emit(ErrorCommands.ERROR, new Error(ErrorsUtils.RETRIEVE_ARTICLES))
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
  storageService.setSelectedArticles(listId, selectedIds)
};

async function deleteArticles(toDelete: boolean) {
  if (!toDelete) return;
  try {
    isLoading.value = true;
    const idsToDelete = selectedArticles.value.map(article => article.id);
    await service.deleteArticles(idsToDelete);

    await fetchArticles();

    selectedArticles.value = [];
    await storageService.removeSelectedArticles(listId)
  } catch (error) {
    console.error("Erreur lors de la suppression des articles:", error);
  } finally {
    isLoading.value = false;
  }
}

const deleteSelectedArticles = async () => {
  if (!selectedArticles.value.length) return;

  const instruction = {
    message: `Êtes-vous sûr de vouloir supprimer les ${selectedArticles.value.length} articles sélectionnés ?`,
    eventCallback: ArticleCommands.DELETE_ARTICLES,
  };

  eventBus.emit(AlertCommands.DELETION, instruction);

  eventBus.on(ArticleCommands.DELETE_ARTICLES, deleteArticles)

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