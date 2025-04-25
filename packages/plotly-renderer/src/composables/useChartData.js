import { computed } from 'vue'

export function useChartData(props, rowKeys, colKeys, getAggregator) {
  const traceKeys = computed(() => {
    const keys = props.transpose ? colKeys.value : rowKeys.value
    return keys.length > 0 ? keys : [[]]
  })
  const datumKeys = computed(() => {
    const keys = props.transpose ? rowKeys.value : colKeys.value
    return keys.length > 0 ? keys : [[]]
  })

  const fullAggName = computed(() => {
    const baseName = props.aggregatorName
    const numInputs = props.aggregators[baseName]([])().numInputs || 0
    if (numInputs !== 0) {
      const valsSlice = props.vals.slice(0, numInputs).join(', ')
      return `${baseName} of ${valsSlice}`
    }

    return baseName
  })

  const chartData = computed(() =>
    traceKeys.value.map((traceKey) => {
      const values = []
      const labels = []
      for (const datumKey of datumKeys.value) {
        const val = parseFloat(
          getAggregator(
            props.transpose ? datumKey : traceKey,
            props.transpose ? traceKey : datumKey
          ).value()
        )
        values.push(isFinite(val) ? val : null)
        labels.push(datumKey.join('-') || ' ')
      }

      const trace = {
        name: traceKey.join('-') || fullAggName.value,
        ...props.traceOptions
      }

      if (props.traceOptions.type === 'pie') {
        trace.values = values
        trace.labels = labels.length > 1 ? labels : [fullAggName.value]
      } else {
        trace.x = props.transpose ? values : labels
        trace.y = props.transpose ? labels : values
      }

      return trace
    })
  )

  const titleText = computed(() => {
    let title = fullAggName.value

    const hAxisTitle = props.transpose.value
      ? props.rows.join('-')
      : props.cols.join('-')

    const groupByTitle = props.transpose.value
      ? props.cols.join('-')
      : props.rows.join('-')

    if (hAxisTitle !== '') title += ` vs ${hAxisTitle}`
    if (groupByTitle !== '') title += ` by ${groupByTitle}`

    return title
  })

  const layout = computed(() => {
    const baseLayout = {
      title: titleText.value,
      hovermode: 'closest',
      width: window.innerWidth / 1.5,
      height: window.innerHeight / 1.4 - 50
    }

    if (props.traceOptions.type === 'pie') {
      const columns = Math.ceil(Math.sqrt(chartData.value.length))
      const rows = Math.ceil(chartData.value.length / columns)
      baseLayout.grid = { columns, rows }

      chartData.value.forEach((d, i) => {
        d.domain = {
          row: Math.floor(i / columns),
          column: i - columns * Math.floor(i / columns)
        }
        if (chartData.value.length > 1) d.title = d.name
      })

      if (chartData.value[0].labels?.length === 1) {
        baseLayout.showlegend = false
      }
    } else {
      baseLayout.xaxis = {
        title: props.transpose ? fullAggName.value : null,
        automargin: true
      }
      baseLayout.yaxis = {
        title: props.transpose ? null : fullAggName.value,
        automargin: true
      }
    }

    return {
      ...baseLayout,
      ...props.layoutOptions,
      ...props.plotlyOptions
    }
  })

  return {
    chartData,
    layout
  }
}
