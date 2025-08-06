# PivotModel 양방향 바인딩 기능 개발 문서

## 개요

본 문서는 vue3-pivottable의 PivotModel 양방향 바인딩 기능 개발에 대한 상세한 분석과 구현 방향을 제시합니다. 현재 VPivottableUi 컴포넌트에서 사용자가 UI를 통해 피벗테이블의 상태를 변경했을 때, 부모 컴포넌트에서 이러한 변경사항을 추적할 수 없는 문제를 해결하는 것이 목표입니다.

## 현재 상황 분석

### 1. 기존 코드 현황

#### 1.1 pivotModel prop 정의
- **위치**: `src/components/pivottable-ui/VPivottableUi.vue` 157번째 줄
- **정의**: `pivotModel?: any`
- **기본값**: `() => ({})`
- **상태**: 정의되어 있으나 실제로 사용되지 않음

#### 1.2 상태 관리 구조
```typescript
// usePropsState composable에서 관리되는 상태
interface PropsState {
  rows: string[]              // 행 필드
  cols: string[]              // 열 필드
  vals: string[]              // 값 필드
  aggregatorName: string      // 집계 함수명
  rendererName: string        // 렌더러명
  valueFilter: Record<string, any>  // 필터 상태
  rowOrder: string            // 행 정렬 순서
  colOrder: string            // 열 정렬 순서
  heatmapMode: string         // 히트맵 모드
  // 기타 props...
}
```

#### 1.3 이벤트 처리 현황
- **하위 컴포넌트들**: 모두 emit을 통해 상위로 이벤트 전달
  - `VAggregatorCell`: `update:aggregator-name`, `update:vals` 등
  - `VRendererCell`: `update:renderer-name`
  - `VDragAndDropCell`: `update:dragged-attribute`
- **VPivottableUi**: emit 정의 없음 → 상태 변경이 부모 컴포넌트로 전달되지 않음

### 2. 문제점 식별

#### 2.1 핵심 문제
1. **단방향 데이터 흐름만 지원**: 부모 → 자식 방향만 가능
2. **상태 변경 추적 불가**: UI 변경사항을 부모에서 감지할 수 없음
3. **사용자 상호작용 손실**: 드래그앤드롭, 필터링, 정렬 등의 변경사항이 부모에게 알려지지 않음

#### 2.2 실제 사용 시나리오의 문제
```vue
<!-- 현재 불가능한 사용법 -->
<template>
  <VPivottableUi
    v-model:pivot-model="myPivotModel"
    :data="data"
    @change="handlePivotChange"
  />
</template>

<script setup>
// 사용자가 UI에서 변경해도 myPivotModel이 업데이트되지 않음
const myPivotModel = ref({
  rows: ['category'],
  cols: ['date'],
  vals: ['amount']
})

// 이 핸들러가 호출되지 않음
const handlePivotChange = (model) => {
  console.log('변경된 피벗 모델:', model)
  // 로컬스토리지 저장, 서버 동기화 등 불가능
}
</script>
```

## 기술적 분석

### 1. Vue 3 v-model 구현 요구사항

#### 1.1 v-model 패턴
```typescript
// v-model:pivot-model을 위한 emit 정의
const emit = defineEmits<{
  'update:pivotModel': [model: PivotModelInterface]
}>()
```

#### 1.2 양방향 바인딩 흐름
```
부모 컴포넌트 → VPivottableUi (props)
     ↑                    ↓
  emit 이벤트 ← usePropsState (상태 변경)
```

### 2. 타입 시스템 설계

#### 2.1 PivotModel 인터페이스 정의
```typescript
interface PivotModelInterface {
  // 핵심 구조 필드
  rows: string[]              // 행으로 사용할 필드들
  cols: string[]              // 열로 사용할 필드들
  vals: string[]              // 집계할 값 필드들
  
  // 렌더링 옵션
  aggregatorName: string      // 집계 함수명 (Sum, Count, Average 등)
  rendererName: string        // 렌더러명 (Table, Table Heatmap 등)
  heatmapMode?: string        // 히트맵 모드 ('full', 'row', 'col', '')
  
  // 필터링 및 정렬
  valueFilter: Record<string, string[]>  // 각 필드별 필터된 값들
  rowOrder: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'  // 행 정렬 순서
  colOrder: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'  // 열 정렬 순서
  
  // 메타데이터
  timestamp?: number          // 마지막 변경 시간
  version?: string           // 모델 버전
}
```

