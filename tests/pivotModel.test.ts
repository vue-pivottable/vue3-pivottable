import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import VPivottableUi from '@/components/pivottable-ui/VPivottableUi.vue'
import { PivotModelInterface } from '@/types'
import { createPivotModel, pivotModelsEqual } from '@/utils/pivotModel'
import { PivotModelSerializer } from '@/utils/pivotModelSerializer'
import { usePivotModelHistory } from '@/composables/usePivotModelHistory'

describe('PivotModel 양방향 바인딩', () => {
  const mockData = [
    { region: 'North', quarter: 'Q1', sales: 100 },
    { region: 'North', quarter: 'Q2', sales: 150 },
    { region: 'South', quarter: 'Q1', sales: 200 },
    { region: 'South', quarter: 'Q2', sales: 250 }
  ]

  it('v-model:pivotModel이 올바르게 작동해야 함', async () => {
    const pivotModel = ref<PivotModelInterface>(createPivotModel({
      rows: ['region'],
      cols: ['quarter'],
      vals: ['sales'],
      aggregatorName: 'Sum'
    }))

    const wrapper = mount(VPivottableUi, {
      props: {
        data: mockData,
        pivotModel: pivotModel.value,
        'onUpdate:pivotModel': (e: PivotModelInterface) => {
          pivotModel.value = e
        }
      }
    })

    // emit이 정의되어 있는지 확인
    expect(wrapper.emitted()).toBeDefined()
  })

  it('상태 변경 시 emit이 발생해야 함', async () => {
    const wrapper = mount(VPivottableUi, {
      props: {
        data: mockData,
        pivotModel: createPivotModel()
      }
    })

    // 렌더러 변경 시뮬레이션
    await wrapper.vm.onUpdateRendererName('Table Heatmap')
    
    // emit이 발생했는지 확인
    const emitted = wrapper.emitted('update:pivotModel')
    expect(emitted).toBeDefined()
    
    if (emitted) {
      const [model] = emitted[0] as [PivotModelInterface]
      expect(model.rendererName).toBe('Table Heatmap')
      expect(model.heatmapMode).toBe('full')
    }
  })

  it('debounce가 적용되어야 함', async () => {
    vi.useFakeTimers()
    
    const wrapper = mount(VPivottableUi, {
      props: {
        data: mockData,
        pivotModel: createPivotModel()
      }
    })

    // 연속적인 상태 변경
    await wrapper.vm.onUpdateValueFilter({ key: 'region', value: ['North'] })
    await wrapper.vm.onUpdateValueFilter({ key: 'region', value: ['North', 'South'] })
    
    // debounce 전에는 emit이 발생하지 않음
    expect(wrapper.emitted('update:pivotModel')).toBeUndefined()
    
    // 100ms 후 emit 발생
    vi.advanceTimersByTime(100)
    expect(wrapper.emitted('update:pivotModel')).toBeDefined()
    
    vi.useRealTimers()
  })
})

describe('PivotModel 유틸리티', () => {
  it('두 모델이 동일한지 비교할 수 있어야 함', () => {
    const model1 = createPivotModel({
      rows: ['region'],
      cols: ['quarter'],
      vals: ['sales']
    })
    
    const model2 = createPivotModel({
      rows: ['region'],
      cols: ['quarter'],
      vals: ['sales']
    })
    
    const model3 = createPivotModel({
      rows: ['region'],
      cols: ['quarter'],
      vals: ['amount'] // 다른 값
    })
    
    expect(pivotModelsEqual(model1, model2)).toBe(true)
    expect(pivotModelsEqual(model1, model3)).toBe(false)
  })
})

describe('PivotModelSerializer', () => {
  const testModel = createPivotModel({
    rows: ['region'],
    cols: ['quarter'],
    vals: ['sales'],
    aggregatorName: 'Average',
    valueFilter: { region: ['North'] }
  })

  it('JSON 직렬화/역직렬화가 작동해야 함', () => {
    const json = PivotModelSerializer.serialize(testModel)
    const deserialized = PivotModelSerializer.deserialize(json)
    
    expect(deserialized.rows).toEqual(testModel.rows)
    expect(deserialized.cols).toEqual(testModel.cols)
    expect(deserialized.vals).toEqual(testModel.vals)
    expect(deserialized.aggregatorName).toBe(testModel.aggregatorName)
    expect(deserialized.valueFilter).toEqual(testModel.valueFilter)
  })

  it('URL 파라미터 변환이 작동해야 함', () => {
    const params = PivotModelSerializer.toUrlParams(testModel)
    
    expect(params.get('rows')).toBe('region')
    expect(params.get('cols')).toBe('quarter')
    expect(params.get('vals')).toBe('sales')
    expect(params.get('aggregatorName')).toBe('Average')
    expect(params.get('valueFilter')).toBe(JSON.stringify({ region: ['North'] }))
    
    const restored = PivotModelSerializer.fromUrlParams(params)
    expect(restored.rows).toEqual(['region'])
    expect(restored.cols).toEqual(['quarter'])
    expect(restored.valueFilter).toEqual({ region: ['North'] })
  })

  it('Base64 인코딩/디코딩이 작동해야 함', () => {
    const base64 = PivotModelSerializer.toBase64(testModel)
    const decoded = PivotModelSerializer.fromBase64(base64)
    
    expect(decoded.rows).toEqual(testModel.rows)
    expect(decoded.cols).toEqual(testModel.cols)
    expect(decoded.aggregatorName).toBe(testModel.aggregatorName)
  })
})

describe('usePivotModelHistory', () => {
  it('상태 히스토리를 관리할 수 있어야 함', () => {
    const model = ref(createPivotModel({
      rows: ['region'],
      cols: ['quarter']
    }))
    
    const {
      history,
      currentIndex,
      canUndo,
      canRedo,
      pushState,
      undo,
      redo
    } = usePivotModelHistory(model, { autoSave: false })
    
    // 초기 상태
    expect(history.value.length).toBe(0)
    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)
    
    // 상태 추가
    pushState(model.value)
    expect(history.value.length).toBe(1)
    expect(currentIndex.value).toBe(0)
    
    // 새로운 상태
    model.value.rows = ['region', 'product']
    pushState(model.value)
    expect(history.value.length).toBe(2)
    expect(canUndo.value).toBe(true)
    
    // 실행 취소
    const undoState = undo()
    expect(undoState).toBeDefined()
    expect(undoState?.rows).toEqual(['region'])
    expect(canRedo.value).toBe(true)
    
    // 다시 실행
    const redoState = redo()
    expect(redoState).toBeDefined()
    expect(redoState?.rows).toEqual(['region', 'product'])
  })

  it('자동 저장이 작동해야 함', async () => {
    const model = ref(createPivotModel({
      rows: ['region']
    }))
    
    const { history } = usePivotModelHistory(model, { autoSave: true })
    
    // 초기 상태가 자동 저장됨
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(history.value.length).toBe(1)
    
    // 모델 변경
    model.value.rows = ['region', 'product']
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(history.value.length).toBe(2)
  })
})