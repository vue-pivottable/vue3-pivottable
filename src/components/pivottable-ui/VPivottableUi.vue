<template>
  <table class="pvtUi">
    <tbody>
      <tr>
        <td>rendererCell</td>
        <td>
          <Draggable v-model="testItems" class="list-group">
            <VDraggableAttribute
              v-for="item in testItems"
              :key="item"
              :name="item"
              class="list-group-item"
            >
              <template #pvtAttr="{ attrName }">
                {{ attrName }}
              </template>
            </VDraggableAttribute>
          </Draggable>
        </td>
      </tr>
      <tr>
        <td>
          aggregatorCell
        </td>
        <td>
          draggable(colAttrsCell)
        </td>
      </tr>
      <tr>
        <td>draggable(rowAttrsCell)</td>
        <td>table rendered</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import VDraggableAttribute from './VDraggableAttribute.vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'
import { ref } from 'vue'

const testItems = ref([
  'coffee',
  'iced tea',
  'apple tea',
  'pouch',
  'green tea',
  'subway',
  'cookie',
  'hand cream'
])

</script>

<style scoped>
.pvtUi {
  border-collapse: collapse;
  width: 100%;
}

.pvtUi td, .pvtUi th {
  border: 1px solid black;
  padding: 8px;
}
</style>
