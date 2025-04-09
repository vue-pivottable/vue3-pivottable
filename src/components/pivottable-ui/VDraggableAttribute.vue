<template>
  <li>
    <span class="pvtAttr" :class="[filtered, { sortOnly, disabled }]">
      <slot name="pvtAttr" :attrName="attributeName">{{ attributeName }}</slot>
      <span
        v-if="!hideDropDownButton"
        @click="toggleFilterBox"
        class="pvtTriangle"
      >
        ▾
      </span>
      <VFilterBox
        v-if="open"
        :unselectedFilterValues="unselectedFilterValues"
        :filterBoxKey="attributeName"
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

const toggleFilterBox = () => {
  emit('update:openStatusOfFilterBox', props.attributeName)
}

const hideDropDownButton = computed(
  () => props.hideDropDown || !props.attributeValues.length || props.disabled
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
