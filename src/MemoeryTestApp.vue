<template>
  <div id="app">
    <h1>Vue PivotTable (v1.1.7) Memory Leak Detector</h1>
    <div class="controls">
      <button @click="togglePivot">
        {{ showPivot ? 'Hide' : 'Show' }} PivotTable
      </button>
      <button
        @click="refresh"
        class="btn-primary"
      >
        🔄 Force Refresh
      </button>
      <button
        @click="refreshMultipleTimes(50)"
        class="btn-danger"
      >
        🔥 Refresh 50 Times
      </button>
      <button
        @click="takeSnapshot"
        :disabled="isAnalyzing"
      >
        {{ isAnalyzing ? 'Analyzing...' : '📸 Analyze Memory' }}
      </button>
      <button @click="clearLog">Clear Log</button>
      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="useComponentKey"
        />
        <span>Enable Component Key (Simulates Memory Leak)</span>
      </label>
      <select
        v-model.number="dataSize"
        @change="onDataSizeChange"
        class="data-size-select"
      >
        <option :value="1000">1,000 records</option>
        <option :value="5000">5,000 records</option>
        <option :value="10000">10,000 records</option>
      </select>
    </div>

    <div class="stats">
      <div>Data Size: {{ dataSize.toLocaleString() }} records</div>
      <div>Refresh Count: {{ refreshCount }}</div>
      <div :class="{ warning: useComponentKey }">
        Component Key: {{ useComponentKey ? componentKey : '0 (fixed)' }}
      </div>
      <div>Current Memory: {{ currentMemory }} MB</div>
      <div>Initial Memory: {{ initialMemory }} MB</div>
      <div :class="getMemoryClass()">Memory Growth: {{ memoryGrowth }} MB</div>
    </div>

    <div
      class="analysis"
      v-if="analysisResults.length > 0"
    >
      <h2>Memory Analysis Results:</h2>
      <div
        v-for="(result, index) in analysisResults"
        :key="index"
        class="result"
      >
        <strong>{{ result.timestamp }}</strong>
        <pre>{{ result.data }}</pre>
      </div>
    </div>

    <VuePivottableUi
      v-if="showPivot"
      :key="useComponentKey ? componentKey : 0"
      :data="tableData"
      :aggregators="aggregators"
      :renderers="renderers"
      :rows="['Category']"
      :cols="['Month']"
      :vals="['Sales']"
      aggregator-name="Sum"
      renderer-name="Table"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, markRaw } from 'vue'
import { VuePivottableUi, PivotUtilities, Renderer } from '@/'
import 'vue-pivottable/dist/vue-pivottable.css'

// Use default aggregators and renderers - mark as non-reactive for performance
const aggregators =
  markRaw(PivotUtilities.aggregators) ||
  markRaw({
    Count: () => () => ({
      count: 0,
      push() {
        this.count++
      },
      value() {
        return this.count
      },
      format: (x) => x
    }),
    Sum:
      () =>
      ([attr]) => ({
        sum: 0,
        push(record) {
          const val = parseFloat(record[attr])
          if (!isNaN(val)) this.sum += val
        },
        value() {
          return this.sum
        },
        format: (x) => x.toFixed(0)
      })
  })

const renderers =
  markRaw(Renderer) ||
  markRaw({
    'Table': () => {},
    'Table Heatmap': () => {}
  })

// State
const showPivot = ref(true)
const refreshCount = ref(0)
const dataSize = ref(1000)
const currentMemory = ref('0.00')
const initialMemory = ref('0.00')
const memoryGrowth = ref('0.00')
const isAnalyzing = ref(false)
const analysisResults = ref([])
const useComponentKey = ref(false) // Toggle for testing memory leak
const componentKey = ref(0)

let initialMem = 0
let memoryCheckInterval = null

