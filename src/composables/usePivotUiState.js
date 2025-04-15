import { reactive } from 'vue'

export function usePivotUiState () {
  const pivotUiState = reactive({
    unusedOrder: [],
    zIndices: {},
    maxZIndex: 1000,
    openStatus: {}
  })

  const onMoveFilterBoxToTop = ({ key }) => {
    pivotUiState.maxZIndex++
    pivotUiState.zIndices[key] = pivotUiState.maxZIndex
  }

  const onUpdateOpenStatus = ({ key, value }) => {
    pivotUiState.openStatus[key] = value
  }

  const onUpdateUnusedOrder = (newOrder) => {
    pivotUiState.unusedOrder = newOrder
  }

  return {
    state: pivotUiState,
    onMoveFilterBoxToTop,
    onUpdateOpenStatus,
    onUpdateUnusedOrder
  }
}
