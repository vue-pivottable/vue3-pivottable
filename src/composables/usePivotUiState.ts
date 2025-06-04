import { reactive } from 'vue'

type PivotUiState = {
  unusedOrder: string[]
  zIndices: Record<string, number>
  maxZIndex: number
  openStatus: Record<string, boolean>
}

export function usePivotUiState() {
  const pivotUiState = reactive<PivotUiState>({
    unusedOrder: [],
    zIndices: {},
    maxZIndex: 1000,
    openStatus: {}
  })

  const onMoveFilterBoxToTop = (attributeName: string) => {
    pivotUiState.maxZIndex++
    pivotUiState.zIndices[attributeName] = pivotUiState.maxZIndex
  }

  const onUpdateOpenStatus = ({
    key,
    value
  }: {
    key: string
    value: boolean
  }) => {
    pivotUiState.openStatus[key] = value
  }

  const onUpdateUnusedOrder = (newOrder: string[]) => {
    pivotUiState.unusedOrder = newOrder
  }

  return {
    state: pivotUiState,
    onMoveFilterBoxToTop,
    onUpdateOpenStatus,
    onUpdateUnusedOrder
  }
}