#### 2.2 상태 변경 타입
```typescript
type PivotModelChangeEvent = {
  type: 'field-move' | 'aggregator-change' | 'renderer-change' | 'filter-change' | 'sort-change'
  field?: string
  from?: string
  to?: string
  oldValue?: any
  newValue?: any
  timestamp: number
}
```

### 3. 구현 아키텍처

#### 3.1 컴포넌트 레이어
```
VPivottableUi (emit 추가)
    ↓
usePropsState (emit 통합)
    ↓
개별 상태 변경 메서드들 (emit 호출)
```

#### 3.2 상태 동기화 전략
1. **즉시 동기화**: 모든 상태 변경 시 즉시 emit
2. **debounce 적용**: 연속적인 변경에 대해 지연 처리
3. **diff 체크**: 실제 변경된 부분만 emit

## 구현 계획

### Phase 1: 기본 구조 구축 (우선순위: 높음)

#### 1.1 타입 정의 추가
```typescript
// src/types/index.ts에 추가
export interface PivotModelInterface {
  rows: string[]
  cols: string[]
  vals: string[]
  aggregatorName: string
  rendererName: string
  valueFilter: Record<string, string[]>
  rowOrder: string
  colOrder: string
  heatmapMode?: string
}
```

#### 1.2 VPivottableUi emit 정의
```typescript
// src/components/pivottable-ui/VPivottableUi.vue
const emit = defineEmits<{
  'update:pivotModel': [model: PivotModelInterface]
  'change': [model: PivotModelInterface]
}>()
```

#### 1.3 usePropsState 수정
```typescript
// src/composables/usePropsState.ts
export function usePropsState<T extends UsePropsStateProps>(
  initialProps: T,
  emit?: (event: string, payload: any) => void  // emit 함수 추가
) {
  // 기존 코드...
  
  const emitPivotModel = () => {
    if (!emit) return
    
    const model: PivotModelInterface = {
      rows: state.rows,
      cols: state.cols,
      vals: state.vals,
      aggregatorName: state.aggregatorName,
      rendererName: state.rendererName,
      valueFilter: state.valueFilter,
      rowOrder: state.rowOrder,
      colOrder: state.colOrder,
      heatmapMode: state.heatmapMode
    }
    
    emit('update:pivotModel', model)
    emit('change', model)
  }
  
  // 각 update 메서드에서 emitPivotModel 호출
  const onUpdateRendererName = (rendererName: string) => {
    updateState('rendererName' as keyof T, rendererName)
    // 기존 히트맵 모드 로직...
    emitPivotModel()
  }
  
  // 다른 메서드들도 동일하게 수정...
}
```

### Phase 2: 고급 기능 구현 (우선순위: 중간)

#### 2.1 성능 최적화
```typescript
// debounce를 통한 성능 최적화
import { debounce } from 'lodash-es'

const emitPivotModelDebounced = debounce(emitPivotModel, 100)
```

#### 2.2 변경 감지 최적화
```typescript
// 이전 상태와 비교하여 실제 변경된 경우만 emit
let previousModel: PivotModelInterface | null = null

const emitPivotModel = () => {
  const currentModel = buildPivotModel()
  
  if (previousModel && isEqual(previousModel, currentModel)) {
    return  // 변경사항 없으면 emit 하지 않음
  }
  
  previousModel = { ...currentModel }
  emit('update:pivotModel', currentModel)
  emit('change', currentModel)
}
```

#### 2.3 props와 상태 동기화
```typescript
// VPivottableUi.vue에서 props 변경 감지
watch(
  () => props.pivotModel,
  (newModel) => {
    if (newModel && Object.keys(newModel).length > 0) {
      updateMultiple({
        ...newModel
      })
    }
  },
  { deep: true, immediate: true }
)
```

