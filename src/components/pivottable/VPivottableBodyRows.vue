<template>
  <tr
    v-for="(rowKey, i) in rowKeys"
    :key="`rowKeyRow${i}`"
  >
    <template
      v-for="(text, j) in rowKey"
      :key="`rowLabel${i}-${j}`"
    >
      <th
        v-if="spanSize(rowKeys, i, j) !== -1"
        class="pvtRowLabel"
        :rowSpan="spanSize(rowKeys, i, j)"
        :colSpan="j === rowAttrs.length - 1 && colAttrs.length !== 0 ? 2 : 1"
      >
        {{ text }}
      </th>
    </template>
    <td
      v-for="(colKey, j) in colKeys"
      :key="`pvtVal${i}-${j}`"
      class="pvVal"
      :style="getValueCellStyle(rowKey, colKey)"
      @click="
        handleCellClick(
          getAggregator(rowKey, colKey).value(),
          rowKey,
          colKey
        )($event)
      "
    >
      {{
        getAggregator(rowKey, colKey).format(
          getAggregator(rowKey, colKey).value()
        )
      }}
    </td>
    <td
      v-if="showRowTotal"
      class="pvtTotal"
      :style="getRowTotalStyle(rowKey)"
      @click="
        handleCellClick(getAggregator(rowKey, []).value(), rowKey, [])($event)
      "
    >
      {{ getAggregator(rowKey, []).format(getAggregator(rowKey, []).value()) }}
    </td>
  </tr>
</template>

<script setup lang="ts">
import { useProvidePivotData } from '@/composables'
import { DefaultPropsType } from '@/types'

type VPivottableBodyRowsProps = Pick<
  DefaultPropsType,
  'showRowTotal' | 'tableOptions'
> & {
  rowKeys: any[][]
  colKeys: any[][]
}

const props = defineProps<VPivottableBodyRowsProps>()
const {
  pivotData,
  spanSize,
  valueCellColors,
  colTotalColors,
  rowAttrs,
  colAttrs,
  getAggregator
} = useProvidePivotData()

const getValueCellStyle = (rowKey: any, colKey: any) => {
  const value = getAggregator(rowKey, colKey).value()
  return valueCellColors(rowKey, colKey, value)
}

const getRowTotalStyle = (rowKey: any) => {
  const value = getAggregator(rowKey, []).value()
  return colTotalColors(value)
}

const handleCellClick = (value: any, rowValues: any, colValues: any) => {
  if (props.tableOptions?.clickCallback) {
    const filters = {} as any

    colAttrs.value.forEach((attr: string, i: number) => {
      if (colValues[i] !== undefined && colValues[i] !== null) {
        filters[attr] = colValues[i]
      }
    })

    rowAttrs.value.forEach((attr: string, i: number) => {
      if (rowValues[i] !== undefined && rowValues[i] !== null) {
        filters[attr] = rowValues[i]
      }
    })

    return (event: MouseEvent) =>
      props.tableOptions?.clickCallback(event, value, filters, pivotData.value)
  }
  return () => ({})
}
</script>
