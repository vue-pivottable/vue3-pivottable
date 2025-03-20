<template>
  <table class='pvtTable'>
    <VPivottableHeader
      :rowTotal="props.rowTotal"
      :localeStrings="props.localeStrings"
    />
    <VPivottableBody
      :rowTotal="props.rowTotal"
      :tableOptions="props.tableOptions"
    />
  </table>
</template>

<script setup>
import { defaultProps } from '@/helper'
import { providePivotData } from '@/composables/usePivotData'
import VPivottableHeader from '../VPivottableHeader.vue'
import VPivottableBody from '../VPivottableBody.vue'

const props = defineProps({
  ...defaultProps,
  localeStrings: {
    type: Object,
    default: function () {
      return {
        totals: 'Totals'
      }
    }
  },
  tableOptions: {
    type: Object,
    default: function () {
      return {
        clickCallback: null
      }
    }
  }
})
providePivotData(props)

</script>

<style lang="scss" scoped>

</style>
