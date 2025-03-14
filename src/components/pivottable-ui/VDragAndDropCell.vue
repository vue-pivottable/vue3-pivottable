<template>
  <td>
    <h3>VDragAndDropCell ({{ attrs }})</h3>
    <Draggable
      v-model="modelItems"
      :class="classNames"
      :group="{ name: 'sharted', pull: true, put: true }"
      ghost-class="pvtPlaceholder"
      @change="onChange"
      tag="ul"
      :preventOnfFilter="false"
    >
    <!-- :modelValue="items" -->
    <!-- @update:modelValue="onChange" -->
    <!-- @sort="onChange"-->
      <VDraggableAttribute
        v-for="item in modelItems"
        :key="item"
        :name="item"
        :sortable="true"
        :draggable="true"
        :attrValues="{}"
        :sorter="getSort(() => { }, item)"
        :menuLimit="500"
        :zIndex="1000"
        :valueFilter="{}"
        :open="false"
        :async="false"
        :unused="false"
        :localeStrings="{}"
      >
        <template #pvtAttr="{ attrName }">
          {{ attrName }}
        </template>
      </VDraggableAttribute>
    </Draggable>
  </td>
</template>

<script setup>
import VDraggableAttribute from './VDraggableAttribute.vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'
import { ref, onMounted } from 'vue'
import { PivotData, getSort, sortAs, aggregators } from '../../helper'

const emit = defineEmits(['update:filters'])

const props = defineProps({
  attrs: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  classNames: {
    type: Array,
    default: () => []
  }
})

const modelItems = ref([])

const onChange = evt => {
  console.log('event', Object.keys(evt)[0])
  emit('update:filters', { cellType: props.attrs, filters: modelItems.value })
}

onMounted(() => {
  modelItems.value = [...props.items]
})

</script>

<style scoped>
</style>
