<template>
  <div>
    <h1 style="text-align: center">Vue3 Pivottable</h1>
    <CsvUploader
      :initial-data="initialData"
      :initial-filename="initialFilename"
      @data-parsed="onDataParsed"
    >
      <!-- <VuePivottableUi
        :data="[
          { color: 'blue', shape: 'circle' },
          { color: 'red', shape: 'triangle' }
        ]"
        :rows="['color']"
        :cols="['shape']"
        rendererName="Export Table TSV"
      /> -->
      <template #default="{ data }">
        <VuePivottableUi
          v-if="data.length > 0"
          :data="data"
          :rows="rows"
          :cols="cols"
          :vals="vals"
          :renderers="renderers"
          :aggregatorName="aggregatorName"
          :rendererName="rendererName"
          :sorters="sorters"
        >
          <!-- <template v-slot:pvtAttr="props">
          {{ props }}
        </template> -->

          <!-- <template v-slot:outputSlot>
          <div>slot</div>
        </template> -->
          <!-- <template v-slot:outputSlot="outputSlot">
          {{ outputSlot }}
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
const vals = ref(['Tip'])
const rendererName = ref('Table')
const onDataParsed = (data) => {
  rows.value = []
  cols.value = []
  vals.value = []
  sorters.value = []
  aggregatorName.value = 'Count'
}
</script>

<style></style>
