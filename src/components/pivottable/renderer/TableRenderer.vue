<template>
  <table class='pvtTable'>
    <VPivottableHeader
      :rowTotal="props.showRowTotal"
      :localeStrings="props.localeStrings"
    />
    <VPivottableBody
      :rowTotal="props.showRowTotal"
      :tableOptions="props.tableOptions"
    />
  </table>
</template>

<script setup>
import { defaultProps } from '@/helper'
import { providePivotData } from '@/composables/useProvidePivotData'
import VPivottableHeader from '../VPivottableHeader.vue'
import VPivottableBody from '../VPivottableBody.vue'

const props = defineProps({
  ...defaultProps,
  localeStrings: {
    type: Object,
    default: () => ({
      totals: 'Totals'
    })
  },
  tableOptions: {
    type: Object,
    default: () => ({
      clickCallback: null
    })
  }
})
providePivotData(props)

</script>

<style lang="scss" scoped>

</style>
