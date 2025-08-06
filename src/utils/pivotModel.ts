import { PivotModelInterface } from '@/types'
import { arraysEqual, isEqual } from './performance'

/**
 * PivotModel 관련 유틸리티 함수들
 */

/**
 * 두 PivotModel이 동일한지 비교
 */
export function pivotModelsEqual(
  oldModel: PivotModelInterface | null,
  newModel: PivotModelInterface | null
): boolean {
  if (oldModel === newModel) return true
  if (!oldModel || !newModel) return false

  const keys: (keyof PivotModelInterface)[] = [
    'rows',
    'cols',
    'vals',
    'aggregatorName',
    'rendererName',
    'valueFilter',
    'rowOrder',
    'colOrder',
    'heatmapMode'
  ]

  for (const key of keys) {
    if (key === 'valueFilter') {
      if (!isEqual(oldModel[key], newModel[key])) return false
    } else if (Array.isArray(oldModel[key])) {
      if (!arraysEqual(oldModel[key] as string[], newModel[key] as string[])) {
        return false
      }
    } else {
      if (oldModel[key] !== newModel[key]) return false
    }
  }

  return true
}

/**
 * PivotModel 생성 헬퍼
 */
export function createPivotModel(
  partial: Partial<PivotModelInterface> = {}
): PivotModelInterface {
  return {
    rows: [],
    cols: [],
    vals: [],
    aggregatorName: 'Count',
    rendererName: 'Table',
    valueFilter: {},
    rowOrder: 'key_a_to_z',
    colOrder: 'key_a_to_z',
    heatmapMode: '',
    ...partial,
    timestamp: Date.now()
  }
}

/**
 * PivotModel을 복제
 */
export function clonePivotModel(model: PivotModelInterface): PivotModelInterface {
  return {
    ...model,
    rows: [...model.rows],
    cols: [...model.cols],
    vals: [...model.vals],
    valueFilter: { ...model.valueFilter },
    timestamp: Date.now()
  }
}