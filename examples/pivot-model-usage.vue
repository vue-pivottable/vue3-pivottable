<template>
  <div class="pivot-model-example">
    <h1>PivotModel 양방향 바인딩 사용 예제</h1>
    
    <!-- 기본 사용법 -->
    <section class="basic-usage">
      <h2>기본 사용법</h2>
      <div class="controls">
        <button @click="resetModel">모델 초기화</button>
        <button @click="saveToLocalStorage">로컬 저장</button>
        <button @click="loadFromLocalStorage">로컬 로드</button>
      </div>
      
      <div class="model-status">
        <h3>현재 PivotModel 상태:</h3>
        <pre>{{ JSON.stringify(pivotModel, null, 2) }}</pre>
      </div>
      
      <VPivottableUi
        v-model:pivot-model="pivotModel"
        :data="salesData"
        @change="onPivotChange"
      />
    </section>

    <!-- 히스토리 관리 예제 -->
    <section class="history-example">
      <h2>상태 히스토리 관리</h2>
      <div class="history-controls">
        <button
          @click="undo"
          :disabled="!canUndo"
        >
          ← 실행 취소
        </button>
        <span>{{ currentIndex + 1 }} / {{ history.length }}</span>
        <button
          @click="redo"
          :disabled="!canRedo"
        >
          다시 실행 →
        </button>
      </div>
      
      <VPivottableUi
        v-model:pivot-model="historyModel"
        :data="salesData"
      />
    </section>

    <!-- URL 동기화 예제 -->
    <section class="url-sync-example">
      <h2>URL 파라미터 동기화</h2>
      <div class="url-controls">
        <button @click="syncToUrl">URL에 저장</button>
        <button @click="loadFromUrl">URL에서 로드</button>
        <button @click="shareUrl">공유 링크 생성</button>
      </div>
      
      <div
        v-if="shareLink"
        class="share-link"
      >
        <p>공유 링크:</p>
        <code>{{ shareLink }}</code>
      </div>
      
      <VPivottableUi
        v-model:pivot-model="urlModel"
        :data="salesData"
      />
    </section>

    <!-- 다중 피벗테이블 동기화 -->
    <section class="sync-example">
      <h2>다중 피벗테이블 동기화</h2>
      <div class="sync-controls">
        <label>
          <input
            type="checkbox"
            v-model="syncEnabled"
          />
          동기화 활성화
        </label>
      </div>
      
      <div class="pivot-grid">
        <div class="pivot-item">
          <h3>매출 분석</h3>
          <VPivottableUi
            v-model:pivot-model="masterModel"
            :data="salesData"
            @change="onMasterChange"
          />
        </div>
        
        <div class="pivot-item">
          <h3>고객 분석 (동기화됨)</h3>
          <VPivottableUi
            v-model:pivot-model="slaveModel"
            :data="customerData"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VPivottableUi } from '@/components'
import { PivotModelInterface } from '@/types'
import { createPivotModel } from '@/utils/pivotModel'
import { PivotModelSerializer } from '@/utils/pivotModelSerializer'
import { usePivotModelHistory } from '@/composables/usePivotModelHistory'

// 샘플 데이터
const salesData = ref([
  { region: 'North', quarter: 'Q1', product: 'A', sales: 100, quantity: 10 },
  { region: 'North', quarter: 'Q1', product: 'B', sales: 150, quantity: 15 },
  { region: 'North', quarter: 'Q2', product: 'A', sales: 120, quantity: 12 },
  { region: 'North', quarter: 'Q2', product: 'B', sales: 180, quantity: 18 },
  { region: 'South', quarter: 'Q1', product: 'A', sales: 200, quantity: 20 },
  { region: 'South', quarter: 'Q1', product: 'B', sales: 250, quantity: 25 },
  { region: 'South', quarter: 'Q2', product: 'A', sales: 220, quantity: 22 },
  { region: 'South', quarter: 'Q2', product: 'B', sales: 280, quantity: 28 },
  { region: 'East', quarter: 'Q1', product: 'A', sales: 150, quantity: 15 },
  { region: 'East', quarter: 'Q1', product: 'B', sales: 200, quantity: 20 },
  { region: 'East', quarter: 'Q2', product: 'A', sales: 170, quantity: 17 },
  { region: 'East', quarter: 'Q2', product: 'B', sales: 230, quantity: 23 }
])

