import { computed, ref } from 'vue'
import { PivotData } from '@/helper'
import type { ProvidePivotDataProps } from './useProvidePivotData'

export function usePivotData (props: ProvidePivotDataProps) {
  const error = ref<string | null>(null)
  const pivotData = computed<PivotData | null>(() => {
    try {
      return new PivotData(props)
    } catch (err) {
      console.error(err.stack)
      error.value = 'An error occurred computing the PivotTable results.'
      return null
    }
  })
  return { pivotData, error }
}
