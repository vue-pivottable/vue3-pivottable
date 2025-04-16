<template>
  <div>
    <VPivottableUi
      :data="tips"
      :rows="['Payer Smoker']"
      :cols="['Payer Gender']"
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
  </div>
</template>
<script setup>
import tips from './tips.js'
// const tableOptions = {
//   clickCallback: function (e, value, filters, pivotData) {
//     const values = []
//     pivotData.forEachMatchingRecord(filters, function (record) {
//       values.push(Object.values(record))
//     })
//     alert(values.join('\n'))
//   }
// }
</script>

<style scoped></style>
