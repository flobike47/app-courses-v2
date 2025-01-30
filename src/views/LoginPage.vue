<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Connexion</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form @submit.prevent="signIn">
        <div class="login-container">
          <ion-item class="input-item">
            <ion-input type="email" v-model="formData.email" label="Email" placeholder="Entrez votre email"></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-input type="password" v-model="formData.password" label="Mot de passe"
                       placeholder="Entrez votre mot de passe"></ion-input>
          </ion-item>
          <ion-button
              type="submit"
              class="login-button" expand="block"
              :disabled="isLoading || !isFormValid"
          >
            <span v-if="!isLoading">Se connecter</span>
            <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
          </ion-button>
          <ion-button class="google-login-button" expand="block" @click="signInWithGoogle">

            <ion-icon v-if="!isGoogleLoading" slot="start" :icon="logoGoogle"/>
            <span v-if="!isGoogleLoading">Se connecter avec Google</span>
            <ion-spinner v-if="isGoogleLoading" name="crescent"></ion-spinner>
          </ion-button>
          <ion-button class="register-button" expand="block" fill="clear" router-link="/register">
            Pas encore de compte ? S'inscrire
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
  IonButton,
  IonSpinner,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonIcon
} from '@ionic/vue';
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import {UserService} from "@/services/UserService";
import {logoGoogle} from "ionicons/icons";
import {App} from "@capacitor/app";
import {Token} from "@/models/Token";
import {ErrorsUtils} from "@/models/ErrorsUtils";
import eventBus from "@/services/EventBus";
import {ErrorCommands} from "@/models/eventCommand/ErrorCommands";


const formData = ref({
  email: '',
  password: ''
});

const router = useRouter();
const userService = new UserService()
const isLoading = ref(false);
const isGoogleLoading = ref(false);

const isFormValid = computed(() => {
  return formData.value.email && formData.value.password;
});

async function signIn() {
  isLoading.value = true
  try {
    await userService.signIn(formData.value.email, formData.value.password)
    await router.push('/tabs/home');
  } catch (error) {
    console.log(error)
    eventBus.emit(ErrorCommands.ERROR,  new Error(ErrorsUtils.INVALID_CREDENTIALS))
  } finally {
    isLoading.value = false
  }
}

async function signInWithGoogle() {
  isGoogleLoading.value = true
  await userService.signInWithGoogle()

  App.addListener('appUrlOpen', async ({url}) => {
    if (url.startsWith('app-courses://')) {
      const token = extractTokenFromUrl(url)
      try {
        await setSessionFromUserToken(token)
        await router.push('/')
      } catch (error) {
        console.log(error)
      } finally {
        isGoogleLoading.value = false
      }
    }
  });
}

function extractTokenFromUrl(url: string): Token | null {
  const fragment = url.split('#')[1];

  if (fragment) {
    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      return new Token(accessToken, refreshToken)
    }
  }

  return null;
}

async function setSessionFromUserToken(token: Token) {
  await userService.setUserSession(token.accessToken, token.refreshToken);
}

</script>

<style scoped>
.login-container {
  padding-top: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.google-login-button {
  margin-top: 10px;
  --background: #db4437; /* Couleur du bouton Google */
  --color: white;
  --border-radius: 10px;
  --padding-start: 10px;
  --padding-end: 10px;
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

.login-button {
  margin-top: 20px;
  margin-bottom: 10px;
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 10px;
  --padding-start: 20px;
  --padding-end: 20px;
}

.register-button {
  --color: var(--ion-color-medium);
}
</style>