<template>
  <Draggable
    tag="td"
    :list="modelItems"
    :group="{ name: 'sharted', pull: true, put: true }"
    :ghost-class="'pvtPlaceholder'"
    :prevent-on-filter="false"
    :class="classes"
    @change="onDragEnd"
    :move="onDragMove"
  >
    <VDraggableAttribute
      v-for="item in modelItems"
      :key="item"
      :restricted="restrictedFromDragDrop.includes(item)"
      :open="openStatus[item]"
      :unselected-filter-values="valueFilter[item]"
      :attributeName="item"
      :attribute-values="allFilters[item]"
      :z-index="zIndices[item] || maxZIndex"
      :hide-drop-down-for-unused="hideDropDownForUnused"
      @update:z-index-of-filter-box="$emit('update:zIndexOfFilterBox', $event)"
      @update:unselected-filter-values="
        $emit('update:unselectedFilterValues', $event)
      "
      @update:open-status-of-filter-box="
        $emit('update:openStatusOfFilterBox', $event)
      "
    >
      <template #pvtAttr="{ attrName }">
        <slot
          name="pvtAttr"
          :attr-name="attrName"
        >
          {{ attrName }}
        </slot>
      </template>
    </VDraggableAttribute>
  </Draggable>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'
import VDraggableAttribute from './VDraggableAttribute.vue'

const emit = defineEmits([
  'update:draggedAttribute',
  'update:zIndexOfFilterBox',
  'update:unselectedFilterValues',
  'update:openStatusOfFilterBox'
])

const props = defineProps({
  cellType: {
    type: String,
    required: true
  },
  classes: {
    type: String,
    default: ''
  },
  attributeNames: {
    type: Array,
    default: () => []
  },
  allFilters: {
    type: Object,
    default: () => ({})
  },
  valueFilter: {
    type: Object,
    default: () => ({})
  },
  restrictedFromDragDrop: {
    type: Array,
    default: () => []
  },
  hideFilterBoxOfUnusedAttributes: {
    type: Boolean,
    default: false
  },
  zIndices: {
    type: Object,
    default: () => ({})
  },
  maxZIndex: {
    type: Number,
    default: 1000
  },
  openStatus: {
    type: Object,
    default: () => ({})
  }
})

const modelItems = ref([])

const onDragMove = (event) => {
  const draggedItem = event.draggedContext.element
  const isCrossCellMove = event.from !== event.to

  if (isCrossCellMove && props.restrictedFromDragDrop.includes(draggedItem)) {
    return false
  }

  return true
}

const onDragEnd = () => {
  if (props.cellType !== 'unused') {
    emit('update:draggedAttribute', {
      key: props.cellType,
      value: modelItems.value
    })
  }
}

onMounted(() => {
  modelItems.value = [...props.attributeNames]
})

const hideDropDownForUnused = computed(() => {
  return props.cellType === 'unused' && props.hideFilterBoxOfUnusedAttributes
})
</script>

<style scoped></style>
