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

<script setup lang="ts">
import { useProvidePivotData } from '@/composables'

type VPivottableHeaderColumnsProps = {
  colKeys: string[][]
  colIndex: number
  colAttrsLength: number
  rowAttrsLength: number
}
defineProps<VPivottableHeaderColumnsProps>()

const { spanSize } = useProvidePivotData()
</script>
