---
title: Vue 3 + TypeScript 패턴 가이드
date: "2025-05-27"
tags: ["vue3", "typescript"]
categories: TypeScript
permalink: /blog/:year/:month/:day/:title/
last_modified_at: "2025-05-27"
---

> **기반**: Vue Pivottable 프로젝트 코드 기반 실무 패턴  
> **범위**: 기본부터 고급까지 TypeScript 변환 가이드
<!--more-->

## 📚 목차

1. [기본 패턴 (Essential Patterns)](#1-기본-패턴-essential-patterns)
2. [중급 패턴 (Intermediate Patterns)](#2-중급-패턴-intermediate-patterns)  
3. [고급 패턴 (Advanced Patterns)](#3-고급-패턴-advanced-patterns)
4. [성능 최적화 패턴](#4-성능-최적화-패턴)
5. [실무 베스트 프랙티스](#5-실무-베스트-프랙티스)

---

## 1. 기본 패턴 (Essential Patterns)

### 1.1 컴포넌트

#### 1.1.1 필수 Props 정의 – defineProps만 사용하는 경우

```vue
<!-- VPivottableHeaderColumns.vue 기반 -->
<script setup lang="ts">
import type { PivotKey } from '@/types'

<!-- ✅ 기본 Props 패턴 -->
interface Props {
  colKeys: PivotKey[]
  colIndex: number
  colAttrsLength: number
  rowAttrsLength: number
}

const props = defineProps<Props>()
</script>
```

- 모든 props는 필수입니다.
- ? 없이 타입이 선언되면 TypeScript 및 Vue 모두 해당 prop이 반드시 상위에서 전달돼야 함을 요구합니다.
- ❌ withDefaults는 사용할 필요도, 의미도 없습니다.

#### 1.1.2 선택적 Props 정의 – withDefaults로 기본값 제공

```vue
<!-- VPivottableBody.vue 기반 -->
<script setup lang="ts">
interface Props {
  rowTotal?: boolean
  colTotal?: boolean
  localeStrings?: {
    totals: string
  }
  tableOptions?: {
    clickCallback: (() => void) | null
  }
}

const props = withDefaults(defineProps<Props>(), {
  rowTotal: true,
  colTotal: true,
  localeStrings: () => ({ totals: 'Totals' }),
  tableOptions: () => ({ clickCallback: null })
})
</script>
```

- prop이 생략될 수도 있고, 그 경우 default 값이 사용됩니다.
- ?로 타입이 optional로 설정되어 있어야 TypeScript가 이 구조를 허용합니다.

### 1.2 Emits 정의

```vue
<!-- VDraggableAttribute.vue 기반 -->
<script setup lang="ts">
// ✅ 타입 안전한 Emits 정의
interface Emits {
  'update:zIndexOfFilterBox': [attributeName: string]
  'update:unselectedFilterValues': [data: { key: string; value: Record<string, boolean> }]
  'update:openStatusOfFilterBox': [data: { key: string; value: boolean }]
}

const emit = defineEmits<Emits>()

// 사용
const toggleFilterBox = () => {
  // 타입 체크됨
  emit('update:openStatusOfFilterBox', {
    key: props.attributeName,
    value: !props.open
  })
}
</script>
```

### 1.3 Reactive 상태 관리

```vue
<!-- VFilterBox.vue 기반 -->
<script setup lang="ts">
import { ref } from 'vue'
// ✅ 기본 ref 타입
const filterText = ref<string>('')
const showMenu = ref<boolean>(filterBoxValuesList.length < menuLimit.value)
</script>
```

```typescript
// usePivotUiState.js → TypeScript 변환
import { reactive } from 'vue'

// ✅ 복잡한 객체는 reactive + interface
export interface PivotUiState {
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
}
```

```vue
<!-- VPivottableBodyRowsTotalRow.vue 기반 -->
<script setup lang="ts">
import type { PivotValue } from '@/types'

// ✅ 계산된 속성의 타입 추론
const grandTotalValue = computed<PivotValue>(() => {
  return getAggregator([], []).value()
})
</script>
```

### 1.4 템플릿 참조 (Template Refs)

```vue
<template>
  <input ref="inputEl" type="text" />
  <my-component ref="componentEl" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import MyComponent from './MyComponent.vue'

// ✅ DOM 요소 참조
const inputEl = ref<HTMLInputElement>()

// ✅ 컴포넌트 인스턴스 참조
const componentEl = ref<InstanceType<typeof MyComponent>>()

onMounted(() => {
  inputEl.value?.focus()
  componentEl.value?.somePublicMethod()
})
</script>
```

---

## 2. 중급 패턴 (Intermediate Patterns)

### 2.1 Composables 패턴

```typescript
// usePivotUiState.js → TypeScript 변환
import { reactive } from 'vue'

export interface PivotUiState {
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

  return {
    state: pivotUiState,
    onMoveFilterBoxToTop,
    onUpdateOpenStatus,
    onUpdateUnusedOrder
  }
}
```

### 2.2 provide/inject 타입 안전하게

```typescript
// useProvidePivotData.js → TypeScript 변환

// ✅ 타입 안전한 Injection Key
export interface PivotDataContext {
  pivotData: ComputedRef<PivotData | null>
  rowKeys: ComputedRef<PivotKey[]>
  colKeys: ComputedRef<PivotKey[]>
  getAggregator: (rowKey: PivotKey, colKey: PivotKey) => AggregatorInstance
  spanSize: (arr: PivotKey[], i: number, j: number) => number
}

const PIVOT_DATA_KEY: InjectionKey<PivotDataContext> = Symbol('pivotData')

// Provider
export function providePivotData(props: BasePivotProps): PivotDataContext {
  const pivotData = computed(() => {
    try {
      return new PivotData(props)
    } catch (err) {
      console.error(err instanceof Error ? err.stack : err)
      return null
    }
  })

  const context: PivotDataContext = {
    pivotData,
    rowKeys: computed(() => pivotData.value?.getRowKeys() || []),
    colKeys: computed(() => pivotData.value?.getColKeys() || []),
    getAggregator: (rowKey, colKey) => pivotData.value?.getAggregator(rowKey, colKey),
    spanSize: (arr, i, j) => {
      // spanSize 로직...
      return calculateSpan(arr, i, j)
    }
  }

  provide(PIVOT_DATA_KEY, context)
  return context
}

// Consumer
export function useProvidePivotData(): PivotDataContext {
  const context = inject(PIVOT_DATA_KEY)
  if (!context) {
    throw new Error('useProvidePivotData must be used within a provider')
  }
  return context
}
```

### 2.3 동적 컴포넌트와 타입

```vue
<!-- VPivottable.vue -->
<template>
  <component :is="currentRenderer" v-bind="rendererProps" />
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { BasePivotProps } from '@/types'
import TableRenderers from './renderer/index'

// ✅ 렌더러 컴포넌트 타입 정의 (setup 함수를 가진 객체)
interface RendererComponent {
  name?: string
  setup: (props: any) => () => any
}

// ✅ 렌더러 맵 타입 정의
type RendererMap = {
  'Table': RendererComponent
  'Table Heatmap': RendererComponent
  'Table Row Heatmap': RendererComponent
  'Table Col Heatmap': RendererComponent
  'Export Table TSV': RendererComponent
}

type RendererKey = keyof RendererMap

interface Props extends BasePivotProps {
  renderers?: Partial<Record<RendererKey, RendererComponent>>
  rendererName?: RendererKey
}

const props = withDefaults(defineProps<Props>(), {
  rendererName: 'Table'
})

// ✅ 기본 렌더러들 (실제 프로젝트의 구조)
const defaultRenderers: RendererMap = TableRenderers as RendererMap

// ✅ 현재 렌더러 선택
const currentRenderer = computed(() => {
  const rendererName = props.rendererName || 'Table'
  return props.renderers?.[rendererName] || defaultRenderers[rendererName]
})

// ✅ 렌더러별 Props (각 렌더러의 setup 함수에서 처리)
const rendererProps = computed(() => {
  return {
    data: props.data,
    aggregators: props.aggregators,
    aggregatorName: props.aggregatorName,  
    cols: props.cols,
    rows: props.rows,
    vals: props.vals,
    showRowTotal: props.showRowTotal,
    showColTotal: props.showColTotal,
    localeStrings: props.localeStrings,
    tableOptions: props.tableOptions,
    // heatmapMode는 각 렌더러 내부에서 설정됨
  }
})
</script>
```

### 2.4 Slots 타입 정의

```typescript
// ✅ Slot Props 타입 정의
interface PvtAttrSlotProps {
  attrName: string
  filtered: boolean
  restricted: boolean
}

interface OutputSlotProps {
  pivotData: PivotDataInstance
  error: string | null
}

// 슬롯 타입 정의
interface VPivottableSlots {
  pvtAttr(props: PvtAttrSlotProps): any
  output(props: OutputSlotProps): any
  rendererCell(): any
  aggregatorCell(): any
}
```

---

## 3. 고급 패턴 (Advanced Patterns)

### 3.1 고급 제네릭 컴포저블

```typescript
// composables/useAsyncData.ts
import { ref, type Ref } from 'vue'

export interface AsyncDataOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  transform?: (raw: any) => T
}

export interface AsyncDataReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  isLoading: Ref<boolean>
  execute: () => Promise<void>
  refresh: () => Promise<void>
}

export function useAsyncData<T = any>(
  fetcher: () => Promise<T>,
  options: AsyncDataOptions<T> = {}
): AsyncDataReturn<T> {
  const { immediate = true, onSuccess, onError, transform } = options
  
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const isLoading = ref(false)
  
  const execute = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await fetcher()
      const transformedData = transform ? transform(result) : result
      
      data.value = transformedData
      onSuccess?.(transformedData)
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj
      onError?.(errorObj)
    } finally {
      isLoading.value = false
    }
  }
  
  const refresh = () => execute()
  
  if (immediate) {
    execute()
  }
  
  return {
    data,
    error,
    isLoading,
    execute,
    refresh
  }
}

// 사용 예시
interface User {
  id: number
  name: string
  email: string
}

interface ApiResponse<T> {
  data: T
  status: string
}

// ✅ 제네릭 타입 추론
const { data: user, isLoading, error } = useAsyncData<User>(
  () => fetch('/api/user').then(res => res.json()),
  {
    transform: (raw: ApiResponse<User>) => raw.data,
    onSuccess: (user) => {
      console.log('User loaded:', user.name)  // 타입 안전
    }
  }
)
```

### 3.2 조건부 타입과 유틸리티 타입

```typescript
// types/utils.ts

// ✅ 조건부 Props 타입
export type ConditionalProps<
  T extends 'button' | 'link',
  Base = {}
> = Base & (
  T extends 'button' 
    ? { onClick: () => void; disabled?: boolean }
    : T extends 'link'
    ? { href: string; target?: string }
    : never
)

// ✅ 깊은 부분 선택 타입
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// ✅ 함수 오버로드 타입
export interface QueryBuilder {
  <T extends string>(field: T): QueryBuilder
  <T extends string, V>(field: T, value: V): QueryBuilder
  <T extends Record<string, any>>(conditions: T): QueryBuilder
}

// ✅ 이벤트 핸들러 타입 추출
export type EventHandlers<T> = {
  [K in keyof T as K extends `on${string}` ? K : never]: T[K]
}

// 사용 예시
interface ComponentProps {
  title: string
  onClick: () => void
  onSubmit: (data: any) => void
  onError: (error: Error) => void
  disabled: boolean
}

type Handlers = EventHandlers<ComponentProps>
// 결과: { onClick: () => void; onSubmit: (data: any) => void; onError: (error: Error) => void }
```

### 3.3 고급 컴포넌트 패턴

```vue
<!-- AdvancedComponent.vue -->
<template>
  <div>
    <!-- Render Props 패턴 -->
    <slot 
      v-if="$slots.default"
      :state="state"
      :actions="actions"
      :computed="computedValues"
    />
    
    <!-- Fallback 렌더링 -->
    <default-render 
      v-else
      :state="state"
      :actions="actions"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, provide } from 'vue'

// ✅ 복잡한 상태 관리
interface ComponentState {
  items: any[]
  selectedIds: Set<string>
  filters: Record<string, any>
  sorting: {
    field: string
    direction: 'asc' | 'desc'
  }
}

interface ComponentActions {
  addItem: (item: any) => void
  removeItem: (id: string) => void
  toggleSelection: (id: string) => void
  updateFilter: (key: string, value: any) => void
  sort: (field: string) => void
  reset: () => void
}

const state = reactive<ComponentState>({
  items: [],
  selectedIds: new Set(),
  filters: {},
  sorting: { field: 'id', direction: 'asc' }
})

const actions: ComponentActions = {
  addItem: (item) => {
    state.items.push({ ...item, id: crypto.randomUUID() })
  },
  
  removeItem: (id) => {
    state.items = state.items.filter(item => item.id !== id)
    state.selectedIds.delete(id)
  },
  
  toggleSelection: (id) => {
    if (state.selectedIds.has(id)) {
      state.selectedIds.delete(id)
    } else {
      state.selectedIds.add(id)
    }
  },
  
  updateFilter: (key, value) => {
    if (value === null || value === undefined || value === '') {
      delete state.filters[key]
    } else {
      state.filters[key] = value
    }
  },
  
  sort: (field) => {
    if (state.sorting.field === field) {
      state.sorting.direction = state.sorting.direction === 'asc' ? 'desc' : 'asc'
    } else {
      state.sorting.field = field
      state.sorting.direction = 'asc'
    }
  },
  
  reset: () => {
    state.items = []
    state.selectedIds.clear()
    state.filters = {}
    state.sorting = { field: 'id', direction: 'asc' }
  }
}

// ✅ 복잡한 계산된 값들
const computedValues = {
  filteredItems: computed(() => {
    return state.items.filter(item => {
      return Object.entries(state.filters).every(([key, value]) => {
        return String(item[key]).toLowerCase().includes(String(value).toLowerCase())
      })
    })
  }),
  
  sortedItems: computed(() => {
    const items = [...computedValues.filteredItems.value]
    const { field, direction } = state.sorting
    
    return items.sort((a, b) => {
      const aVal = a[field]
      const bVal = b[field]
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return direction === 'asc' ? comparison : -comparison
    })
  }),
  
  selectedItems: computed(() => {
    return computedValues.sortedItems.value.filter(item => 
      state.selectedIds.has(item.id)
    )
  }),
  
  stats: computed(() => ({
    total: state.items.length,
    filtered: computedValues.filteredItems.value.length,
    selected: state.selectedIds.size
  }))
}

// ✅ Context 제공 (고급 패턴)
export interface ComponentContext {
  state: ComponentState
  actions: ComponentActions
  computed: typeof computedValues
}

const componentKey = Symbol('advanced-component')
provide<ComponentContext>(componentKey, {
  state,
  actions,
  computed: computedValues
})

// 외부에서 사용할 수 있도록 expose
defineExpose({
  state,
  actions,
  computed: computedValues
})
</script>
```

---

## 4. 성능 최적화 패턴

### 4.1 계산 비용이 큰 computed 최적화

```vue
<script setup lang="ts">
import { ref, computed, shallowRef, triggerRef } from 'vue'

// ✅ 얕은 반응성으로 성능 최적화
const expensiveData = shallowRef<{
  items: LargeObject[]
  metadata: any
}>({
  items: [],
  metadata: {}
})

// ✅ 메모이제이션된 계산
const processedData = computed(() => {
  // 큰 계산 작업
  return expensiveData.value.items
    .filter(item => item.isActive)
    .map(item => ({
      ...item,
      computed: heavyComputation(item)
    }))
})

// 데이터 업데이트시 수동으로 트리거
const updateExpensiveData = (newData: any) => {
  expensiveData.value = newData
  triggerRef(expensiveData)  // 수동 업데이트 트리거
}
</script>
```

### 4.2 동적 Import와 코드 분할

```vue
<script setup lang="ts">
import { ref, defineAsyncComponent, type Component } from 'vue'

// ✅ 비동기 컴포넌트 로딩
const HeavyComponent = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: { 
    template: '<div>Loading...</div>' 
  },
  errorComponent: { 
    template: '<div>Error loading component</div>' 
  },
  delay: 200,
  timeout: 3000
})

// ✅ 조건부 동적 로딩
const dynamicComponents = ref<Record<string, Component>>({})

const loadComponent = async (name: string) => {
  if (!dynamicComponents.value[name]) {
    try {
      const module = await import(`./components/${name}.vue`)
      dynamicComponents.value[name] = module.default
    } catch (error) {
      console.error(`Failed to load component: ${name}`, error)
    }
  }
  return dynamicComponents.value[name]
}
</script>
```

### 4.3 메모리 누수 방지 패턴

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// ✅ 이벤트 리스너 정리
let resizeHandler: () => void
let intervalId: NodeJS.Timeout

onMounted(() => {
  // ResizeObserver 사용
  const resizeObserver = new ResizeObserver((entries) => {
    // 처리 로직
  })
  
  const targetElement = document.getElementById('target')
  if (targetElement) {
    resizeObserver.observe(targetElement)
  }
  
  // 정리 함수 등록
  onUnmounted(() => {
    resizeObserver.disconnect()
    if (intervalId) clearInterval(intervalId)
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }
  })
})

// ✅ WeakMap을 사용한 메모리 효율적 캐싱
const cache = new WeakMap<object, any>()

const getCachedValue = (obj: object, computer: () => any) => {
  if (cache.has(obj)) {
    return cache.get(obj)
  }
  const value = computer()
  cache.set(obj, value)
  return value
}
</script>
```

---

## 5. 실무 베스트 프랙티스

### 5.1 에러 핸들링 패턴

```vue
<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

// ✅ 컴포넌트 레벨 에러 처리
interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  timestamp: Date
}

const errors = ref<ErrorInfo[]>([])

onErrorCaptured((error: Error, instance, info: string) => {
  const errorInfo: ErrorInfo = {
    message: error.message,
    stack: error.stack,
    componentStack: info,
    timestamp: new Date()
  }
  
  errors.value.push(errorInfo)
  
  // 에러 리포팅 서비스로 전송
  reportError(errorInfo)
  
  // true를 반환하면 에러 전파 중단
  return false
})

// ✅ 비동기 에러 처리
const safeAsyncOperation = async <T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | null> => {
  try {
    return await operation()
  } catch (error) {
    console.error('Async operation failed:', error)
    return fallback || null
  }
}
</script>
```

### 5.2 타입 가드와 검증

```typescript
// utils/typeGuards.ts

// ✅ 기본 타입 가드
export const isString = (value: unknown): value is string => 
  typeof value === 'string'

export const isNumber = (value: unknown): value is number => 
  typeof value === 'number' && !isNaN(value)

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

// ✅ 복합 타입 가드
export interface User {
  id: number
  name: string
  email: string
  isActive?: boolean
}

export const isUser = (value: unknown): value is User => {
  return isObject(value) &&
         isNumber(value.id) &&
         isString(value.name) &&
         isString(value.email) &&
         (value.isActive === undefined || typeof value.isActive === 'boolean')
}

// ✅ 배열 타입 가드
export const isUserArray = (value: unknown): value is User[] =>
  Array.isArray(value) && value.every(isUser)

// ✅ API 응답 검증
export interface ApiResponse<T> {
  data: T
  status: 'success' | 'error'
  message?: string
}

export const isApiResponse = <T>(
  value: unknown,
  dataGuard: (data: unknown) => data is T
): value is ApiResponse<T> => {
  return isObject(value) &&
         dataGuard(value.data) &&
         (value.status === 'success' || value.status === 'error') &&
         (value.message === undefined || isString(value.message))
}

// 사용 예시
const fetchUser = async (id: number): Promise<User | null> => {
  try {
    const response = await fetch(`/api/users/${id}`)
    const data = await response.json()
    
    if (isApiResponse(data, isUser) && data.status === 'success') {
      return data.data
    }
    
    return null
  } catch {
    return null
  }
}
```

### 5.3 테스트 가능한 컴포넌트 설계

```vue
<!-- TestableComponent.vue -->
<template>
  <div>
    <button 
      @click="handleClick"
      :disabled="isLoading"
      data-testid="submit-button"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ✅ 테스트하기 쉬운 Props 정의
interface Props {
  isLoading?: boolean
  onSubmit?: (data: any) => Promise<void> | void
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  buttonText: 'Submit'
})

// ✅ 외부 의존성 주입 가능하도록 설계
interface Dependencies {
  apiClient?: {
    post: (url: string, data: any) => Promise<any>
  }
  logger?: {
    log: (message: string) => void
  }
}

const deps = inject<Dependencies>('dependencies', {
  apiClient: {
    post: (url: string, data: any) => fetch(url, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }).then(r => r.json())
  },
  logger: {
    log: console.log
  }
})

// ✅ 테스트 가능한 로직 분리
const handleClick = async () => {
  try {
    const result = await props.onSubmit?.({
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    })
    
    deps.logger?.log('Submit successful')
    return result
  } catch (error) {
    deps.logger?.log(`Submit failed: ${error}`)
    throw error
  }
}

// ✅ 테스트를 위한 public 메서드 expose
defineExpose({
  handleClick,
  // 테스트에서 내부 상태 검증 가능
  getInternalState: () => ({
    isLoading: props.isLoading,
    buttonText: props.buttonText
  })
})
</script>
```

### 5.4 성능 모니터링

```typescript
// composables/usePerformanceMonitor.ts
import { ref, onMounted, onUnmounted } from 'vue'

export interface PerformanceMetrics {
  renderTime: number
  componentCount: number
  memoryUsage: number
  updateCount: number
}

export function usePerformanceMonitor(componentName: string) {
  const metrics = ref<PerformanceMetrics>({
    renderTime: 0,
    componentCount: 0,
    memoryUsage: 0,
    updateCount: 0
  })
  
  const startTime = performance.now()
  let updateCount = 0
  
  const measureRenderTime = () => {
    metrics.value.renderTime = performance.now() - startTime
  }
  
  const measureMemoryUsage = () => {
    if ('memory' in performance) {
      metrics.value.memoryUsage = (performance as any).memory.usedJSHeapSize
    }
  }
  
  const incrementUpdateCount = () => {
    updateCount++
    metrics.value.updateCount = updateCount
  }
  
  // 개발 모드에서만 성능 측정
  if (process.env.NODE_ENV === 'development') {
    onMounted(() => {
      measureRenderTime()
      measureMemoryUsage()
      
      console.group(`Performance Metrics - ${componentName}`)
      console.log('Render Time:', metrics.value.renderTime.toFixed(2), 'ms')
      console.log('Memory Usage:', (metrics.value.memoryUsage / 1024 / 1024).toFixed(2), 'MB')
      console.groupEnd()
    })
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes(componentName)) {
          console.log(`${componentName} Performance:`, entry)
        }
      }
    })
    
    observer.observe({ entryTypes: ['measure', 'navigation'] })
    
    onUnmounted(() => {
      observer.disconnect()
    })
  }
  
  return {
    metrics,
    measureRenderTime,
    measureMemoryUsage,
    incrementUpdateCount
  }
}
```

---

## 🚀 실무 적용 체크리스트

### ✅ 기본 준비사항

- [ ] TypeScript 5.0+ 설정 완료
- [ ] Vue 3.3+ 사용 (최신 TypeScript 지원)
- [ ] Vite/Webpack TypeScript 설정 최적화
- [ ] ESLint + TypeScript 규칙 설정

### ✅ 컴포넌트 설계

- [ ] Props interface 명확히 정의
- [ ] Emits 타입 안전하게 정의
- [ ] Slots 타입 정의 (필요시)
- [ ] 복잡한 상태는 composable로 분리

### ✅ 타입 시스템

- [ ] 전역 타입 정의 (types/ 폴더)
- [ ] API 응답 타입 정의
- [ ] 이벤트 핸들러 타입 정의
- [ ] 유틸리티 타입 활용

### ✅ 성능 최적화

- [ ] 큰 객체는 shallowRef 사용
- [ ] 무거운 컴포넌트는 defineAsyncComponent
- [ ] 메모리 누수 방지 패턴 적용
- [ ] 불필요한 re-render 방지

### ✅ 에러 핸들링 & 테스트

- [ ] 컴포넌트 레벨 에러 처리
- [ ] 타입 가드로 런타임 검증
- [ ] 테스트 가능한 구조 설계
- [ ] 성능 모니터링 (개발 환경)

---

이 가이드는 **실무에서 바로 사용할 수 있는** 패턴들로 구성했습니다.
