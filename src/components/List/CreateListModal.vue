<template>
  <ion-modal
      ref="modal"
      :breakpoints="[0, 0.46, 1]"
      :initial-breakpoint="0.46"
      :handle="false"
  >
    <ion-content>
      <form @submit.prevent="createList">
        <ion-list>
          <ion-item>
            <ion-input
                label="Nom de la liste:"
                autocorrect=“on”
                v-model="formData.listName"
                placeholder="Entrez le nom de la liste"
                required
            />
          </ion-item>

          <ion-item>
            <div>
              <h4>Choisissez une couleur :</h4>
              <ion-button @click="generateRandomPastelColors" class="regen-button">
                Régénérer les couleurs
              </ion-button>
              <div class="color-picker">
                <div class="color-picker-row">
                 <span
                     v-for="(color, index) in pastelColors"
                     :key="index"
                     :style="{ backgroundColor: color }"
                     class="color-circle"
                     :class="{ selected: formData.selectedColor === color }"
                     @click="selectColor(color)"
                 ></span>
                </div>
              </div>
              <input type="hidden" :value="formData.selectedColor" required />
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
import {IonButton, IonContent, IonInput, IonItem, IonList, IonModal, IonSpinner} from '@ionic/vue';
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {ListService} from '@/services/ListService';
import {List} from "@/models/List";
import eventBus from "@/services/EventBus";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {ListCommands} from "@/models/eventCommand/ListCommands";
import {ErrorsUtils} from "@/models/ErrorsUtils";
import {ErrorCommands} from "@/models/eventCommand/ErrorCommands";

const service = ListService
const modal = ref();
const isLoading = ref(false);
const pastelColors = ref<string[]>([]);

const formData = ref({
  listName: '',
  selectedColor: ''
});

const isFormValid = computed(() => {
  return formData.value.listName && formData.value.selectedColor;
});

function generateRandomPastelColors() {
  const newPastelColors = [];
  for (let i = 0; i < 10; i++) {
    const r = Math.floor(Math.random() * 128 + 128);
    const g = Math.floor(Math.random() * 128 + 128);
    const b = Math.floor(Math.random() * 128 + 128);
    newPastelColors.push(`rgb(${r}, ${g}, ${b})`);
  }
  pastelColors.value = newPastelColors;
}

function selectColor(color: string) {
  formData.value.selectedColor = color;
}

async function createList() {
  if (!isFormValid.value) {
    await Haptics.impact({ style: ImpactStyle.Light });
    eventBus.emit(ErrorCommands.ERROR, new Error('veuillez remplir tous les champs'));
    return;
  }

  isLoading.value = true;
  let list = new List(formData.value.listName, formData.value.selectedColor);

  try {
    await service.createList(list);
    closeModal();
    resetModal();
    eventBus.emit(ListCommands.RELOAD);
  }catch (error) {
    eventBus.emit(ErrorCommands.ERROR, new Error(ErrorsUtils.CREATION))
  }finally {
    isLoading.value = false;
  }
}

function resetModal() {
  formData.value = {
    listName: '',
    selectedColor: ''
  };
  isLoading.value = false;
  generateRandomPastelColors();
}

onMounted(() => {
  generateRandomPastelColors();
  eventBus.on(ListCommands.OPEN_CREATION, () => openModal());
});

onUnmounted(() => {
  eventBus.off(ListCommands.OPEN_CREATION);
});

function openModal() {
  modal.value.$el.present();
}

function closeModal() {
  modal.value.$el.dismiss();
}
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
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: transform 0.2s, border-color 0.2s;
}

.color-circle.selected {
  border-color: #000;
  transform: scale(1.2);
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