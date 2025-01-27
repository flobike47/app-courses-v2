<template>
  <ion-modal
      ref="modal"
      :breakpoints="[0, 0.7, 1]"
      :initial-breakpoint="0.7"
      :handle="false"
  >
    <ion-content>
      <form @submit.prevent="createArticle">
        <ion-list>
          <ion-item>
            <ion-input
                label="Nom de l'article:"
                v-model="formData.name"
                placeholder="Entrez le nom de la liste"
                required
            />
          </ion-item>

          <ion-item>
            <div>
              <h6>Selectionne l'unité :</h6>
              <div class="color-picker">
                <div class="color-picker-row">
                  <span
                      v-for="unity in unities"
                      :key="unity.id"
                      class="color-circle"
                      :class="{ selected: formData.unity === unity.id }"
                      @click="selectUnity(unity.id)"
                  >
                    {{ unity.name }}
                  </span>
                </div>
              </div>
              <input type="hidden" :value="formData.unity" />
            </div>
          </ion-item>

          <ion-item>
            <ion-input
                type="number"
                label="Valeur:"
                v-model="formData.unity_value"
                placeholder="Entrez la valeur"
            />
          </ion-item>

          <ion-item>
          <div>
            <h6>Selectionne le label :</h6>
            <div class="color-picker">
              <div class="color-picker-row">
                  <span
                      v-for="label in labels"
                      :key="label.id"
                      class="color-circle"
                      :class="{ selected: formData.label === label.id }"
                      @click="selectLabel(label.id)"
                  >
                    {{ label.name }}
                  </span>
              </div>
            </div>
            <input type="hidden" :value="formData.label" />
          </div>
        </ion-item>

          <ion-item>
            <ion-button
                type="submit"
                :size="'default'"
                class="full-width-button create-button"
                :disabled="isLoading || !isFormValid"
            >
              <span v-if="!isLoading">Créer</span>
              <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
            </ion-button>
          </ion-item>
        </ion-list>
      </form>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner
} from '@ionic/vue';
import { onMounted, onUnmounted, ref, computed } from 'vue';
import eventBus from "@/services/EventBus";
import {ArticleCommands} from "@/models/eventCommand/ArticleCommands";
import {ArticleService} from "@/services/ArticleService";
import {LabelService} from "@/services/LabelService";
import {UnityService} from "@/services/UnityService";

const service = new ArticleService();
const labelService = new LabelService();
const unityService = new UnityService();

let listId = null

const modal = ref();
const isLoading = ref(false);

const unities = ref([])
const labels = ref([])

const formData = ref({
  name: '',
  unity_value: null,
  label: null,
  unity:null,
});

const isFormValid = computed(() => {
  return formData.value.name && formData.value.unity_value && formData.value.label && formData.value.unity;
});


function selectUnity(unity: number) {
  formData.value.unity = unity;
}

const selectLabel = (labelId) => {
  formData.value.label = formData.value.label === labelId ? null : labelId
}

async function fetchUnities(){
  unities.value = await unityService.getUnities()
}

async function fetchLabels() {
  labels.value = await labelService.getLabels()
}

const createArticle = async () => {
  isLoading.value = true
  try {
    await service.createArticle(
        formData.value.name,
        formData.value.unity,
        formData.value.unity_value,
        listId,
        formData.value.label
    )
    closeModal()
    resetModal()
    eventBus.emit(ArticleCommands.RELOAD(listId))
  } catch (error) {
    console.error('Erreur lors de la création:', error)
  } finally {
    isLoading.value = false
  }
}

function resetModal(){
  formData.value.unity_value = null
  formData.value.unity = null
  formData.value.label = null
  formData.value.name = null


}
function openModal(id) {
  listId = id
  modal.value.$el.present();
}

function closeModal() {
  modal.value.$el.dismiss();
}

onMounted(() => {
  fetchUnities()
  fetchLabels()
  eventBus.on(ArticleCommands.OPEN_CREATION,openModal);
});

onUnmounted(() => {
  eventBus.off(ArticleCommands.OPEN_CREATION);
});


</script>

<style scoped>

ion-content {
  height: 10vh;
}

.color-picker-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 15px 0;
}

.color-circle {
  min-width: 38px;
  height: 38px;
  padding: 0 12px;
  border-radius: 19px; /* la moitié de la hauteur pour un effet pill */
  cursor: pointer;
  border: 3px solid transparent;
  transition: transform 0.2s, border-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background-color: var(--ion-color-light);
  white-space: nowrap;
}

.color-circle.selected {
  border-color: #000;
  transform: scale(1.1);
  background-color: var(--ion-color-primary);
  color: white;
}

.full-width-button {
  margin: 0;
  width: 100%;
}

.create-button {
  margin: 25px 0 5px 0;
}

ion-list {
  height: 100vh;
}
</style>