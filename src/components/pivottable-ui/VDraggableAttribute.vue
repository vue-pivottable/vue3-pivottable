<template>
  <div :data-id="!disabled ? name : undefined">
    <span class="pvtAttr" :class="[filtered, { sortonly, disabled }]">
      <slot name="pvtAttr" :attrName="name">{{ name }}</slot>
      <span
        v-if="showDropdown"
        class="pvtTriangle"
      > ▾</span>
      <VFilterBox v-if="true" ></VFilterBox>
      <!-- <VFilterBox v-if="open" ></VFilterBox> -->
      <!-- <slot v-if="open" name="filterbox"></slot> -->
    </span>
  </div>
</template>

<script setup>
import VFilterBox from './VFilterBox.vue'
import { computed } from 'vue'

const props = defineProps({
  draggable: {
    type: Boolean,
    default: true
  },
  sortable: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    default: false
  },
  async: Boolean,
  unused: Boolean,
  valueFilter: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const disabled = computed(() => !props.sortable && !props.draggable)
const sortonly = computed(() => props.sortable && !props.draggable)

const filtered = computed(() => Object.keys(props.valueFilter).length !== 0 ? 'pvtFilteredAttribute' : '')
const showDropdown = computed(() => !disabled.value && (props.async ? !props.unused : true))

</script>
