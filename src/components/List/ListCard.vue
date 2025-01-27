<template>
    <ion-card  class="ion-margin-bottom grid-item">
      <ion-item-sliding>
        <ion-item @click="navigateToListArticles">
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
          <ion-item-option color="danger" @click="deleteItemAlert()">Supprimer</ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-card>
</template>

<script setup lang="ts">
import {IonCard, IonCardContent, IonItem, IonItemOption, IonItemOptions, IonItemSliding} from '@ionic/vue';
import {List} from '@/models/List';
import eventBus from "@/services/EventBus";
import {ListService} from "@/services/ListService";
import {AlertInstruction} from "@/models/AlertInstruction";
import {ListCommands} from "@/models/eventCommand/ListCommands";
import {AlertCommands} from "@/models/eventCommand/AlertCommands";
import router from "@/router";

const props = defineProps<{
  list: List
}>();

const service = new ListService()


function navigateToListArticles() {
  const id = props.list.id
  const name = props.list.name
  router.push({ path: '/articles', query: { listId:id, listName:name } })
}

async function deleteItemAlert() {
  const deletionInstruction = new AlertInstruction(
      "Es-tu sur de vouloir supprimer cette liste ?",
      ListCommands.DELETE(props.list.id))

  eventBus.emit(AlertCommands.DELETION, deletionInstruction)

  eventBus.on(ListCommands.DELETE(props.list.id), deleteItem)
}


async function deleteItem(toDelete: boolean) {
  eventBus.off(ListCommands.DELETE(props.list.id))
  if (toDelete) {
    await service.deleteList(props.list.id)
    eventBus.emit(ListCommands.RELOAD)
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