### Phase 3: 고도화 기능 (우선순위: 낮음)

#### 3.1 상태 히스토리 관리
```typescript
interface PivotModelHistory {
  states: PivotModelInterface[]
  currentIndex: number
  
  undo(): PivotModelInterface | null
  redo(): PivotModelInterface | null
  canUndo(): boolean
  canRedo(): boolean
}
```

#### 3.2 상태 직렬화/역직렬화
```typescript
class PivotModelSerializer {
  static serialize(model: PivotModelInterface): string {
    return JSON.stringify(model)
  }
  
  static deserialize(json: string): PivotModelInterface {
    return JSON.parse(json)
  }
  
  static toUrlParams(model: PivotModelInterface): URLSearchParams {
    // URL 파라미터로 변환
  }
  
  static fromUrlParams(params: URLSearchParams): Partial<PivotModelInterface> {
    // URL 파라미터에서 복원
  }
}
```

## 사용자 시나리오 및 테스트 케이스

### 1. 기본 사용 시나리오

#### 1.1 양방향 바인딩
```vue
<template>
  <div>
    <h3>현재 피벗 모델:</h3>
    <pre>{{ JSON.stringify(pivotModel, null, 2) }}</pre>
    
    <VPivottableUi
      v-model:pivot-model="pivotModel"
      :data="salesData"
      @change="onPivotChange"
    />
    
    <button @click="resetModel">모델 리셋</button>
    <button @click="saveToStorage">로컬 저장</button>
    <button @click="loadFromStorage">로컬 로드</button>
  </div>
</template>

<script setup>
const pivotModel = ref({
  rows: ['region'],
  cols: ['quarter'],
  vals: ['sales'],
  aggregatorName: 'Sum',
  rendererName: 'Table',
  valueFilter: {},
  rowOrder: 'key_a_to_z',
  colOrder: 'key_a_to_z'
})

const onPivotChange = (newModel) => {
  console.log('피벗 모델 변경:', newModel)
  // 서버에 자동 저장
  savePivotModelToServer(newModel)
}

const resetModel = () => {
  pivotModel.value = {
    rows: [],
    cols: [],
    vals: [],
    aggregatorName: 'Count',
    rendererName: 'Table',
    valueFilter: {},
    rowOrder: 'key_a_to_z',
    colOrder: 'key_a_to_z'
  }
}

const saveToStorage = () => {
  localStorage.setItem('pivotModel', JSON.stringify(pivotModel.value))
}

const loadFromStorage = () => {
  const saved = localStorage.getItem('pivotModel')
  if (saved) {
    pivotModel.value = JSON.parse(saved)
  }
}
</script>
```

#### 1.2 다중 피벗테이블 동기화
```vue
<template>
  <div class="dashboard">
    <div class="pivot-container">
      <h3>매출 분석</h3>
      <VPivottableUi
        v-model:pivot-model="salesPivotModel"
        :data="salesData"
        @change="onSalesModelChange"
      />
    </div>
    
    <div class="pivot-container">
      <h3>고객 분석 (매출 모델과 동기화)</h3>
      <VPivottableUi
        v-model:pivot-model="customerPivotModel"
        :data="customerData"
        @change="onCustomerModelChange"
      />
    </div>
  </div>
</template>

<script setup>
const salesPivotModel = ref({ /* ... */ })
const customerPivotModel = ref({ /* ... */ })

// 매출 모델 변경 시 고객 모델도 동일한 구조로 동기화
const onSalesModelChange = (newModel) => {
  customerPivotModel.value = {
    ...customerPivotModel.value,
    rows: newModel.rows,
    cols: newModel.cols,
    // vals는 고객 데이터에 맞게 다르게 설정
  }
}
</script>
```

### 2. 테스트 케이스

