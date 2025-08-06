import { ref, Ref, computed, watch } from 'vue'
import { PivotModelInterface } from '@/types'
import { clonePivotModel } from '@/utils/pivotModel'

export interface PivotModelHistoryOptions {
  maxHistory?: number
  autoSave?: boolean
}

export interface UsePivotModelHistoryReturn {
  history: Ref<PivotModelInterface[]>
  currentIndex: Ref<number>
  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  pushState: (model: PivotModelInterface) => void
  undo: () => PivotModelInterface | null
  redo: () => PivotModelInterface | null
  clear: () => void
  getCurrentState: () => PivotModelInterface | null
}

/**
 * PivotModel의 히스토리를 관리하는 composable
 * @param modelRef PivotModel을 담고 있는 ref
 * @param options 히스토리 관리 옵션
 */
export function usePivotModelHistory(
  modelRef: Ref<PivotModelInterface>,
  options: PivotModelHistoryOptions = {}
): UsePivotModelHistoryReturn {
  const { maxHistory = 50, autoSave = true } = options

  const history = ref<PivotModelInterface[]>([])
  const currentIndex = ref(-1)

  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < history.value.length - 1)

  /**
   * 새로운 상태를 히스토리에 추가
   */
  const pushState = (model: PivotModelInterface) => {
    // 현재 인덱스 이후의 히스토리는 제거 (새로운 브랜치 생성)
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1)
    }

    // 새 상태 추가
    history.value.push(clonePivotModel(model))
    
    // 최대 히스토리 크기 유지
    if (history.value.length > maxHistory) {
      history.value = history.value.slice(-maxHistory)
    }
    
    currentIndex.value = history.value.length - 1
  }

  /**
   * 이전 상태로 되돌리기
   */
  const undo = (): PivotModelInterface | null => {
    if (!canUndo.value) return null

    currentIndex.value--
    const previousState = history.value[currentIndex.value]
    
    if (modelRef.value) {
      Object.assign(modelRef.value, clonePivotModel(previousState))
    }
    
    return previousState
  }

  /**
   * 다음 상태로 다시 실행
   */
  const redo = (): PivotModelInterface | null => {
    if (!canRedo.value) return null

    currentIndex.value++
    const nextState = history.value[currentIndex.value]
    
    if (modelRef.value) {
      Object.assign(modelRef.value, clonePivotModel(nextState))
    }
    
    return nextState
  }

  /**
   * 히스토리 초기화
   */
  const clear = () => {
    history.value = []
    currentIndex.value = -1
  }

  /**
   * 현재 상태 가져오기
   */
  const getCurrentState = (): PivotModelInterface | null => {
    if (currentIndex.value >= 0 && currentIndex.value < history.value.length) {
      return history.value[currentIndex.value]
    }
    return null
  }

  // 자동 저장이 활성화된 경우, 모델 변경 감지
  if (autoSave) {
    watch(
      modelRef,
      (newModel) => {
        if (newModel) {
          // 현재 히스토리와 다른 경우에만 추가
          const current = getCurrentState()
          if (!current || JSON.stringify(current) !== JSON.stringify(newModel)) {
            pushState(newModel)
          }
        }
      },
      { deep: true, immediate: true }
    )
  }

  return {
    history,
    currentIndex,
    canUndo,
    canRedo,
    pushState,
    undo,
    redo,
    clear,
    getCurrentState
  }
}