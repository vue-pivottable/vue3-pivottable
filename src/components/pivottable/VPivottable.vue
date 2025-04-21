<template>
  <component
    :is="rendererComponent"
    v-bind="props"
  />
</template>

<script setup>
import { computed } from 'vue'
import { defaultProps } from '@/helper'
import TableRenderer from './renderer'
const props = defineProps({
  ...defaultProps,
  renderers: {
    type: Object,
    default: () => TableRenderer
  }
})

const rendererComponent = computed(
  () => props.renderers[props.rendererName] || TableRenderer.Table
)
</script>
