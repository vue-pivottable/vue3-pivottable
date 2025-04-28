<template>
  <VuePlotly
    :data="chartData"
    :layout="layout"
  />
</template>

<script setup>
import { VuePlotly } from '@clalarco/vue3-plotly'
import { useProvidePivotData } from 'vue-pivottable'
import { useScatterChartData } from '../composables/useScatterChartData'

const props = defineProps({
  traceOptions: {
    type: Object,
    required: true
  },
  layoutOptions: {
    type: Object,
    required: true
  },
  transpose: {
    type: Boolean,
    required: true
  },
  aggregatorName: {
    type: String,
    required: true
  },
  aggregators: {
    type: Object,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  cols: {
    type: Array,
    required: true
  },
  vals: {
    type: Array,
    required: true
  }
})

const { rowKeys, colKeys, getAggregator } = useProvidePivotData()

const { chartData, layout } = useScatterChartData(
  props,
  rowKeys,
  colKeys,
  getAggregator
)
</script>
