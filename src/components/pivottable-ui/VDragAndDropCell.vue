<template>
  <Draggable
    v-if="showDraggable && modelItems.length > 0"
    tag="td"
    :list="modelItems"
    :group="{ name: 'shared', pull: true, put: true }"
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

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'
import VDraggableAttribute from './VDraggableAttribute.vue'

const emit = defineEmits<{
  (
    event: 'update:draggedAttribute',
    payload: { key: string; value: string[] }
  ): void
  (event: 'update:zIndexOfFilterBox', attributeName: string): void
  (
    event: 'update:unselectedFilterValues',
    payload: { key: string; value: Record<string, boolean> }
  ): void
  (
    event: 'update:openStatusOfFilterBox',
    payload: { key: string; value: boolean }
  ): void
}>()

interface DragAndDropCellProps {
  cellType: string
  classes?: string
  attributeNames?: string[]
  allFilters?: Record<string, Record<string, number>>
  valueFilter?: Record<string, Record<string, boolean>>
  restrictedFromDragDrop?: string[]
  hideFilterBoxOfUnusedAttributes?: boolean
  zIndices?: Record<string, number>
  maxZIndex?: number
  openStatus?: Record<string, boolean>
}

const props = withDefaults(defineProps<DragAndDropCellProps>(), {
  classes: '',
  attributeNames: () => [],
  allFilters: () => ({}),
  valueFilter: () => ({}),
  restrictedFromDragDrop: () => [],
  hideFilterBoxOfUnusedAttributes: false,
  zIndices: () => ({}),
  maxZIndex: 1000,
  openStatus: () => ({})
})

const modelItems = ref<string[]>([])
const showDraggable = ref(false)

interface DragMoveEvent {
  from: HTMLElement
  to: HTMLElement
  draggedContext: {
    element: string
    index: number
  }
}

const onDragMove = (event: DragMoveEvent) => {
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
  nextTick(() => {
    showDraggable.value = true
  })
})

onBeforeUnmount(() => {
  showDraggable.value = false
})

watch(
  () => props.attributeNames,
  (newVal) => {
    modelItems.value = [...newVal]
  }
)

const hideDropDownForUnused = computed(() => {
  return props.cellType === 'unused' && props.hideFilterBoxOfUnusedAttributes
})
</script>

<style scoped></style>
