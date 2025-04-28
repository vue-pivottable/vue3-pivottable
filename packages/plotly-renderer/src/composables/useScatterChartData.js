import { computed } from 'vue'

export function useScatterChartData(props, rowKeys, colKeys, getAggregator) {
  const scatterRowKeys = computed(() => {
    return rowKeys.value.length > 0 ? rowKeys.value : [[]]
  })

  const scatterColKeys = computed(() => {
    return colKeys.value.length > 0 ? colKeys.value : [[]]
  })

  const chartData = computed(() => {
    const data = {
      x: [],
      y: [],
      text: [],
      type: 'scatter',
      mode: 'markers'
    }

    scatterRowKeys.value.forEach((rowKey) => {
      scatterColKeys.value.forEach((colKey) => {
        const value = getAggregator(rowKey, colKey).value()
        if (value != null) {
          data.x.push(colKey.join('-'))
          data.y.push(rowKey.join('-'))
          data.text.push(value)
        }
      })
    })

    return [data]
  })

  const layout = computed(() => ({
    title: `${props.rows.join('-')} vs ${props.cols.join('-')}`,
    hovermode: 'closest',
    xaxis: {
      title: props.cols.join('-'),
      automargin: true
    },
    yaxis: {
      title: props.rows.join('-'),
      automargin: true
    },
    width: window.innerWidth / 1.5,
    height: window.innerHeight / 1.4 - 50
  }))

  return {
    chartData,
    layout
  }
}
