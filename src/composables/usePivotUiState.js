import { reactive } from 'vue'

export function usePivotUiState () {
  const pivotUiState = reactive({
    unusedOrder: [],
    zIndices: {},
    maxZIndex: 1000,
    openStatus: {}
  })

  const onMoveFilterBoxToTop = (attributeName) => {
    pivotUiState.maxZIndex++
    pivotUiState.zIndices[attributeName] = pivotUiState.maxZIndex
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
