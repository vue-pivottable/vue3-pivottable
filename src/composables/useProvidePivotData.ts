import { Ref, provide, inject, computed, ComputedRef } from 'vue'
import type { PivotData } from '@/helper/utilities'
import { usePivotData } from './usePivotData'

const PIVOT_DATA_KEY = Symbol('pivotData')

export interface ProvidePivotDataProps { [key: string]: any }

export interface PivotDataContext {
  pivotData: ComputedRef<PivotData | null>
  rowKeys: ComputedRef<any[][]>
  colKeys: ComputedRef<any[][]>
  colAttrs: ComputedRef<string[]>
  rowAttrs: ComputedRef<string[]>
  getAggregator: (rowKey: any[], colKey: any[]) => any
  grandTotalAggregator: ComputedRef<any>
  spanSize: (arr: any[][], i: number, j: number) => number
  valueCellColors: (rowKey: any[], colKey: any[], value: any) => any
  rowTotalColors: (value: any) => any
  colTotalColors: (value: any) => any
  error: Ref<string | null>
}

export function providePivotData (props: ProvidePivotDataProps): PivotDataContext {
  const { pivotData, error } = usePivotData(props)
  const rowKeys = computed<any[][]>(() => pivotData.value?.getRowKeys() || [])
  const colKeys = computed<any[][]>(() => pivotData.value?.getColKeys() || [])
  const colAttrs = computed<string[]>(() => pivotData.value?.props.cols || [])
  const rowAttrs = computed<string[]>(() => pivotData.value?.props.rows || [])
  const colorScaleGenerator = props.tableColorScaleGenerator
  const getAggregator = (rowKey: any[], colKey: any[]) =>
    pivotData.value?.getAggregator(rowKey, colKey) || {
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

  const allColorScales = computed(() => {
    const values = rowKeys.value.reduce((acc: any[], r: any[]) => acc.concat(colKeys.value.map((c: any[]) => getAggregator(r, c).value())), [])
    return colorScaleGenerator(values)
  })
  const rowColorScales = computed(() =>
    rowKeys.value.reduce((scales: Record<string, any>, r: any[]) => {
      const key = JSON.stringify(r)
      scales[key] = colorScaleGenerator(
        colKeys.value.map((x: any[]) => getAggregator(r, x).value())
      )
      return scales
    }, {} as Record<string, any>)
  )
  const colColorScales = computed(() =>
    colKeys.value.reduce((scales: Record<string, any>, c: any[]) => {
      const key = JSON.stringify(c)
      scales[key] = colorScaleGenerator(
        rowKeys.value.map((x: any[]) => getAggregator(x, c).value())
      )
      return scales
    }, {} as Record<string, any>)
  )

  const valueCellColors = (rowKey: any[], colKey: any[], value: any) => {
    if (props.heatmapMode === 'full') {
      return allColorScales.value(value)
    } else if (props.heatmapMode === 'row') {
      return rowColorScales.value[JSON.stringify(rowKey)]?.(value)
    } else if (props.heatmapMode === 'col') {
      return colColorScales.value[JSON.stringify(colKey)]?.(value)
    }
    return {}
  }
  const rowTotalValues = computed(() => colKeys.value.map((x: any[]) => getAggregator([], x).value()))
  const rowTotalColors = (value: any) => {
    if (!props.heatmapMode) return {}
    return colorScaleGenerator(rowTotalValues.value)(value)
  }
  const colTotalValues = computed(() => rowKeys.value.map((x: any[]) => getAggregator(x, []).value()))
  const colTotalColors = (value: any) => {
    if (!props.heatmapMode) return {}
    return colorScaleGenerator(colTotalValues.value)(value)
  }

  const spanSize = (arr: any[][], i: number, j: number): number => {
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

  const pivotDataContext: PivotDataContext = {
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

export function useProvidePivotData (): PivotDataContext {
  const context = inject<PivotDataContext>(PIVOT_DATA_KEY)
  if (!context) {
    throw new Error('useProvidePivotData must be used within a provider')
  }
  return context
}