<template>
  <td>
    <h3>VDragAndDropCell ({{ cellType }})</h3>
    <Draggable
      tag="ul"
      :list="modelItems"
      :group="{ name: 'sharted', pull: true, put: true }"
      ghost-class=".pvtFilterBox"
      :preventOnfFilter="false"
      :class="classes"
      @sort="onDrag"
    >
      <VDraggableAttribute
        v-for="item in modelItems"
        :key="item"
        :disabled="disabledFromDragDrop.includes(item)"
        :sortOnly="restrictedFromDragDrop.includes(item)"
        :open="openStatus?.item"
        :unSelectedFilterValues="valueFilter?.item"
        :attributeName="item"
        :zIndex="zIndices[item]"
        :hideDropDown="hideDropDown"
        @update:zIndexOfFilterBox="$emit('update:zIndexOfFilterBox')"
        @update:unselectedFilterValues="$emit('update:unselectedFilterValues')"
        @update:openStatusOfFilterBox="$emit('update:unselectedFilterValues')"
      >
        <template #pvtAttr="{ attrName }">
          {{ attrName }}
        </template>
      </VDraggableAttribute>
    </Draggable>
  </td>
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
  // 삭제 보류
  disabledFromDragDrop: {
    type: Array,
    default: () => []
  },
  hideFilterBoxOfUnusedAttributes: {
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

const onDrag = evt => {
  console.log('event', Object.keys(evt)[0])
  emit('update:draggedAttribute', {
    cellType: props.cellType,
    attributes: modelItems.value
  })
}

onMounted(() => {
  modelItems.value = [...props.attributeNames]
})

// 이름 변경해야할 것 같음 hideDropDownInUnusedCell
const hideDropDown = computed(() => {
  return props.cellType === 'unused' && props.hideFilterBoxOfUnusedAttrs
})
</script>

<style scoped></style>
