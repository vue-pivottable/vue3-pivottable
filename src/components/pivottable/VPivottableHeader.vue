<template>
  <thead>
    <VPivottableHeaderRows
      v-for="(col, i) in colAttrs"
      :key="`colAttrs${i}`"
      :index="i"
      :col="col"
      :rowAttrs="rowAttrs"
      :colAttrs="colAttrs"
      :colKeys="colKeys"
      :rowTotal="rowTotal"
      :localeStrings="localeStrings"
    />
  </thead>
</template>

<script setup>
import VPivottableHeaderRows from './VPivottableHeaderRows.vue'
import { usePivotData } from '../../composables/pivotData.js'

const { rowAttrs, colAttrs, colKeys } = usePivotData()
const { localeStrings, rowTotal } = defineProps(['localeStrings', 'rowTotal'])
</script>

<style lang="scss" scoped>

</style>
