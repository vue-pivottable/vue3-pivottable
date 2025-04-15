<template>
  <td>
    <Draggable
      tag="td"
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
        :fixed="fixedFromDragDrop.includes(item)"
        :restricted="restrictedFromDragDrop.includes(item)"
        :open="openStatus?.[item]"
        :unSelectedFilterValues="valueFilter?.[item]"
        :attributeName="item"
        :attributeValues="allFilters[item]"
        :zIndex="zIndices[item]"
        :hideDropDownForUnused="hideDropDownForUnused"
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
  allFilters: {
    type: Object,
    default: () => ({})
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
  fixedFromDragDrop: {
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
  openStatus: {
    type: Object,
    default: () => ({})
  }
})

const modelItems = ref([])

const onDrag = () => {
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
