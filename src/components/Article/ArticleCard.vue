<template>
  <ion-card class="ion-margin-bottom grid-item">
    <ion-card-header>
      <ion-card-title style="font-size: 18pt">{{ article.name }} - <small>{{ article.unity_value }} {{ article.unity.name }}</small></ion-card-title>
      <ion-card-subtitle></ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>

      <p>{{ article.label.name }}</p>

      <p style="font-size: 5pt"><strong><i>ajouté par: {{ article.added_by }}</i></strong></p>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle} from '@ionic/vue';
import {Article} from "@/models/Article";

const props = defineProps<{
  article: Article
}>();

</script>

<style scoped>
ion-card-header {
  padding: 3px 20px;
}

ion-card{
  background-color: var(--ion-background-color);
  padding: 0;
}

ion-card-content{
  padding-bottom: 5px;
}
</style>