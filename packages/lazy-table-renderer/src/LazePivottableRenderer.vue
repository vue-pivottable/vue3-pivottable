<template>
  <table class="pvtTable">
    <VPivottableHeader
      :rowTotal="props.showRowTotal"
      :localeStrings="props.localeStrings"
    />
    <IntersectionChunkPivottableBody
      :rowTotal="props.showRowTotal"
      :colTotal="props.showColTotal"
      :tableOptions="props.tableOptions"
      :chunkSize="props.chunkSize"
      :bufferSize="props.bufferSize"
      :localeStrings="props.localeStrings"
    />
  </table>
</template>

<script setup>
import { providePivotData, PivotUtilities } from 'vue-pivottable'
import VPivottableHeader from './VPivottableHeader.vue'
import IntersectionChunkPivottableBody from './LazyPivottableBody.vue'

const props = defineProps({
  ...PivotUtilities.defaultProps,
  localeStrings: {
    type: Object,
    default: () => ({
      totals: 'Totals'
    })
  },
  tableOptions: {
    type: Object,
    default: () => ({
      clickCallback: null
    })
  },
  chunkSize: {
    type: Number,
    default: 20
  },
  bufferSize: {
    type: Number,
    default: 1
  }
})

providePivotData(props)
</script>
