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
          :data="data"
          :rows="rows"
          :cols="cols"
          :vals="vals"
          :renderers="renderers"
          :aggregator-name="aggregatorName"
          :renderer-name="rendererName"
          :sorters="sorters"
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
  </div>
</template>
<script setup>
import { markRaw, ref } from 'vue'
import tips from './tips.js'
import CsvUploader from './CsvUploader.vue'
import { PivotUtilities, VuePivottableUi, Renderer } from '@/'
import LazyPivottableRenderer from '@vue-pivottable/lazy-table-renderer'
import PlotlyRenderer from '@vue-pivottable/plotly-renderer'

const renderers = markRaw({
  ...Renderer,
  ...LazyPivottableRenderer,
  ...PlotlyRenderer
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
const onDataParsed = () => {
  rows.value = []
  cols.value = []
  vals.value = []
  sorters.value = []
  aggregatorName.value = 'Count'
}
</script>

<style></style>
