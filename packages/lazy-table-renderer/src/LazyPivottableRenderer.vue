<template>
  <table class="pvtTable">
    <VPivottableHeader
      :row-total="props.showRowTotal"
      :locale-strings="props.localeStrings"
    />
    <IntersectionChunkPivottableBody
      :row-total="props.showRowTotal"
      :col-total="props.showColTotal"
      :table-options="props.tableOptions"
      :chunk-size="props.chunkSize"
      :buffer-size="props.bufferSize"
      :locale-strings="props.localeStrings"
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