#### 2.1 단위 테스트
```typescript
describe('PivotModel 양방향 바인딩', () => {
  test('드래그앤드롭으로 필드 이동 시 모델 업데이트', async () => {
    const { wrapper, pivotModel } = createVPivottableUiWrapper()
    
    // 'category' 필드를 unused에서 rows로 드래그
    await dragFieldToRows(wrapper, 'category')
    
    expect(pivotModel.value.rows).toContain('category')
  })
  
  test('집계 함수 변경 시 모델 업데이트', async () => {
    const { wrapper, pivotModel } = createVPivottableUiWrapper()
    
    await selectAggregator(wrapper, 'Average')
    
    expect(pivotModel.value.aggregatorName).toBe('Average')
  })
  
  test('렌더러 변경 시 모델 업데이트', async () => {
    const { wrapper, pivotModel } = createVPivottableUiWrapper()
    
    await selectRenderer(wrapper, 'Table Heatmap')
    
    expect(pivotModel.value.rendererName).toBe('Table Heatmap')
    expect(pivotModel.value.heatmapMode).toBe('full')
  })
})
```

#### 2.2 통합 테스트
```typescript
describe('PivotModel 통합 테스트', () => {
  test('복잡한 사용자 워크플로우', async () => {
    const { wrapper, pivotModel, emitSpy } = createVPivottableUiWrapper()
    
    // 1. 필드 배치
    await dragFieldToRows(wrapper, 'region')
    await dragFieldToCols(wrapper, 'quarter')
    await dragFieldToVals(wrapper, 'sales')
    
    // 2. 집계 함수 변경
    await selectAggregator(wrapper, 'Average')
    
    // 3. 렌더러 변경
    await selectRenderer(wrapper, 'Table Heatmap')
    
    // 4. 필터 적용
    await applyFilter(wrapper, 'region', ['North', 'South'])
    
    // 5. 정렬 변경
    await changeRowOrder(wrapper, 'value_z_to_a')
    
    // 모든 변경사항이 모델에 반영되었는지 확인
    expect(pivotModel.value).toEqual({
      rows: ['region'],
      cols: ['quarter'],
      vals: ['sales'],
      aggregatorName: 'Average',
      rendererName: 'Table Heatmap',
      heatmapMode: 'full',
      valueFilter: { region: ['North', 'South'] },
      rowOrder: 'value_z_to_a',
      colOrder: 'key_a_to_z'
    })
    
    // emit이 적절히 호출되었는지 확인
    expect(emitSpy).toHaveBeenCalledTimes(5)
  })
})
```

## 호환성 및 마이그레이션

### 1. 기존 코드와의 호환성

#### 1.1 Breaking Changes 없음
- 기존 props는 모두 유지
- 새로운 emit 이벤트 추가만으로 구현
- 기존 사용자 코드는 수정 없이 동작

#### 1.2 점진적 도입 가능
```vue
<!-- 기존 방식 (계속 지원됨) -->
<VPivottableUi :data="data" :rows="['region']" :cols="['quarter']" />

<!-- 새로운 방식 (선택적 사용) -->
<VPivottableUi v-model:pivot-model="model" :data="data" />
```

### 2. 마이그레이션 도구

#### 2.1 Props to Model 변환기
```typescript
function propsToModel(props: VPivottableUiProps): PivotModelInterface {
  return {
    rows: props.rows || [],
    cols: props.cols || [],
    vals: props.vals || [],
    aggregatorName: props.aggregatorName || 'Count',
    rendererName: props.rendererName || 'Table',
    valueFilter: props.valueFilter || {},
    rowOrder: props.rowOrder || 'key_a_to_z',
    colOrder: props.colOrder || 'key_a_to_z',
    heatmapMode: props.heatmapMode || ''
  }
}
```

#### 2.2 마이그레이션 가이드 문서
```markdown
# PivotModel 마이그레이션 가이드

## 기존 코드
```vue
<VPivottableUi
  :data="data"
  :rows="['region']"
  :cols="['quarter']"
  :vals="['sales']"
  :aggregator-name="'Sum'"
  :renderer-name="'Table'"
/>
```

## 새로운 코드
```vue
<VPivottableUi
  v-model:pivot-model="pivotModel"
  :data="data"
  @change="handleChange"
