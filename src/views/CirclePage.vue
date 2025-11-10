<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" v-if="canBack">
          <ion-back-button default-href="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Cercle</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form >
        <div class="register-container">
          <ion-item class="input-item">
            <ion-input autocorrect=“on” v-model="formData.name" label="Nom" placeholder="Entrez le nom du cercle"></ion-input>
          </ion-item>

          <ion-button
              type="submit"
              class="register-button" expand="block"
              :disabled="isLoadingJoin || !isFormValid"
              @click="join"
          >
            <span v-if="!isLoadingJoin">Rejoindre ce cercle</span>
            <ion-spinner v-if="isLoadingJoin" name="crescent"></ion-spinner>
          </ion-button>

          <ion-button
              type="submit"
              class="register-button" expand="block"
              :disabled="isLoadingCreate || !isFormValid"
              @click="createAndJoin"
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
  IonButton, IonToolbar, IonHeader, IonTitle, IonSpinner, IonButtons, IonBackButton,
} from '@ionic/vue';
import {computed, onMounted, onUpdated, ref} from 'vue';
import {useRouter} from 'vue-router';
import {CircleService} from "@/services/CircleService";
import eventBus from "@/services/EventBus";
import {ErrorCommands} from "@/models/eventCommand/ErrorCommands";
import {Circle} from "@/models/Circle";
import {HapticService} from "@/services/HapticService";
import {CircleAlertInput} from "@/models/CircleAlertInput";
import {AlertCommands} from "@/models/eventCommand/AlertCommands";
import {AlertInstruction} from "@/models/AlertInstruction";
import {CircleCommands} from "@/models/eventCommand/CircleCommands";
import {ErrorsUtils} from "@/models/ErrorsUtils";

const formData = ref({
  name: '',
});

const router = useRouter();
const circleService = new CircleService()
const isLoadingCreate = ref(false);
const isLoadingJoin = ref(false);
const canBack = ref(false);


const isFormValid = computed(() => {
  return formData.value.name;
});

async function join() {
  isLoadingJoin.value = true
  HapticService.selectingHaptic()
  try {
    const instruction = new AlertInstruction("Entrez le code du cercle", CircleCommands.JOIN_FROM_PAGE)
    eventBus.emit(AlertCommands.CIRCLE_PRIVATE_CODE,instruction)
    eventBus.on(CircleCommands.JOIN_FROM_PAGE,joinAfterAlert)
  }catch (error){
    console.log(error)
    eventBus.emit(ErrorCommands.ERROR,error)
    isLoadingJoin.value = false
  }
}
async function joinAfterAlert(alertResponse: CircleAlertInput){
  eventBus.off(CircleCommands.JOIN_FROM_PAGE)
  if (!alertResponse.circlePrivateCode){
    eventBus.emit(ErrorCommands.ERROR,new Error(ErrorsUtils.JOIN_CIRCLE_FIELD_EMPTY))
    isLoadingJoin.value = false
    return
  }
  try {
    await circleService.joinCircle(formData.value.name, alertResponse.circlePrivateCode)
    await router.push('/')
  }catch (error){
    eventBus.emit(ErrorCommands.ERROR,error)
  }finally {
    isLoadingJoin.value = false
  }

}

async function createAndJoin() {
  isLoadingCreate.value = true
  HapticService.selectingHaptic()
  let circle = new Circle(formData.value.name)
  try {
    circle = await circleService.createCircle(circle)
    await circleService.joinCircle(formData.value.name, circle.private_code)

    await router.push('/')


  }catch (error){
    console.log(error)
    eventBus.emit(ErrorCommands.ERROR,error)
  }finally {
    isLoadingCreate.value = false

  }
}

onMounted(async () => {
  const circle = await circleService.getUserCircle()
  if (circle) {
    canBack.value = true
  }
})

onUpdated(async () => {
  const circle = await circleService.getUserCircle()
  if (circle) {
    canBack.value = true
  }
})
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