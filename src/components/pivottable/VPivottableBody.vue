<template>
  <tbody>
    <VPivottableBodyRows
      v-for="(rowKey, i) in rowKeys"
      :key="`rowKeyRow${i}`"
      :pivotData="pivotData"
      :index="i"
      :rowKeys="rowKeys"
      :rowKey="rowKey"
      :colKeys="colKeys"
      :rowAttrs="rowAttrs"
      :colAttrs="colAttrs"
      :tableOptions="tableOptions"
      :rowTotal="rowTotal"
    />
  </tbody>
</template>

<script setup>
import VPivottableBodyRows from './VPivottableBodyRows.vue'
import { usePivotData } from '@/composables/usePivotData'

const { pivotData, rowKeys, colKeys, rowAttrs, colAttrs } = usePivotData()
const { rowTotal, tableOptions } = defineProps(['rowTotal', 'tableOptions'])
</script>

<style lang="scss" scoped>

</style>
