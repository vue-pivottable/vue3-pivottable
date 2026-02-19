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
import { aggregators, locales } from '@/helper'

const props = withDefaults(defineProps<DefaultPropsType>(), {
  aggregators: () => aggregators,
  aggregatorName: 'Count',
  renderers: () => TableRenderer,
  rendererName: 'Table',
  rowOrder: 'key_a_to_z',
  colOrder: 'key_a_to_z',
  languagePack: () => locales,
  locale: 'en',
  cols: () => [],
  rows: () => [],
  vals: () => [],
  valueFilter: () => ({}),
  sorters: () => ({}),
  derivedAttributes: () => ({}),
  tableMaxWidth: 0,
  aggregatorMap: () => ({})
})

const rendererComponent = computed(
  () => (props.renderers || TableRenderer)[props.rendererName || 'Table'] || TableRenderer.Table
)
</script>
