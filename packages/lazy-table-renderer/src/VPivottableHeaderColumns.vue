<template>
  <template
    v-for="(colKey, i) in colKeys"
    :key="`colKey${i}`"
  >
    <th
      v-if="spanSize(colKeys, i, colIndex) !== -1"
      class="pvtColLabel"
      :colSpan="spanSize(colKeys, i, colIndex)"
      :rowSpan="colIndex === colAttrsLength - 1 && rowAttrsLength !== 0 ? 2 : 1"
    >
      {{ colKey[colIndex] }}
    </th>
  </template>
</template>

<script setup>
import { useProvidePivotData } from 'vue-pivottable'

defineProps({
  colKeys: {
    type: Array,
    required: true
  },
  colIndex: {
    type: Number,
    required: true
  },
  colAttrsLength: {
    type: Number,
    required: true
  },
  rowAttrsLength: {
    type: Number,
    required: true
  }
})

const { spanSize } = useProvidePivotData()
</script>
