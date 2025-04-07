<template>
  <li :data-id="!disabled ? name : undefined">
    <span class="pvtAttr" :class="[filtered, { sortonly, disabled }]">
      <slot name="pvtAttr" :attrName="name">{{ name }}</slot>
      <span v-if="!hideDropDownButton" class="pvtTriangle"> ▾</span>
      <VFilterBox
        v-if="open"
        :valueFilter="valueFilter"
        :name="name"
        :attrValues="attrValues"
        :sorter="sorter"
        :menuLimit="menuLimit"
      >
      </VFilterBox>
      <!-- <VFilterBox v-if="open" ></VFilterBox> -->
      <!-- <slot v-if="open" name="filterbox"></slot> -->
    </span>
  </li>
</template>

<script setup>
import VFilterBox from './VFilterBox.vue'
import { computed } from 'vue'

const emit = defineEmits([
  'update:zIndexOfFilterBox',
  'update:unselectedFilterValues',
  'update:openStatusOfFilterBox'
])

const props = defineProps({
  attributeName: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  sortOnly: {
    type: Boolean,
    default: false
  },
  open: {
    type: Boolean,
    default: false
  },
  unselectedFilterValues: {
    type: Object,
    default: () => ({})
  },
  zIndex: {
    type: Number
  },
  hideDropDown: {
    type: Boolean,
    default: false
  },
  // 임시 데이터; 필터 목록은 어떻게 할 것인지?
  attributeValues: {
    type: Array,
    default: () => []
  }
})

const hideDropDownButton = computed(
  () => props.hideDropDown || !props.attributeValues.length || props.disabled
)
</script>

<style scoped></style>
