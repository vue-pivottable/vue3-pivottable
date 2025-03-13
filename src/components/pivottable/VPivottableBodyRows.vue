<template>
  <tr>
    <th v-for="(text, j) in rowKey" :key="`rowKeyLabel${index}-${j}`"
      class="pvtRowLabel"
      :rowspan="spanSize(rowKeys, index, j)"
      :colspan="j === rowAttrs.length - 1 && colAttrs.length !== 0 ? 2 : 1"
    >
      {{ text }}
    </th>
    <td v-for="(colKey, j) in colKeys" :key="`pvtVal${index}-${j}`"
      :class="['pvVal']"
    >
    {{ getValue(rowKey, colKey) }}
    </td>
    <td v-if="rowTotal"
      class="pvtTotal"
    >
      {{ getTotalValue(rowKey, []) }}
    </td>
  </tr>
</template>

<script setup>
import { spanSize } from '../../helper'
const props = defineProps({
  pivotData: Object,
  index: Number,
  rowKeys: Array,
  rowKey: Array,
  colKeys: Array,
  rowAttrs: Array,
  colAttrs: Array,
  tableOptions: Object,
  rowTotal: Boolean
})
const getValue = (rowKey, colKey) => {
  const aggregator = props.pivotData.getAggregator(rowKey, colKey)
  return aggregator.format(aggregator.value())
}
const getTotalValue = (rowKey, colKey) => {
  const totalAggregator = props.pivotData.getAggregator(rowKey, colKey)
  return totalAggregator.format(totalAggregator.value())
}

</script>

<style lang="scss" scoped>

</style>
