<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Cercle</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form @submit.prevent="join">
        <div class="register-container">
          <ion-item class="input-item">
            <ion-input v-model="formData.name" label="Nom" placeholder="Entrez le nom du cercle"></ion-input>
          </ion-item>

          <ion-button
              type="submit"
              class="register-button" expand="block"
              :disabled="isLoadingJoin || !isFormValid"
          >
            <span v-if="!isLoadingJoin">Rejoindre ce cercle</span>
            <ion-spinner v-if="isLoadingJoin" name="crescent"></ion-spinner>
          </ion-button>

          <ion-button
              type="submit"
              class="register-button" expand="block"
              :disabled="true"
          >
            <span v-if="!isLoadingCreate">Créer le cercle</span>
            <ion-spinner v-if="isLoadingCreate" name="crescent"></ion-spinner>
          </ion-button>

        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton, IonToolbar, IonHeader, IonTitle, IonSpinner,
} from '@ionic/vue';
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import {CircleService} from "@/services/CircleService";
import eventBus from "@/services/EventBus";
import {ErrorCommands} from "@/models/eventCommand/ErrorCommands";

const formData = ref({
  name: '',
});

const router = useRouter();
const circleService = new CircleService()
const isLoadingCreate = ref(false);
const isLoadingJoin = ref(false);

const isFormValid = computed(() => {
  return formData.value.name;
});

async function join() {
  isLoadingJoin.value = true

  try {
    await circleService.joinCircle(formData.value.name)
    await router.push('/')
  }catch (error){
    console.log(error)
    eventBus.emit(ErrorCommands.ERROR,error)
  }finally {
    isLoadingJoin.value = false

  }
}

</script>

<style scoped>
.register-container {
  padding-top: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.input-item {
  margin-bottom: 15px;
  border: 1px solid var(--ion-color-medium);
  border-radius: 10px;
  --padding-start: 10px;
}

.input-item ion-input {
  --padding-start: 10px;
  --padding-end: 10px;
}

.register-button {
  margin-top: 20px;
  margin-bottom: 10px;
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 10px;
  --padding-start: 20px;
  --padding-end: 20px;
}

.login-button {
  --color: var(--ion-color-medium);
}
</style>