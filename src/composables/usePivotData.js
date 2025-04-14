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

  const getAggregator = (rowKey, colKey) => pivotData.value?.getAggregator(rowKey, colKey) || {
    value: () => null,
    format: () => ''
  }

  const grandTotalAggregator = computed(() => {
    return pivotData.value
      ? pivotData.value.getAggregator([], [])
      : {
          value: () => null,
          format: () => ''
        }
  })

  const allValues = computed(() => {

  })

  // Colors for heatmap
  const valueCellColors = (rowKey, colKey, value) => {
    if (props.heatmapMode === 'full') {

    } else if (props.heatmapMode === 'row') {

    } else if (props.heatmapMode === 'col') {

    }
    return {}
  }

  const rowTotalColors = (value) => {
    if (!props.heatmapMode) return {}
    // Implementation for row total coloring
    return {}
  }

  const colTotalColors = (value) => {
    if (!props.heatmapMode) return {}
    // Implementation for column total coloring
    return {}
  }

  /**
 *
      let valueCellColors = () => { }
      // eslint-disable-next-line no-unused-vars
      let rowTotalColors = () => { }
      // eslint-disable-next-line no-unused-vars
      let colTotalColors = () => { }
      if (opts.heatmapMode) {
        const colorScaleGenerator = this.tableColorScaleGenerator
        const rowTotalValues = colKeys.map(x =>
          pivotData.getAggregator([], x).value()
        )
        rowTotalColors = colorScaleGenerator(rowTotalValues)
        const colTotalValues = rowKeys.map(x =>
          pivotData.getAggregator(x, []).value()
        )
        colTotalColors = colorScaleGenerator(colTotalValues)

        if (opts.heatmapMode === 'full') {
          const allValues = []
          rowKeys.map(r =>
            colKeys.map(c =>
              allValues.push(pivotData.getAggregator(r, c).value())
            )
          )
          const colorScale = colorScaleGenerator(allValues)
          valueCellColors = (r, c, v) => colorScale(v)
        } else if (opts.heatmapMode === 'row') {
          const rowColorScales = {}
          rowKeys.map(r => {
            const rowValues = colKeys.map(x =>
              pivotData.getAggregator(r, x).value()
            )
            rowColorScales[r] = colorScaleGenerator(rowValues)
          })
          valueCellColors = (r, c, v) => rowColorScales[r](v)
        } else if (opts.heatmapMode === 'col') {
          const colColorScales = {}
          colKeys.map(c => {
            const colValues = rowKeys.map(x =>
              pivotData.getAggregator(x, c).value()
            )
            colColorScales[c] = colorScaleGenerator(colValues)
          })
          valueCellColors = (r, c, v) => colColorScales[c](v)
        }
      }
 */
  // Helper function for determining spans in the table
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

export function usePivotData () {
  return inject(PIVOT_DATA_KEY)
}

https://github.com/vue-pivottable/vue3-pivottable/pull/12#discussion_r2041281526