<template>
  <li @mousedown="handleMouseDown">
    <span
      class="pvtAttr"
      :class="[filtered, { restricted }]"
    >
      <slot
        name="pvtAttr"
        :attr-name="attributeName"
      >{{ attributeName }}</slot>
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
        :unselected-filter-values="unselectedFilterValues"
        :filter-box-key="attributeName"
        :filter-box-values="attributeValues"
        :z-index="zIndex"
        @mousedown.stop
        @update:z-index-of-filter-box="
          $emit('update:zIndexOfFilterBox', $event)
        "
        @update:unselected-filter-values="
          $emit('update:unselectedFilterValues', $event)
        "
      />
    </span>
  </li>
</template>

<script setup lang="ts">
import VFilterBox from './VFilterBox.vue'
import { computed } from 'vue'

const emit = defineEmits<{
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

interface DraggableAttributeProps {
  attributeName: string
  attributeValues?: Record<string, number>
  restricted?: boolean
  open?: boolean
  unselectedFilterValues?: Record<string, boolean>
  zIndex?: number
  hideDropDownForUnused?: boolean
}

const props = withDefaults(defineProps<DraggableAttributeProps>(), {
  attributeValues: () => ({}),
  restricted: false,
  open: false,
  unselectedFilterValues: () => ({}),
  zIndex: 1000,
  hideDropDownForUnused: false
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
