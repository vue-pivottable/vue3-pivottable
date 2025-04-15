import { ref, provide, inject, computed } from 'vue'
import { PivotData } from '@/helper'

const PIVOT_DATA_KEY = Symbol('pivotData')

export function providePivotData (props) {
  const error = ref(null)

  const pivotData = computed(() => {
    try {
      return new PivotData(props)
    } catch (err) {
      console.error(err.stack)
      error.value = 'An error occurred computing the PivotTable results.'
      return null
    }
  })

  const rowKeys = computed(() => pivotData.value?.getRowKeys() || [])
  const colKeys = computed(() => pivotData.value?.getColKeys() || [])
  const colAttrs = computed(() => pivotData.value?.props.cols || [])
  const rowAttrs = computed(() => pivotData.value?.props.rows || [])
  const colorScaleGenerator = props.tableColorScaleGenerator
  const getAggregator = (rowKey, colKey) => pivotData.value?.getAggregator(rowKey, colKey) || {
    value: () => null,
    format: () => ''
  }

  const grandTotalAggregator = computed(() => {
    return pivotData.value
      ? getAggregator([], [])
      : {
          value: () => null,
          format: () => ''
        }
  })

  const allValues = computed(() => {
    const values = []
    rowKeys.value.forEach(r =>
      colKeys.value.forEach(c =>
        values.push(getAggregator(r, c).value())
      )
    )
    return values
  })

  // Colors for heatmap
  const valueCellColors = (rowKey, colKey, value) => {
    if (props.heatmapMode === 'full') {
      const colorScale = colorScaleGenerator(allValues.value)
      return colorScale(value)
    } else if (props.heatmapMode === 'row') {
      const rowColorScales = rowKeys.value.reduce((scales, r) => {
        scales[r] = colorScaleGenerator(colKeys.value.map(x =>
          getAggregator(r, x).value()
        ))
        return scales
      }, {})
      return rowColorScales[rowKey](value)
    } else if (props.heatmapMode === 'col') {
      const colColorScales = colKeys.value.reduce((scales, c) => {
        scales[c] = colorScaleGenerator(rowKeys.value.map(x =>
          getAggregator(x, c).value()
        ))
        return scales
      }, {})
      return colColorScales[colKey](value)
    }
    return {}
  }
  const rowTotalColors = (value) => {
    if (!props.heatmapMode) return {}
    const rowTotalValues = colKeys.value.map(x =>
      getAggregator([], x).value()
    )
    return colorScaleGenerator(rowTotalValues)(value)
  }

  const colTotalColors = (value) => {
    if (!props.heatmapMode) return {}
    const colTotalValues = rowKeys.value.map(x =>
      getAggregator(x, []).value()
    )
    return colorScaleGenerator(colTotalValues)(value)
  }

  const spanSize = (arr, i, j) => {
    let x
    if (i !== 0) {
      let noDraw = true
      for (x = 0; x <= j; x++) {
        if (arr[i - 1][x] !== arr[i][x]) {
          noDraw = false
        }
      }
      if (noDraw) {
        return -1
      }
    }

    let len = 0
    while (i + len < arr.length) {
      let stop = false
      for (x = 0; x <= j; x++) {
        if (arr[i][x] !== arr[i + len][x]) {
          stop = true
        }
      }
      if (stop) {
        break
      }
      len++
    }
    return len
  }

  const pivotDataContext = {
    pivotData,
    rowKeys,
    colKeys,
    colAttrs,
    rowAttrs,
    getAggregator,
    grandTotalAggregator,
    spanSize,
    valueCellColors,
    rowTotalColors,
    colTotalColors,
    error
  }

  provide(PIVOT_DATA_KEY, pivotDataContext)
  return pivotDataContext
}

export function useProvidePivotData () {
  return inject(PIVOT_DATA_KEY)
}
