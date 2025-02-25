<template>
  <tr>
    <th v-if="index === 0 && rowAttrs.length !== 0"
      :colspan="rowAttrs.length"
      :rowspan="colAttrs.length"
    >
    </th>
    <th
      class="pvtAxisLabel"
    >
      {{ col }}
    </th>
    <th v-for="(colKey, j) in colKeys"
      :key="`colKey${j}`"
      class="pvtColLabel"
      :colspan="spanSize(colKeys, j, index)"
      :rowspan="index === colAttrs.length - 1 && rowAttrs.length !== 0 ? 2 : 1"
    >
      {{ colKey[index] }}
    </th>
    <th v-if="index === 0 && rowTotal"
      class="pvtTotalLabel"
      :rowspan="colAttrs.length + (rowAttrs.length === 0 ? 0 : 1)"
    >
      {{ localeStrings.totals }}
    </th>
  </tr>
</template>

<script setup>
import { spanSize } from '../../helper'

const { index, rowAttrs, colAttrs, colKeys, rowTotal, localeStrings, col } = defineProps({
  index: { type: Number, required: true },
  rowAttrs: { type: Array, required: true },
  colAttrs: { type: Array, required: true },
  colKeys: { type: Array, required: true },
  rowTotal: { type: Boolean, required: true },
  localeStrings: { type: Object, required: true },
  col: { type: String, required: true }
})

</script>

<style lang="scss" scoped>

</style>
