<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { supabase } from '@/config/supabaseClientConfig'

const countries = ref([])

async function getCountries() {
  const { data } = await supabase.from('countries').select()
  countries.value = data
}

onMounted(() => {
  getCountries()
})
</script>
