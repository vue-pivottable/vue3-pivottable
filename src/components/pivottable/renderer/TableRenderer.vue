<template>
  <table class="pvtTable">
    <VPivottableHeader
      :row-total="props.showRowTotal"
      :locale-strings="props.localeStrings"
    />
    <VPivottableBody
      :row-total="props.showRowTotal"
      :table-options="props.tableOptions"
    />
  </table>
</template>

<script setup>
import { defaultProps } from '@/helper'
import { providePivotData } from '@/composables/useProvidePivotData'
import VPivottableHeader from '../VPivottableHeader.vue'
import VPivottableBody from '../VPivottableBody.vue'

const props = defineProps({
  ...defaultProps,
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
  }
})
providePivotData(props)
</script>
