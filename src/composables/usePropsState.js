import { reactive } from 'vue'

export function usePropsState(initialProps) {
  const state = reactive({
    ...initialProps
  })

  const updateState = (key, value) => {
    if (key in state) {
      state[key] = value
    }
  }

  const updateMultiple = (updates) => {
    Object.entries(updates).forEach(([key, value]) => {
      if (key in state) {
        state[key] = value
      }
    })
  }
  const onUpdateValueFilter = ({ key, value }) => {
    updateState('valueFilter', {
      ...state.valueFilter,
      [key]: value
    })
  }

  const onUpdateRendererName = (rendererName) => {
    updateState('rendererName', rendererName)
    if (rendererName === 'Table Heatmap') {
      updateState('heatmapMode', 'full')
    } else if (rendererName === 'Table Row Heatmap') {
      updateState('heatmapMode', 'row')
    } else if (rendererName === 'Table Col Heatmap') {
      updateState('heatmapMode', 'col')
    } else {
      updateState('heatmapMode', '')
    }
  }

  const onUpdateAggregatorName = (aggregatorName) => {
    updateState('aggregatorName', aggregatorName)
  }
  const onUpdateRowOrder = (rowOrder) => {
    updateState('rowOrder', rowOrder)
  }
  const onUpdateColOrder = (colOrder) => {
    updateState('colOrder', colOrder)
  }
  const onUpdateVals = (vals) => {
    updateState('vals', vals)
  }
  const onDraggedAttribute = ({ key, value }) => {
    updateState(key, value)
  }

  return {
    state,
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
