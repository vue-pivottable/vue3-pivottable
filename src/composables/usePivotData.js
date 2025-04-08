import { inject, provide, ref, computed } from 'vue'
import { PivotData } from '@/helper/utilities.js'

const pivotDataKey = Symbol('pivotData')

export function providePivotData (props) {
  const pivotData = ref(null)
  const error = ref(null)
  try {
    pivotData.value = new PivotData(props)
  } catch (error) {
    if (console && console.error(error.stack)) {
      error.value = 'An error occurred computing the PivotTable results.'
    }
  }

  const rowKeys = computed(() => pivotData.value?.getRowKeys() || [])
  const colKeys = computed(() => pivotData.value?.getColKeys() || [])
  const colAttrs = computed(() => pivotData.value?.props.cols || [])
  const rowAttrs = computed(() => pivotData.value?.props.rows || [])

  const getAggregator = (rowKey, colKey) => pivotData.value?.getAggregator(rowKey, colKey)
  const grandTotalAggregator = () => pivotData.value.getAggregator([], [])
  provide(pivotDataKey, {
    pivotData,
    rowKeys,
    colKeys,
    colAttrs,
    rowAttrs,
    getAggregator,
    grandTotalAggregator,
    error
  })
}

export function usePivotData () {
  return inject(pivotDataKey)
}
