<template>
  <tbody v-if="pivotData">
    <VPivottableBodyRows
      :rowKeys="rowKeys"
      :colKeys="colKeys"
      :rowTotal="rowTotal"
      :tableOptions="tableOptions"
    />
    <VPivottableBodyRowsTotalRow
      :colTotal="colTotal"
      :rowTotal="rowTotal"
      :rowAttrs="rowAttrs"
      :colAttrs="colAttrs"
      :colKeys="colKeys"
      :localeStrings="localeStrings"
      :tableOptions="tableOptions"
    />
  </tbody>
</template>

<script setup>
import { usePivotData } from '@/composables/usePivotData'
import VPivottableBodyRows from './VPivottableBodyRows.vue'
import VPivottableBodyRowsTotalRow from './VPivottableBodyRowsTotalRow.vue'

defineProps({
  rowTotal: {
    type: Boolean,
    default: true
  },
  colTotal: {
    type: Boolean,
    default: true
  },
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

const {
  pivotData,
  rowKeys,
  colKeys,
  rowAttrs,
  colAttrs
} = usePivotData()

</script>
