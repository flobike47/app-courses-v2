<template>
  <ion-card class="ion-margin-bottom grid-item" :class="{ opacity: article.deleted }">
    <div class="" :class="{ active: selected , 'status-dot': !article.deleted}"></div>
    <ion-item-sliding @ionSwipe="select" ref="itemSliding" :disabled="article.deleted" >
      <ion-item :class="{ selected: selected }" lines="full">
        <div class="item-content">
          <ion-card-header>
            <ion-card-title style="font-size: 18pt">
              {{ article.name }} -
              <small>{{ article.unity_value }} {{ article.unity.name }}</small>
            </ion-card-title>
            <ion-card-subtitle></ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <p>{{ article.label.name }}</p>
            <p style="font-size: 5pt">
              <strong><i>ajouté par: {{ article.added_by }}</i></strong>
            </p>
          </ion-card-content>
        </div>
      </ion-item>

      <ion-item-options>
        <ion-item-option color="tertiary" expandable @click="select">
          Selectionner
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonItem
} from '@ionic/vue';
import {ref, defineEmits, watch, onMounted} from 'vue';

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const selected = ref(false)
const itemSliding = ref();


const emit = defineEmits(['update:modelValue', 'select'])

watch(() => props.modelValue, (newValue) => {
  selected.value = newValue;
});

const select = () => {
  selected.value = !selected.value;
  emit('update:modelValue', selected.value);
  emit('select', props.article);
  itemSliding.value.$el.close()
};

onMounted(() => {
  selected.value = props.modelValue;
})

</script>

<style scoped>
ion-card-header {
  padding: 3px 29px;
}

ion-card {
  background-color: var(--ion-background-color);
  padding: 0;
  position: relative; /* Ajout pour le positionnement absolu du dot */
}

ion-item-sliding {
  background: none;
}

ion-card-content {
  padding-bottom: 5px;
  padding-left: 29px;
}

.opacity {
  opacity: 0.33;
}

.selected {
  background-color: var(--ion-color-primary);
}

.status-dot {
  position: absolute;
  left: 10px;
  top: 37%;
  z-index: 10;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid #1a1a1a;
  background-color: transparent;
}

.status-dot.active {
  background-color: var(--ion-color-tertiary);;
}

.item-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>