/>

<script setup>
const pivotModel = ref({
  rows: ['region'],
  cols: ['quarter'],
  vals: ['sales'],
  aggregatorName: 'Sum',
  rendererName: 'Table',
  valueFilter: {},
  rowOrder: 'key_a_to_z',
  colOrder: 'key_a_to_z'
})
</script>
```
```

## 성능 고려사항

### 1. 최적화 전략

#### 1.1 불필요한 재렌더링 방지
```typescript
// shallow comparison으로 불필요한 업데이트 방지
const shouldEmit = (oldModel: PivotModelInterface, newModel: PivotModelInterface): boolean => {
  const keys: (keyof PivotModelInterface)[] = [
    'rows', 'cols', 'vals', 'aggregatorName', 'rendererName',
    'rowOrder', 'colOrder', 'heatmapMode'
  ]
  
  for (const key of keys) {
    if (key === 'valueFilter') {
      if (!isEqual(oldModel[key], newModel[key])) return true
    } else if (Array.isArray(oldModel[key])) {
      if (!arraysEqual(oldModel[key] as string[], newModel[key] as string[])) return true
    } else {
      if (oldModel[key] !== newModel[key]) return true
    }
  }
  
  return false
}
```

#### 1.2 메모리 사용량 최적화
- 이전 상태는 shallow copy만 유지
- 필요시에만 deep clone 수행
- 사용하지 않는 히스토리는 자동 정리

#### 1.3 대용량 데이터 처리
```typescript
// 대용량 필터 처리시 성능 최적화
const optimizedValueFilter = computed(() => {
  const filter = state.valueFilter
  
  // 빈 필터는 제거
  return Object.fromEntries(
    Object.entries(filter).filter(([key, values]) => 
      values && values.length > 0
    )
  )
})
```

### 2. 메모리 누수 방지

#### 2.1 이벤트 리스너 정리
```typescript
// composable에서 cleanup 함수 제공
export function usePropsState(initialProps, emit) {
  // ... 기존 코드
  
  const cleanup = () => {
    // debounced 함수 취소
    emitPivotModelDebounced.cancel()
    
    // 상태 참조 해제
    previousModel = null
  }
  
  return {
    // ... 기존 반환값
    cleanup
  }
}

// VPivottableUi.vue에서 cleanup 호출
onUnmounted(() => {
  cleanup?.()
})
```

## 문서화 및 예제

### 1. API 문서

#### 1.1 Props 문서
```typescript
interface VPivottableUiProps {
  // 기존 props들...
  
  /**
   * 피벗테이블의 현재 상태를 나타내는 모델 객체
   * v-model:pivot-model로 양방향 바인딩 가능
   * @since v1.2.0
   */
  pivotModel?: PivotModelInterface
}
```

#### 1.2 Events 문서
```typescript
interface VPivottableUiEmits {
  /**
   * 피벗 모델이 변경될 때 발생
   * v-model:pivot-model과 함께 사용
   * @param model 변경된 피벗 모델
   * @since v1.2.0
   */
  'update:pivotModel': [model: PivotModelInterface]
  
  /**
   * 사용자 상호작용으로 피벗 상태가 변경될 때 발생
   * @param model 변경된 피벗 모델
   * @since v1.2.0
   */
  'change': [model: PivotModelInterface]
}
```

### 2. 예제 코드

#### 2.1 기본 사용법
```vue
<template>
  <VPivottableUi
    v-model:pivot-model="pivotModel"
    :data="salesData"
    @change="handlePivotChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { VPivottableUi } from 'vue3-pivottable'

const pivotModel = ref({
  rows: ['region'],
  cols: ['quarter'],
  vals: ['sales'],
  aggregatorName: 'Sum',
  rendererName: 'Table',
  valueFilter: {},
  rowOrder: 'key_a_to_z',
  colOrder: 'key_a_to_z'
})

const handlePivotChange = (model) => {
  console.log('피벗 상태 변경:', model)
}
</script>
```

