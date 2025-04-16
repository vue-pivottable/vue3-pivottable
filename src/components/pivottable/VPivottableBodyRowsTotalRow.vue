<template>
  <tr v-if="colTotal">
    <th
      class="pvtTotalLabel"
      :colSpan="rowAttrs.length + (colAttrs.length === 0 ? 0 : 1)"
    >
      {{ localeStrings.totals }}
    </th>
    <td
      v-for="(colKey, i) in colKeys"
      :key="`total${i}`"
      class="pvtTotal"
      :style="getColTotalStyle(colKey)"
      @click="handleCellClick(getAggregator([], colKey).value(), [], colKey)"
    >
      {{ getAggregator([], colKey).format(getAggregator([], colKey).value()) }}
    </td>
    <td
      v-if="rowTotal"
      class="pvtGrandTotal"
      @click="handleCellClick(grandTotalValue, [], [])"
    >
      {{ getAggregator([], []).format(grandTotalValue) }}
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import { useProvidePivotData } from '@/composables/useProvidePivotData'

const props = defineProps({
  colTotal: {
    type: Boolean,
    required: true
  },
  rowTotal: {
    type: Boolean,
    required: true
  },
  localeStrings: {
    type: Object,
    required: true
  },
  tableOptions: {
    type: Object,
    required: true
  }
})

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

const getColTotalStyle = colKey => {
  const value = getAggregator([], colKey).value()
  return rowTotalColors(value)
}

const handleCellClick = (value, rowValues, colValues) => {
  if (props.tableOptions?.clickCallback) {
    const filters = {}

    // Add column filters
    colAttrs.value.forEach((attr, i) => {
      if (colValues[i] !== undefined && colValues[i] !== null) {
        filters[attr] = colValues[i]
      }
    })

    // Add row filters
    rowAttrs.value.forEach((attr, i) => {
      if (rowValues[i] !== undefined && rowValues[i] !== null) {
        filters[attr] = rowValues[i]
      }
    })

    props.tableOptions.clickCallback(event, value, filters, pivotData.value)
  }
}
</script>