// Generate test data
const generateTableData = (size = dataSize.value) => {
  const categories = [
    'Electronics',
    'Clothing',
    'Food',
    'Books',
    'Sports',
    'Home',
    'Toys',
    'Health',
    'Beauty',
    'Auto'
  ]
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const regions = ['North', 'South', 'East', 'West', 'Central']

  const data = []
  for (let i = 0; i < size; i++) {
    data.push({
      id: i,
      Category: categories[Math.floor(Math.random() * categories.length)],
      Month: months[Math.floor(Math.random() * months.length)],
      Region: regions[Math.floor(Math.random() * regions.length)],
      Sales: Math.floor(Math.random() * 10000) + 100,
      Quantity: Math.floor(Math.random() * 500) + 1,
      Cost: Math.floor(Math.random() * 5000) + 50,
      Profit: Math.floor(Math.random() * 3000) + 10,
      Date: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toISOString()
    })
  }
  return data
}

const tableData = ref(generateTableData())

// Memory measurement
const updateMemory = () => {
  // Check if performance.memory is available (Chrome only)
  if (typeof performance !== 'undefined' && performance.memory) {
    const currentMem = performance.memory.usedJSHeapSize / 1048576
    currentMemory.value = currentMem.toFixed(2)

    if (initialMem === 0) {
      initialMem = currentMem
      initialMemory.value = currentMem.toFixed(2)
    }

    memoryGrowth.value = (currentMem - initialMem).toFixed(2)
  } else {
    // Fallback for browsers without performance.memory
    currentMemory.value = 'N/A'
    console.warn(
      'Memory measurement requires Chrome with performance.memory API'
    )
  }
}

// Get memory status class
const getMemoryClass = () => {
  const growth = parseFloat(memoryGrowth.value)
  if (growth < 10) return 'good'
  if (growth < 50) return 'warning'
  return 'danger'
}

// Toggle PivotTable visibility
const togglePivot = async () => {
  showPivot.value = !showPivot.value
  await nextTick()
  updateMemory()
}

// Refresh with new data
const refresh = async (countAsRefresh = true) => {
  // Hide component
  showPivot.value = false
  await nextTick()

  // Generate new data (mark as raw to prevent reactivity on large arrays)
  tableData.value = markRaw(generateTableData())

  // Show component
  showPivot.value = true

  // Cycle component key to force cleanup every 10 refreshes (prevents accumulation)
  if (useComponentKey.value) {
    componentKey.value = (componentKey.value + 1) % 10
  }

  if (countAsRefresh) {
    refreshCount.value++
  }

  await nextTick()
  updateMemory()

  if (countAsRefresh) {
    console.log(
      `[Memory Test] Refresh #${refreshCount.value}: ${currentMemory.value} MB (Key: ${useComponentKey.value ? componentKey.value : 0})`
    )
  }
}

// Refresh multiple times
const refreshMultipleTimes = async (times) => {
  console.log(
    `Starting ${times} refreshes with Component Key ${useComponentKey.value ? 'ENABLED' : 'DISABLED'}`
  )

  const startMemory = parseFloat(currentMemory.value)

  for (let i = 0; i < times; i++) {
    await refresh()
    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  const endMemory = parseFloat(currentMemory.value)
  const totalGrowth = endMemory - startMemory

  console.log(`Completed ${times} refreshes`)
  console.log(`Memory growth: ${totalGrowth.toFixed(2)} MB`)
  console.log(`Average per refresh: ${(totalGrowth / times).toFixed(2)} MB`)
}

// Analyze memory state
const takeSnapshot = async () => {
  isAnalyzing.value = true

  try {
    await refresh(false)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const analysis = analyzeMemoryState()

    analysisResults.value.unshift({
      timestamp: new Date().toLocaleTimeString(),
      data: analysis
    })

    if (analysisResults.value.length > 5) {
      analysisResults.value = analysisResults.value.slice(0, 5)
    }
  } finally {
    isAnalyzing.value = false
  }
}

// Analyze current memory state
const analyzeMemoryState = () => {
  const results = []

  // Configuration
  results.push('=== Test Configuration ===')
  results.push(
    `Component Key Mode: ${useComponentKey.value ? 'ENABLED (Memory Leak)' : 'DISABLED (Normal)'}`
  )
  results.push(`Data Size: ${dataSize.value} records`)
  results.push(`Refreshes performed: ${refreshCount.value}`)

  // Memory stats
  if (performance.memory) {
    const memStats = {
      used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
      total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2),
      limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)
    }
    results.push('\n=== Memory Statistics ===')
    results.push(`Used: ${memStats.used} MB`)
    results.push(`Total: ${memStats.total} MB`)
    results.push(`Limit: ${memStats.limit} MB`)
  }

  // DOM analysis
  results.push('\n=== DOM Analysis ===')
  results.push(`Total DOM nodes: ${document.getElementsByTagName('*').length}`)
  results.push(`Table data length: ${tableData.value.length}`)

  // Test verdict
  results.push('\n=== Test Verdict ===')
  if (refreshCount.value > 0) {
    const avgGrowthPerRefresh =
      parseFloat(memoryGrowth.value) / refreshCount.value
    results.push(
      `Average growth per refresh: ${avgGrowthPerRefresh.toFixed(2)} MB`
    )

    if (useComponentKey.value) {
      results.push('⚠️ Component Key is ENABLED - Memory leak expected!')
      results.push('   Each refresh creates a new component instance')
    } else {
      if (avgGrowthPerRefresh < 0.1) {
        results.push('✅ No memory leak detected')
        results.push('   Component is properly reusing instances')
      } else if (avgGrowthPerRefresh < 0.5) {
        results.push('⚠️ Minor memory growth detected')
        results.push('   May be normal data accumulation')
      } else {
        results.push('❌ Unexpected memory growth!')
        results.push('   Check for event listeners or references')
      }
    }
  }

  // Recommendations
  results.push('\n=== Recommendations ===')
  results.push('1. Test with Component Key OFF (normal behavior)')
  results.push('2. Test with Component Key ON (simulate leak)')
  results.push('3. Compare results to verify fix effectiveness')
  results.push('4. Use Chrome DevTools for detailed analysis')

  return results.join('\n')
}

