<template>

  <ion-card class="ion-margin-bottom grid-item">
    <ion-item-sliding>
      <ion-item>
        <div class="list-header">
          <div
              class="color-pastille"
              :style="{ 'background-color': list.color }"
          ></div>
          <ion-card-content class="ion-text-center">
            <h2 class="ion-text-wrap">{{ list.name }}</h2>
          </ion-card-content>
        </div>
      </ion-item>

      <ion-item-options>
        <ion-item-option color="danger" @click="deleteItemAlert()">Delete</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-card>

</template>

<script setup lang="ts">
import {IonCard, IonCardContent, IonItem, IonItemOption, IonItemOptions, IonItemSliding} from '@ionic/vue';
import {List} from '@/models/List';
import eventBus from "@/services/EventBus";
import {ListService} from "@/services/ListService";

const props = defineProps<{
  list: List
}>();

const service = new ListService()

async function deleteItemAlert(){
  eventBus.emit("deletionConfirmation",["Es-tu sur de vouloir supprimer cette liste ?",`deleteList=${props.list.id}`])

  eventBus.on(`deleteList=${props.list.id}`, deleteItem)
}


async function deleteItem(toDelete: boolean){
  eventBus.off(`deleteList=${props.list.id}`)
  if (toDelete){
    await service.deleteList(props.list.id)
    eventBus.emit("listCreated")
  }
}
</script>

<style scoped>
.list-header {
  display: flex;
  align-items: center;
}

.color-pastille {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: 10px;
}
</style>