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
        />
        <th class="pvtAxisLabel">
          {{ c }}
        </th>
        <VPivottableHeaderColumns
          :col-keys="colKeys"
          :col-index="j"
          :col-attrs-length="colAttrs.length"
          :row-attrs-length="rowAttrs.length"
        />
        <VPivottableHeaderRowsTotal
          v-if="j === 0 && rowTotal"
          :col-attrs-length="colAttrs.length"
          :row-attrs-length="rowAttrs.length"
          :locale-strings="localeStrings"
        />
      </tr>
      <VPivottableHeaderRows
        v-if="rowAttrs.length !== 0"
        :row-attrs="rowAttrs"
        :row-total="rowTotal"
        :col-attrs-length="colAttrs.length"
        :locale-strings="localeStrings"
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
