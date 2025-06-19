import { DefaultPropsType } from '@/types'
import { computed, reactive, ComputedRef, UnwrapRef } from 'vue'
import { locales, LocaleStrings } from '@/helper'
export type UsePropsStateProps = Pick<DefaultPropsType,
  'aggregators' | 'languagePack' | 'locale' | 'valueFilter' | 'rendererName' | 'heatmapMode' | 'aggregatorName' | 'rowOrder' | 'colOrder' | 'vals'>

export interface UsePropsStateReturn<T extends UsePropsStateProps> {
  state: UnwrapRef<T>
  localeStrings: ComputedRef<Record<string, string> | LocaleStrings>
  updateState: (key: keyof T, value: any) => void
  updateMultiple: (updates: Partial<T> & { allFilters?: any, materializedInput?: any }) => void
  onUpdateValueFilter: (payload: { key: string; value: any }) => void
  onUpdateRendererName: (rendererName: string) => void
  onUpdateAggregatorName: (aggregatorName: string) => void
  onUpdateRowOrder: (rowOrder: string) => void
  onUpdateColOrder: (colOrder: string) => void
  onUpdateVals: (vals: any[]) => void
  onDraggedAttribute: (payload: { key: keyof T; value: any }) => void
}

export function usePropsState<T extends UsePropsStateProps> (
  initialProps: T
): UsePropsStateReturn<T> {
  const state = reactive({
    ...initialProps
  }) as UnwrapRef<T>

  const localeStrings = computed(
    () => initialProps?.languagePack?.[initialProps?.locale || 'en'].localeStrings ?? locales.en.localeStrings
  )

  const updateState = (key: keyof T, value: any) => {
    if (key in state) {
      (state as any)[key] = value
    }
  }

  const updateMultiple = (updates: Partial<T>) => {
    Object.entries(updates).forEach(([key, value]) => {
      if (key in state) {
        (state as any)[key] = value
      }
    })
  }

  const onUpdateValueFilter = ({ key, value }: { key: string; value: any }) => {
    updateState('valueFilter' as keyof T, {
      ...(state.valueFilter || {}),
      [key]: value
    })
  }

  const onUpdateRendererName = (rendererName: string) => {
    updateState('rendererName' as keyof T, rendererName)
    if (rendererName === 'Table Heatmap') {
      updateState('heatmapMode' as keyof T, 'full')
    } else if (rendererName === 'Table Row Heatmap') {
      updateState('heatmapMode' as keyof T, 'row')
    } else if (rendererName === 'Table Col Heatmap') {
      updateState('heatmapMode' as keyof T, 'col')
    } else {
      updateState('heatmapMode' as keyof T, '')
    }
  }

  const onUpdateAggregatorName = (aggregatorName: string) => {
    updateState('aggregatorName' as keyof T, aggregatorName)
  }
  const onUpdateRowOrder = (rowOrder: string) => {
    updateState('rowOrder' as keyof T, rowOrder)
  }
  const onUpdateColOrder = (colOrder: string) => {
    updateState('colOrder' as keyof T, colOrder)
  }
  const onUpdateVals = (vals: any[]) => {
    updateState('vals' as keyof T, vals)
  }
  const onDraggedAttribute = ({ key, value }: { key: keyof T; value: any }) => {
    updateState(key, value)
  }

  return {
    state,
    localeStrings,
    updateState,
    updateMultiple,
    onUpdateValueFilter,
    onUpdateRendererName,
    onUpdateAggregatorName,
    onUpdateRowOrder,
    onUpdateColOrder,
    onUpdateVals,
    onDraggedAttribute
  }
} 