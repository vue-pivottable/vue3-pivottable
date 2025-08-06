import { DefaultPropsType, PivotModelInterface } from '@/types'
import { computed, reactive, ComputedRef, UnwrapRef, onUnmounted } from 'vue'
import { debounce } from '@/utils/performance'
import { pivotModelsEqual, clonePivotModel } from '@/utils/pivotModel'
import { locales, LocaleStrings } from '@/helper'
export type UsePropsStateProps = Pick<DefaultPropsType,
  'aggregators' | 'languagePack' | 'locale' | 'valueFilter' | 'rendererName' | 'heatmapMode' | 'aggregatorName' | 'rowOrder' | 'colOrder' | 'vals' | 'rows' | 'cols'>

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
  cleanup?: () => void
}

export function usePropsState<T extends UsePropsStateProps> (
  initialProps: T,
  emit?: (event: string, payload: any) => void
): UsePropsStateReturn<T> {
  const state = reactive({
    ...initialProps
  }) as UnwrapRef<T>
  
  let previousModel: PivotModelInterface | null = null

  const localeStrings = computed(
    () => initialProps?.languagePack?.[initialProps?.locale || 'en'].localeStrings ?? locales.en.localeStrings
  )
  
  const buildPivotModel = (): PivotModelInterface => {
    const model = {
      rows: state.rows || [],
      cols: state.cols || [],
      vals: state.vals || [],
      aggregatorName: state.aggregatorName || 'Count',
      rendererName: state.rendererName || 'Table',
      valueFilter: state.valueFilter || {},
      rowOrder: state.rowOrder || 'key_a_to_z',
      colOrder: state.colOrder || 'key_a_to_z',
      heatmapMode: state.heatmapMode || ''
    }
    console.log('buildPivotModel - valueFilter:', model.valueFilter)
    return model
  }
  
  const emitPivotModel = () => {
    if (!emit) return
    
    const currentModel = buildPivotModel()
    
    if (previousModel && pivotModelsEqual(previousModel, currentModel)) {
      return
    }
    
    previousModel = clonePivotModel(currentModel)
    emit('update:pivotModel', currentModel)
    emit('change', currentModel)
  }
  
  const emitPivotModelDebounced = debounce(emitPivotModel, 100)

  const updateState = (key: keyof T, value: any) => {
    if (key in state) {
      (state as any)[key] = value
    }
    emitPivotModelDebounced()
  }

  const updateMultiple = (updates: Partial<T>) => {
    Object.entries(updates).forEach(([key, value]) => {
      if (key in state) {
        (state as any)[key] = value
      }
    })
    emitPivotModel()
  }

  const onUpdateValueFilter = ({ key, value }: { key: string; value: any }) => {
    console.log('usePropsState onUpdateValueFilter:', key, value)
    const newFilter = {
      ...(state.valueFilter || {}),
      [key]: value
    }
    console.log('New valueFilter state:', newFilter)
    updateState('valueFilter' as keyof T, newFilter)
  }

  const onUpdateRendererName = (rendererName: string) => {
    const updates: any = {
      rendererName
    }
    
    if (rendererName === 'Table Heatmap') {
      updates.heatmapMode = 'full'
    } else if (rendererName === 'Table Row Heatmap') {
      updates.heatmapMode = 'row'
    } else if (rendererName === 'Table Col Heatmap') {
      updates.heatmapMode = 'col'
    } else {
      updates.heatmapMode = ''
    }
    
    updateMultiple(updates)
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

  const cleanup = () => {
    emitPivotModelDebounced.cancel()
    previousModel = null
  }
  
  onUnmounted(() => {
    cleanup()
  })
  
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
    onDraggedAttribute,
    cleanup
  }
} 