<template>
  <li @mousedown="handleMouseDown">
    <span
      class="pvtAttr"
      :class="[filtered, { restricted }]"
    >
      <slot
        name="pvtAttr"
        :attrName="attributeName"
        >{{ attributeName }}</slot
      >
      <span
        v-if="!hideDropDown"
        @mousedown.stop
        @click.stop="toggleFilterBox"
        class="pvtTriangle"
      >
        ▾
      </span>
      <VFilterBox
        v-if="open"
        :unselectedFilterValues="unselectedFilterValues"
        :filterBoxKey="attributeName"
        :filterBoxValues="attributeValues"
        :zIndex="zIndex"
        @mousedown.stop
        @update:zIndexOfFilterBox="$emit('update:zIndexOfFilterBox', $event)"
        @update:unselectedFilterValues="
          $emit('update:unselectedFilterValues', $event)
        "
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
  emit('update:openStatusOfFilterBox', {
    key: props.attributeName,
    value: !props.open
  })
}

const handleMouseDown = () => {
  if (props.open) {
    emit('update:openStatusOfFilterBox', {
      key: props.attributeName,
      value: false
    })
  }
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
