import { shallowRef, ref, watchEffect, onUnmounted } from 'vue'
import { PivotData } from '@/helper'

export interface ProvidePivotDataProps { [key: string]: any }

export function usePivotData (props: ProvidePivotDataProps) {
  const error = ref<string | null>(null)
  // Use shallowRef to prevent creating new PivotData instances on every access
  const pivotData = shallowRef<PivotData | null>(null)
  
  // Update pivotData when props change
  const stopWatcher = watchEffect(() => {
    try {
      // Clean up old PivotData before creating new one
      const oldPivotData = pivotData.value
      if (oldPivotData) {
        oldPivotData.tree = {}
        oldPivotData.rowKeys = []
        oldPivotData.colKeys = []
        oldPivotData.rowTotals = {}
        oldPivotData.colTotals = {}
        oldPivotData.filteredData = []
      }
      
      pivotData.value = new PivotData(props)
      error.value = null
    } catch (err) {
      console.error(err.stack)
      error.value = 'An error occurred computing the PivotTable results.'
      pivotData.value = null
    }
  })
  
  // Clean up on scope disposal
  onUnmounted?.(() => {
    stopWatcher()
    if (pivotData.value) {
      pivotData.value.tree = {}
      pivotData.value.rowKeys = []
      pivotData.value.colKeys = []
      pivotData.value.rowTotals = {}
      pivotData.value.colTotals = {}
      pivotData.value.filteredData = []
      pivotData.value = null
    }
  })
  
  return { pivotData, error }
}
