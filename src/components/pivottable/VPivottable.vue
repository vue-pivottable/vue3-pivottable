<template>
  <component
    v-bind="props"
    :is="rendererComponent"
  />
</template>

<script setup>
import { computed } from 'vue'
import { defaultProps } from '@/helper'
import TableRenderer from './renderer'
const props = defineProps({
  ...defaultProps
})

const rendererComponent = computed(
  () => props.renderers[props.rendererName] || TableRenderer.Table
)
</script>
