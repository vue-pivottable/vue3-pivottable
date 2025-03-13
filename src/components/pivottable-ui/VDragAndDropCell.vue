<template>
  <td>
    VDragAndDropCell ({{ attrs }})
    <!-- <Draggable v-model="testItems" class="list-group">
    <VDraggableAttribute v-for="item in testItems" :key="item" :name="item" :attrValues="{}"
      :sorter="getSort(() => { }, item)" :menuLimit="500" class="list-group-item">
      <template #pvtAttr="{ attrName }">
        {{ attrName }}
      </template>
    </VDraggableAttribute>
  </Draggable> -->
  </td>
</template>

<script setup>
// FIXME:
defineProps({
  attrs: {
    type: String,
    default: ''
  }
})
// import VDraggableAttribute from './VDraggableAttribute.vue'
// import { VueDraggableNext as Draggable } from 'vue-draggable-next'
// import { ref } from 'vue'
// import { PivotData, getSort, sortAs, aggregators } from '../../helper'

// const testItems = ref([
//   'coffee',
//   'iced tea',
//   'apple tea',
//   'pouch',
//   'green tea',
//   'subway',
//   'cookie',
//   'hand cream'
// ])

</script>

<style lang="scss" scoped>
</style>
