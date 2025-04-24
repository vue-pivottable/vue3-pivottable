<template>
  <thead>
    <template v-if="pivotData">
      <tr
        v-for="(c, j) in colAttrs"
        :key="`colAttrs${j}`"
      >
        <th
          v-if="j === 0 && rowAttrs.length !== 0"
          :colSpan="rowAttrs.length"
          :rowSpan="colAttrs.length"
        ></th>
        <th class="pvtAxisLabel">{{ c }}</th>
        <VPivottableHeaderColumns
          :colKeys="colKeys"
          :colIndex="j"
          :colAttrsLength="colAttrs.length"
          :rowAttrsLength="rowAttrs.length"
        />
        <VPivottableHeaderRowsTotal
          v-if="j === 0 && rowTotal"
          :colAttrsLength="colAttrs.length"
          :rowAttrsLength="rowAttrs.length"
          :localeStrings="localeStrings"
        />
      </tr>
      <VPivottableHeaderRows
        v-if="rowAttrs.length !== 0"
        :rowAttrs="rowAttrs"
        :rowTotal="rowTotal"
        :colAttrsLength="colAttrs.length"
        :localeStrings="localeStrings"
      />
    </template>
  </thead>
</template>

<script setup>
import { useProvidePivotData } from 'vue-pivottable'
import VPivottableHeaderColumns from './VPivottableHeaderColumns.vue'
import VPivottableHeaderRows from './VPivottableHeaderRows.vue'
import VPivottableHeaderRowsTotal from './VPivottableHeaderRowsTotal.vue'

defineProps({
  rowTotal: {
    type: Boolean,
    default: true
  },
  localeStrings: {
    type: Object,
    default: () => ({
      totals: 'Totals'
    })
  }
})

const { pivotData, colAttrs, rowAttrs, colKeys } = useProvidePivotData()
</script>
