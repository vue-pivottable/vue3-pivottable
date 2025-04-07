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
        :sorter="getSort(() => {}, item)"
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

const emit = defineEmits([
  'update:draggedAttribute',
  'update:zIndexOfFilterbox'
])

const props = defineProps({
  cellType: {
    type: String,
    required: true
  },
  // 삭제할 수 있으면 삭제
  classes: {
    type: String,
    default: ''
  },
  attributeNames: {
    type: Array,
    default: () => []
  },
  valueFilter: {
    type: Object,
    default: () => ({})
  },
  // 같은 셀 내 이동만 가능(정렬)
  restrictedFromDragDrop: {
    type: Array,
    default: () => []
  },
  disabledFromDragDrop: {
    type: Array,
    default: () => []
  },
  hideFilterBoxOfUnusedAttrs: {
    type: Boolean,
    default: false
  },
  zIndices: {
    type: Array,
    default: () => []
  },
  openStatus: {
    type: Object,
    default: () => ({})
  }
})

const modelItems = ref([])

const onChange = evt => {
  console.log('event', Object.keys(evt)[0])
  emit('update:filters', {
    cellType: props.cellType,
    filters: modelItems.value
  })
}

onMounted(() => {
  modelItems.value = [...props.attributeNames]
})
</script>

<style scoped></style>
