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
      v-if="rowTotal"
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

<script setup>
import { useProvidePivotData } from '@/composables/useProvidePivotData'

const props = defineProps({
  rowKeys: {
    type: Array,
    required: true
  },
  colKeys: {
    type: Array,
    required: true
  },
  rowTotal: {
    type: Boolean,
    required: true
  },
  tableOptions: {
    type: Object,
    required: true
  }
})

const {
  pivotData,
  spanSize,
  valueCellColors,
  colTotalColors,
  rowAttrs,
  colAttrs,
  getAggregator
} = useProvidePivotData()

const getValueCellStyle = (rowKey, colKey) => {
  const value = getAggregator(rowKey, colKey).value()
  return valueCellColors(rowKey, colKey, value)
}

const getRowTotalStyle = (rowKey) => {
  const value = getAggregator(rowKey, []).value()
  return colTotalColors(value)
}

const handleCellClick = (value, rowValues, colValues) => {
  if (props.tableOptions?.clickCallback) {
    const filters = {}

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

    return (event) =>
      props.tableOptions.clickCallback(event, value, filters, pivotData.value)
  }
  return () => ({})
}
</script>
