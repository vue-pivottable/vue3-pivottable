import { defineComponent, h, markRaw } from 'vue'
import { providePivotData, PivotUtilities } from 'vue-pivottable'
import PlotlyChart from './components/PlotlyChart.vue'
import PlotlyScatterChart from './components/PlotlyScatterChart.vue'

function withPivotProvider (
  ChartComponent: any,
  ChartType: any,
  traceOptions = {},
  layoutOptions = {},
  transpose = false
) {
  return defineComponent({
    name: ChartType.name || 'vue-plotly-renderer',
    props: { ...PivotUtilities.defaultProps },
    setup (props) {
      providePivotData(props)
      const { aggregatorName, aggregators, rows, cols, vals } = props
      return () =>
        h(ChartComponent, {
          aggregatorName,
          aggregators,
          rows,
          cols,
          vals,
          traceOptions,
          layoutOptions,
          transpose
        })
    }
  })
}

export default markRaw({
  'Area Chart': withPivotProvider(
    PlotlyChart,
    { name: 'vue-area-chart' },
    { stackgroup: 1 }
  ),
  'Dot Chart': withPivotProvider(
    PlotlyChart,
    { name: 'vue-dot-chart' },
    { mode: 'markers' },
    {},
    true
  ),
  'Grouped Bar Chart': withPivotProvider(
    PlotlyChart,
    { name: 'vue-grouped-bar-chart' },
    {
      type: 'bar',
      orientation: 'h'
    },
    { barmode: 'group' },
    true
  ),
  'Grouped Column Chart': withPivotProvider(
    PlotlyChart,
    { name: 'vue-grouped-column-chart' },
    {
      type: 'bar'
    },
    { barmode: 'group' }
  ),
  'Line Chart': withPivotProvider(PlotlyChart, { name: 'vue-line-chart' }),
  'MultiplePieChart': withPivotProvider(
    PlotlyChart,
    { name: 'vue-multiple-pie-chart' },
    { type: 'pie', scalegroup: 1, hoverinfo: 'label+value', textinfo: 'none' },
    {},
    true
  ),
  'Scatter Chart': withPivotProvider(PlotlyScatterChart, {
    name: 'vue-scatter-chart'
  }),
  'Stacked Bar Chart': withPivotProvider(
    PlotlyChart,
    { name: 'vue-stacked-bar-chart' },
    { type: 'bar', orientation: 'h' },
    { barmode: 'relative' },
    true
  ),
  'Stacked Column Chart': withPivotProvider(
    PlotlyChart,
    { name: 'vue-stacked-column-chart' },
    { type: 'bar' },
    { barmode: 'relative' }
  )
})
