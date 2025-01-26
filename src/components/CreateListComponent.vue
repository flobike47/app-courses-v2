<template>
  <ion-modal
      ref="modal"
      :breakpoints="[0, 0.46, 1]"
      :initial-breakpoint="0.46"
      :handle="false"

  >
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-input
              label="Nom de la liste:"
              v-model="listName"
              placeholder="Entrez le nom de la liste"
          />
        </ion-item>

        <ion-item>
          <div>
            <h4>Choisissez une couleur :</h4>
            <ion-button @click="generateRandomPastelColors" class="regen-button">Régénérer les couleurs</ion-button>
            <div class="color-picker">
              <div class="color-picker-row">
                <span
                    v-for="(color, index) in pastelColors"
                    :key="index"
                    :style="{ backgroundColor: color }"
                    class="color-circle"
                    :class="{ selected: selectedColor === color }"
                    @click="selectColor(color)"
                ></span>
              </div>
            </div>
          </div>
        </ion-item>

        <ion-item>
          <ion-button @click="createList" :size="'default'" class="full-width-button create-button" :loading="isLoading">
            <span v-if="!isLoading">Créer</span>
            <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
          </ion-button>
        </ion-item>
      </ion-list>
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
} from '@ionic/vue';
import {onMounted, onUnmounted, ref} from 'vue';
import { ListService } from '@/services/ListService';
import {List} from "@/models/List";
import eventBus from "@/services/EventBus";

const service = new ListService()

const modal = ref();
const isLoading = ref(false);

const listName = ref('');
const selectedColor = ref('');
const pastelColors = ref<string[]>([]);

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
  selectedColor.value = color;
}

async function createList() {
  if (!listName.value || !selectedColor.value){
    eventBus.emit('errorToaster','veuillez remplir tous les champs')
    return
  }else {
    isLoading.value = true;
  }
  let list = new List(listName.value,selectedColor.value)

  const adding = await service.createList(list)

  if (adding){
    closeModal()
    resetModal()
    eventBus.emit('listCreated');
    
    isLoading.value = false;
  }
}

function resetModal() {
  listName.value = ""
  selectedColor.value = ""
  isLoading.value = false
  generateRandomPastelColors()
}

onMounted(() => {
  generateRandomPastelColors();
  eventBus.on("openCreateListModal", () => openModal())
});

onUnmounted(() => {
  eventBus.off("openCreateListModal", () => openModal())
})

function openModal(){
  modal.value.$el.present()
}

function closeModal(){
  modal.value.$el.dismiss()
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