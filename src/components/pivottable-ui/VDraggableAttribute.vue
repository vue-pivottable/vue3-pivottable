<template>
  <li :data-id="!disabled ? name : undefined">
    <span class="pvtAttr" :class="[filtered, { sortonly, disabled }]">
      <slot name="pvtAttr" :attrName="name">{{ name }}</slot>
      <span v-if="showDropdown" class="pvtTriangle"> ▾</span>
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
  }
})

const disabled = computed(() => !props.sortable && !props.draggable)
const sortonly = computed(() => props.sortable && !props.draggable)

const filtered = computed(() =>
  Object.keys(props.valueFilter).length !== 0 ? 'pvtFilteredAttribute' : ''
)
const showDropdown = computed(
  () => !disabled.value && (props.async ? !props.unused : true)
)
</script>

<style scoped></style>
