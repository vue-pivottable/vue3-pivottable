<template>
  <li>
    <span class="pvtAttr" :class="[filtered, { restricted, fixed }]">
      <slot name="pvtAttr" :attrName="attributeName">{{ attributeName }}</slot>
      <span v-if="!hideDropDown" @click="toggleFilterBox" class="pvtTriangle">
        ▾
      </span>
      <VFilterBox
        v-if="open"
        :unselectedFilterValues="unselectedFilterValues"
        :filterBoxKey="attributeName"
        :filterBoxValues="attributeValues"
        :zIndex="zIndex"
        @update:zIndexOfFilterBox="$emit('update:zIndexOfFilterBox')"
        @update:unselectedFilterValues="$emit('update:unselectedFilterValues')"
      >
      </VFilterBox>
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
  attributeValues: {
    type: Object,
    default: () => ({})
  },
  fixed: {
    type: Boolean,
    default: false
  },
  restricted: {
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
  hideDropDownForUnused: {
    type: Boolean,
    default: false
  }
})

const toggleFilterBox = () => {
  emit('update:openStatusOfFilterBox', props.attributeName)
}

const hideDropDown = computed(
  () =>
    Object.keys(props.attributeValues).length === 0 ||
    props.hideDropDownForUnused
)

const filtered = computed(() => {
  return Object.keys(props.unselectedFilterValues).length !== 0
    ? 'pvtFilteredAttribute'
    : null
})
</script>

<style scoped>
/* css sortonly를 sortOnly로 변경해야함 */
</style>
