<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Inscrition</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form @submit.prevent="signUp">
        <div class="register-container">
          <ion-item class="input-item">
            <ion-input type="email" v-model="formData.email" label="Email" placeholder="Entrez votre email"></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-input v-model="formData.name" label="Nom" placeholder="Entrez votre nom"></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-input type="password" v-model="formData.password" label="Mot de passe"
                       placeholder="Entrez votre mot de passe"></ion-input>
          </ion-item>
          <ion-button
              type="submit"
              class="register-button" expand="block"
              :disabled="isLoading || !isFormValid"
          >
            <span v-if="!isLoading">S'inscrire</span>
            <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
          </ion-button>
          <ion-button class="login-button" expand="block" fill="clear" router-link="/login">
            Déjà un compte ? Se connecter
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
import {supabase} from "@/config/supabaseClientConfig";
import {UserService} from "@/services/UserService";

const formData = ref({
  email: '',
  name:'',
  password: ''
});

const router = useRouter();
const userService = new UserService()
const isLoading = ref(false);

const isFormValid = computed(() => {
  return formData.value.email && formData.value.password && formData.value.name;
});

async function signUp() {
  isLoading.value = true
  const added = await userService.signUp(formData.value.email, formData.value.password, formData.value.name)
  isLoading.value = false

  if (!added) {
    console.error("Erreur lors de l'inscription:", error);
  } else {
    await router.push('/login');
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