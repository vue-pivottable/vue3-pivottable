import { ref, watch } from 'vue'

export function usePropsState (initialProps) {
  const state = ref({ ...initialProps })

  watch(() => initialProps, (newProps) => {
    // console.log('props 변경 감지:', newProps)
    state.value = { ...newProps }
  }, {
    deep: true,
    immediate: true
  })

  const logStateChange = (key, oldVal, newVal) => {
    // console.log(`상태 변경: ${key}`, { 이전: oldVal, 새값: newVal })
  }

  const updateState = (key, value) => {
    if (key in state.value) {
      const oldVal = state.value[key]

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          state.value[key] = [...value]
        } else {
          state.value[key] = { ...value }
        }
      } else {
        state.value[key] = value
      }

      logStateChange(key, oldVal, state.value[key])
      state.value = { ...state.value }
    }
  }

  const updateMultiple = (updates) => {
    const oldState = { ...state.value }
    let changed = false

    Object.entries(updates).forEach(([key, value]) => {
      if (key in state.value) {
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            state.value[key] = [...value]
          } else {
            state.value[key] = { ...value }
          }
        } else {
          state.value[key] = value
        }
        changed = true
      }
    })

    if (changed) {
      // console.log('여러 상태 동시 업데이트:', { 이전: oldState, 새값: state.value })
      state.value = { ...state.value }
    }
  }

  const resetState = () => {
    // console.log('상태 초기화')
    state.value = { ...initialProps }
  }

  return {
    state,
    updateState,
    updateMultiple,
    resetState
  }
}