// Clear analysis log
const clearLog = () => {
  analysisResults.value = []
  refreshCount.value = 0
  componentKey.value = 0
  initialMem = 0
  updateMemory()
}

// Handle data size change
const onDataSizeChange = () => {
  console.log(`Data size changed to ${dataSize.value} records`)
  tableData.value = generateTableData(dataSize.value)
  updateMemory()
}

// Lifecycle
onMounted(() => {
  updateMemory()

  // Only check memory every 5 seconds to reduce overhead
  memoryCheckInterval = setInterval(updateMemory, 5000)

  console.log('=== Vue PivotTable Memory Leak Detector ===')
  console.log('Instructions:')
  console.log('1. Toggle "Enable Component Key" to simulate memory leak')
  console.log('2. Click "Refresh 50 Times" to run test')
  console.log('3. Compare results with Component Key ON vs OFF')
  console.log('')
  console.log('Expected Results:')
  console.log('- Component Key OFF: Stable memory (~50MB)')
  console.log('- Component Key ON: Growing memory (leak simulation)')

  if (!performance.memory) {
    console.warn('⚠️ Memory measurement requires Chrome browser')
    console.warn('Run Chrome with: --enable-precise-memory-info')
  }
})

onUnmounted(() => {
  if (memoryCheckInterval) {
    clearInterval(memoryCheckInterval)
  }
})
</script>

<style scoped>
#app {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.controls button {
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  transition: all 0.3s;
}

.controls button:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
}

.controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff !important;
}

.btn-danger {
  background: #dc3545 !important;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
}

.checkbox-label input {
  cursor: pointer;
}

.data-size-select {
  padding: 10px 15px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.stats {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stats > div {
  padding: 10px;
  background: white;
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 13px;
}

.stats .good {
  color: #28a745;
  font-weight: bold;
}

.stats .warning {
  color: #ffc107;
  font-weight: bold;
}

.stats .danger {
  color: #dc3545;
  font-weight: bold;
}

.analysis {
  background: white;
  border: 1px solid #dee2e6;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.analysis h2 {
  margin-top: 0;
  color: #495057;
  font-size: 18px;
}

.result {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.result:last-child {
  border-bottom: none;
}

.result strong {
  color: #007bff;
  display: block;
  margin-bottom: 8px;
}

.result pre {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  font-family: 'SF Mono', Monaco, monospace;
}

/* PivotTable styling */
:deep(.pvtUi) {
  font-size: 13px;
}

:deep(.pvtTable) {
  font-size: 12px;
}

:deep(.pvtTable th) {
  background: #f8f9fa;
  font-weight: 600;
}

:deep(.pvtTable td) {
  padding: 6px;
}
</style>
