<template>
  <tbody v-if="pivotData">
    <VPivottableBodyRows
      :row-keys="rowKeys"
      :col-keys="colKeys"
      :row-total="rowTotal"
      :table-options="tableOptions"
    />
    <VPivottableBodyRowsTotalRow
      :col-total="colTotal"
      :row-total="rowTotal"
      :row-attrs="rowAttrs"
      :col-attrs="colAttrs"
      :col-keys="colKeys"
      :locale-strings="localeStrings"
      :table-options="tableOptions"
    />
  </tbody>
</template>

<script setup>
import { useProvidePivotData } from '@/composables/useProvidePivotData'
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

const { pivotData, rowKeys, colKeys, rowAttrs, colAttrs } =
  useProvidePivotData()
</script>