const customerData = ref([
  { region: 'North', quarter: 'Q1', segment: 'Enterprise', customers: 50 },
  { region: 'North', quarter: 'Q1', segment: 'SMB', customers: 100 },
  { region: 'North', quarter: 'Q2', segment: 'Enterprise', customers: 55 },
  { region: 'North', quarter: 'Q2', segment: 'SMB', customers: 110 },
  { region: 'South', quarter: 'Q1', segment: 'Enterprise', customers: 40 },
  { region: 'South', quarter: 'Q1', segment: 'SMB', customers: 80 },
  { region: 'South', quarter: 'Q2', segment: 'Enterprise', customers: 45 },
  { region: 'South', quarter: 'Q2', segment: 'SMB', customers: 90 }
])

// 1. 기본 사용법
const pivotModel = ref<PivotModelInterface>(createPivotModel({
  rows: ['region'],
  cols: ['quarter'],
  vals: ['sales'],
  aggregatorName: 'Sum',
  rendererName: 'Table'
}))

const onPivotChange = (newModel: PivotModelInterface) => {
  console.log('피벗 모델 변경:', newModel)
  // 여기서 서버로 상태를 저장하거나 다른 작업을 수행할 수 있습니다
}

const resetModel = () => {
  pivotModel.value = createPivotModel()
}

const saveToLocalStorage = () => {
  PivotModelSerializer.saveToLocalStorage('myPivotModel', pivotModel.value)
  alert('로컬 스토리지에 저장되었습니다!')
}

const loadFromLocalStorage = () => {
  const loaded = PivotModelSerializer.loadFromLocalStorage('myPivotModel')
  if (loaded) {
    pivotModel.value = loaded
    alert('로컬 스토리지에서 로드되었습니다!')
  } else {
    alert('저장된 모델이 없습니다.')
  }
}

// 2. 히스토리 관리
const historyModel = ref<PivotModelInterface>(createPivotModel({
  rows: ['product'],
  cols: ['region'],
  vals: ['quantity'],
  aggregatorName: 'Average'
}))

const {
  history,
  currentIndex,
  canUndo,
  canRedo,
  undo,
  redo
} = usePivotModelHistory(historyModel)

// 3. URL 동기화
const urlModel = ref<PivotModelInterface>(createPivotModel())
const shareLink = ref<string>('')

const syncToUrl = () => {
  const params = PivotModelSerializer.toUrlParams(urlModel.value)
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', newUrl)
  alert('URL에 저장되었습니다!')
}

const loadFromUrl = () => {
  const params = new URLSearchParams(window.location.search)
  const loaded = PivotModelSerializer.fromUrlParams(params)
  if (Object.keys(loaded).length > 0) {
    urlModel.value = createPivotModel(loaded)
    alert('URL에서 로드되었습니다!')
  } else {
    alert('URL에 저장된 모델이 없습니다.')
  }
}

const shareUrl = () => {
  const params = PivotModelSerializer.toUrlParams(urlModel.value)
  shareLink.value = `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

// 4. 다중 피벗테이블 동기화
const syncEnabled = ref(false)
const masterModel = ref<PivotModelInterface>(createPivotModel({
  rows: ['region'],
  cols: ['quarter'],
  vals: ['sales']
}))
const slaveModel = ref<PivotModelInterface>(createPivotModel({
  rows: ['region'],
  cols: ['quarter'],
  vals: ['customers']
}))

const onMasterChange = (newModel: PivotModelInterface) => {
  if (syncEnabled.value) {
    // 구조만 동기화하고 vals는 유지
    slaveModel.value = {
      ...slaveModel.value,
      rows: newModel.rows,
      cols: newModel.cols,
      aggregatorName: newModel.aggregatorName,
      rowOrder: newModel.rowOrder,
      colOrder: newModel.colOrder,
      valueFilter: newModel.valueFilter
    }
  }
}

// 페이지 로드 시 URL에서 상태 복원
onMounted(() => {
  loadFromUrl()
})
</script>

<style scoped>
.pivot-model-example {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

section {
  margin-bottom: 60px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

h1, h2, h3 {
  margin-bottom: 20px;
}

.controls, .history-controls, .url-controls, .sync-controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover:not(:disabled) {
  background: #f0f0f0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.model-status {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.model-status pre {
  margin: 0;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.share-link {
  margin-bottom: 20px;
  padding: 15px;
  background: #e8f5e9;
  border-radius: 4px;
}

.share-link code {
  display: block;
  padding: 10px;
  background: white;
  border-radius: 4px;
  word-break: break-all;
  font-size: 12px;
}

.pivot-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.pivot-item {
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 4px;
}

.pivot-item h3 {
  margin-bottom: 15px;
  color: #333;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
</style>