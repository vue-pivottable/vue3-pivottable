<template>
  <div>
    <h1 style="text-align: center">Vue3 Pivottable</h1>
    <CsvUploader
      :initial-data="initialData"
      :initial-filename="initialFilename"
      @data-parsed="onDataParsed"
    >
      <template #default="{ data }">
        <VPivottableUi
          v-if="data.length > 0"
          :data="data"
          :rows="rows"
          :cols="cols"
          :vals="vals"
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
        </VPivottableUi>
      </template>
    </CsvUploader>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import tips from './tips.js'
import CsvUploader from './CsvUploader.vue'
import { PivotUtilities } from '@/'
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
const rendererName = ref('Table Heatmap')
const onDataParsed = (data) => {
  rows.value = []
  cols.value = []
  vals.value = []
  sorters.value = []
  rendererName.value = 'Table'
  aggregatorName.value = 'Count'
}
</script>

<style scoped></style>
