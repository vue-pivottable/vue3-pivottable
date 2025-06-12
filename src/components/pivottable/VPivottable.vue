<template>
  <component
    v-bind="props"
    :is="rendererComponent"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TableRenderer from './renderer'
import { DefaultPropsType } from '@/types'

const props = defineProps<DefaultPropsType>()

const rendererComponent = computed(
  () => props.renderers[props.rendererName] || TableRenderer.Table
)
</script>
