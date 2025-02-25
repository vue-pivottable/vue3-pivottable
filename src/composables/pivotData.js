import { inject, provide } from 'vue'
import { PivotData } from '../helper'

const pivotDataKey = Symbol('pivotData')

export function providePivotData (props) {
  const pivotData = new PivotData(props)
  const colAttrs = pivotData.props.cols
  const rowAttrs = pivotData.props.rows
  const rowKeys = pivotData.getRowKeys()
  const colKeys = pivotData.getColKeys()
  const grandTotalAggregator = pivotData.getAggregator([], [])
  const getAggregator = pivotData.getAggregator
  provide(pivotDataKey, {
    colAttrs,
    rowAttrs,
    rowKeys,
    colKeys,
    grandTotalAggregator,
    getAggregator,
    pivotData
  })
}

export function usePivotData () {
  return inject(pivotDataKey)
}
