<template>
  <div>
    <h1 style="text-align: center">Vue3 Pivottable</h1>
    <!-- Base: VuePivottable -->
    <!-- <VuePivottable
      :data="[
        { color: 'blue', shape: 'circle' },
        { color: 'red', shape: 'triangle' }
      ]"
      :rows="['color']"
      :cols="['shape']"
      renderer-name="Table"
      aggreagator-name="count"
    /> -->
    <CsvUploader
      :initial-data="initialData"
      :initial-filename="initialFilename"
      @data-parsed="onDataParsed"
    >
      <template #default="{ data }">
        <VuePivottableUi
          v-if="data.length > 0"
          v-model:pivot-model="pivotModel"
          :data="data"
          :rows="rows"
          :cols="cols"
          :vals="vals"
          :renderers="renderers"
          :aggregator-name="aggregatorName"
          :renderer-name="rendererName"
          :sorters="sorters"
          @change="onPivotModelChange"
        >
          <!-- [test] Scoped Slot: pvtAttr -->
          <!-- <template #pvtAttr="{ attrName }">
            <i
              class="fas fa-filter"
              style="margin-right: 0.25rem"
            />
            {{ attrName }}
          </template> -->

          <!-- [test] Scoped Slot:: outputSlot -->
          <!-- <template #outputSlot="outputSlot">
            {{ outputSlot }}
          </template> -->

          <!-- [test] Slot: colGroup -->
          <!-- <template #colGroup>
            <colgroup :width="colGroupFirstWidth" />
            <colgroup />
          </template> -->

          <!-- [test] Slot: rendererCell -->
          <!-- <template #rendererCell>
            <i
              class="fas fa-table"
              style="margin-right: 0.25rem"
            />
            Table
          </template> -->

          <!-- [test] Slot: aggregatorCell -->
          <!-- <template #aggregatorCell> Sum </template> -->

          <!-- [test] Slot: output -->
          <!-- <template #output>
            <div>loading..</div>
          </template> -->
        </VuePivottableUi>
      </template>
    </CsvUploader>
    
    <!-- PivotModel 상태 표시 -->
    <div style="margin: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px;">
      <h3>PivotModel 양방향 바인딩 상태:</h3>
      <textarea 
        :value="JSON.stringify(pivotModel, null, 2)" 
        readonly
        style="width: 100%; height: 200px; font-family: monospace; font-size: 12px;"
      />
    </div>
  </div>
</template>
<script setup>
import { markRaw, ref } from 'vue'
import tips from './tips.js'
import CsvUploader from './CsvUploader.vue'
import { PivotUtilities, VuePivottableUi, Renderer } from '@/'
// import LazyPivottableRenderer from '@vue-pivottable/lazy-table-renderer'
// import PlotlyRenderer from '@vue-pivottable/plotly-renderer'

const renderers = markRaw({
  ...Renderer,
  // ...LazyPivottableRenderer,
  // ...PlotlyRenderer
})
const initialData = ref(tips)
const initialFilename = ref('샘플 데이터셋: Tips')
// const tableOptions = {
//   clickCallback: function (e, value, filters, pivotData) {
//     const values = []
//     pivotData.forEachMatchingRecord(filters, function (record) {
//       values.push(Object.values(record))
//     })
//     alert(values.join('\n'))
//   }
// }
const rows = ref(['Payer Gender'])
const cols = ref(['Day of Week'])
const aggregatorName = ref('Sum')
const sorters = ref({
  'Day of Week': PivotUtilities.sortAs([
    'Monday',
    'Thursday',
    'Wednesday',
    'Friday',
    'Saturday',
    'Sunday'
  ])
})
// const colGroupFirstWidth = ref(300)

const vals = ref(['Tip'])
const rendererName = ref('Table')

const pivotModel = ref({
  rows: rows.value,
  cols: cols.value,
  vals: vals.value,
  aggregatorName: aggregatorName.value,
  rendererName: rendererName.value,
  valueFilter: {},
  rowOrder: 'key_a_to_z',
  colOrder: 'key_a_to_z',
  heatmapMode: ''
})

const onPivotModelChange = (model) => {
  console.log('PivotModel 변경됨:', model)
}

const onDataParsed = () => {
  rows.value = []
  cols.value = []
  vals.value = []
  sorters.value = []
  aggregatorName.value = 'Count'
}
</script>

<style></style>