#### 2.2 고급 사용법
```vue
<template>
  <div>
    <!-- 피벗 상태 저장/복원 -->
    <div class="controls">
      <button @click="saveState">상태 저장</button>
      <button @click="loadState">상태 복원</button>
      <button @click="resetState">초기화</button>
    </div>
    
    <!-- 피벗테이블 -->
    <VPivottableUi
      v-model:pivot-model="pivotModel"
      :data="data"
      @change="onPivotChange"
    />
    
    <!-- 상태 히스토리 -->
    <div class="history">
      <button @click="undo" :disabled="!canUndo">실행 취소</button>
      <button @click="redo" :disabled="!canRedo">다시 실행</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePivotModelHistory } from './composables/usePivotModelHistory'

const pivotModel = ref({
  rows: [],
  cols: [],
  vals: [],
  aggregatorName: 'Count',
  rendererName: 'Table',
  valueFilter: {},
  rowOrder: 'key_a_to_z',
  colOrder: 'key_a_to_z'
})

const {
  history,
  currentIndex,
  pushState,
  undo,
  redo,
  canUndo,
  canRedo
} = usePivotModelHistory(pivotModel)

const onPivotChange = (newModel) => {
  pushState(newModel)
  
  // 서버에 자동 저장
  saveToServer(newModel)
}

const saveState = () => {
  localStorage.setItem('pivotModel', JSON.stringify(pivotModel.value))
}

const loadState = () => {
  const saved = localStorage.getItem('pivotModel')
  if (saved) {
    pivotModel.value = JSON.parse(saved)
  }
}

const resetState = () => {
  pivotModel.value = {
    rows: [],
    cols: [],
    vals: [],
    aggregatorName: 'Count',
    rendererName: 'Table',
    valueFilter: {},
    rowOrder: 'key_a_to_z',
    colOrder: 'key_a_to_z'
  }
}
</script>
```

## 품질 보증

### 1. 테스트 커버리지 목표
- 단위 테스트: 90% 이상
- 통합 테스트: 주요 사용 시나리오 100% 커버
- E2E 테스트: 핵심 워크플로우 커버

### 2. 성능 벤치마크
- 1000개 데이터 포인트에서 상태 변경 응답시간 < 100ms
- 10000개 데이터 포인트에서 메모리 사용량 증가 < 10MB
- 연속적인 드래그앤드롭 작업에서 메모리 누수 없음

### 3. 브라우저 호환성
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 릴리즈 계획

### Version 1.2.0 (Major Feature Release)
- **목표 일정**: 개발 완료 후 2주 내
- **주요 기능**:
  - PivotModel 양방향 바인딩
  - TypeScript 타입 정의
  - 기본 emit 이벤트 지원
  - 마이그레이션 가이드

### Version 1.2.1 (Performance & Stability)
- **목표 일정**: 1.2.0 릴리즈 후 1주 내
- **개선 사항**:
  - 성능 최적화
  - 메모리 누수 방지
  - 에러 핸들링 개선

### Version 1.3.0 (Advanced Features)
- **목표 일정**: 1.2.1 릴리즈 후 1달 내
- **고급 기능**:
  - 상태 히스토리 관리
  - 직렬화/역직렬화
  - URL 상태 동기화

## 결론

본 PivotModel 양방향 바인딩 기능은 vue3-pivottable의 사용성을 크게 향상시킬 핵심 기능입니다. 

### 주요 이점:
1. **개발자 경험 향상**: 상태 변경 추적 및 관리 용이
2. **실용성 증대**: 상태 저장/복원, 다중 피벗테이블 동기화 등 고급 기능 지원
3. **Vue 3 생태계 통합**: v-model 패턴을 통한 자연스러운 Vue 3 개발 경험

### 기술적 안정성:
- 기존 API와 100% 호환
- 점진적 도입 가능
- 성능 최적화 및 메모리 안전성 보장

이 기능의 구현을 통해 vue3-pivottable은 단순한 표시 컴포넌트에서 상태 관리가 가능한 완전한 피벗테이블 솔루션으로 발전할 것입니다.