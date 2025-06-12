<template>
  <tr v-if="showColTotal">
    <th
      class="pvtTotalLabel"
      :colSpan="rowAttrs.length + (colAttrs.length === 0 ? 0 : 1)"
    >
      {{ languagePack.totals }}
    </th>
    <td
      v-for="(colKey, i) in colKeys"
      :key="`total${i}`"
      class="pvtTotal"
      :style="getColTotalStyle(colKey)"
      @click="
        handleCellClick(getAggregator([], colKey).value(), [], colKey)($event)
      "
    >
      {{ getAggregator([], colKey).format(getAggregator([], colKey).value()) }}
    </td>
    <td
      v-if="showRowTotal"
      class="pvtGrandTotal"
      @click="handleCellClick(grandTotalValue, [], [])($event)"
    >
      {{ getAggregator([], []).format(grandTotalValue) }}
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProvidePivotData } from '@/composables/useProvidePivotData'
import { DefaultPropsType } from '@/types'

type VPivottableBodyRowsTotalRowProps = Pick<
  DefaultPropsType,
  'showRowTotal' | 'showColTotal' | 'languagePack' | 'tableOptions'
>

const props = defineProps<VPivottableBodyRowsTotalRowProps>()

const {
  getAggregator,
  rowTotalColors,
  colAttrs,
  rowAttrs,
  colKeys,
  pivotData
} = useProvidePivotData()

const grandTotalValue = computed(() => {
  return getAggregator([], []).value()
})

const getColTotalStyle = (colKey: any) => {
  const value = getAggregator([], colKey).value()
  return rowTotalColors(value)
}

const handleCellClick = (value: any, rowValues: any[], colValues: any[]) => {
  if (props.tableOptions?.clickCallback) {
    const filters = {} as any

    colAttrs.value.forEach((attr, i) => {
      if (colValues[i] !== undefined && colValues[i] !== null) {
        filters[attr] = colValues[i]
      }
    })

    rowAttrs.value.forEach((attr, i) => {
      if (rowValues[i] !== undefined && rowValues[i] !== null) {
        filters[attr] = rowValues[i]
      }
    })

    return (event: MouseEvent) =>
      props.tableOptions.clickCallback(event, value, filters, pivotData.value)
  }
  return () => ({})
}
</script>
