<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Paramètres</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list :inset="true">
        <ion-item>
          <ion-toggle
              :checked="paletteToggle"
              @ionChange="toggleChange($event)"
              justify="space-between"
          >
            Mode sombre
          </ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonToggle,
  ToggleCustomEvent
} from '@ionic/vue';
import { ref, onMounted } from 'vue';

// Reference for dark mode toggle
const paletteToggle = ref(false);

// Check system preference for dark mode
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Toggle dark palette class on html element
const toggleDarkPalette = (shouldAdd: boolean) => {
  document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  // Save preference to local storage
  localStorage.setItem('darkMode', JSON.stringify(shouldAdd));
};

// Initialize dark mode based on saved preference or system preference
const initializeDarkPalette = (isDark: boolean) => {
  paletteToggle.value = isDark;
  toggleDarkPalette(isDark);
};

onMounted(() => {
  // Check if there's a saved preference
  const savedDarkMode = localStorage.getItem('darkMode');

  if (savedDarkMode !== null) {
    // Use saved preference if it exists
    const isDark = JSON.parse(savedDarkMode);
    initializeDarkPalette(isDark);
  } else {
    // Otherwise, use system preference
    initializeDarkPalette(prefersDark.matches);
  }

  // Listen for changes to the prefers-color-scheme media query
  prefersDark.addEventListener('change', (mediaQuery) => {
    // Only change if no saved preference exists
    if (localStorage.getItem('darkMode') === null) {
      initializeDarkPalette(mediaQuery.matches);
    }
  });
});

// Handle toggle change event
const toggleChange = (event: ToggleCustomEvent) => {
  toggleDarkPalette(event.detail.checked);
};
</script>