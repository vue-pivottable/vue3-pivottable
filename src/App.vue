<script setup>
import { VPivottable } from './index.js'
import tips from './tips.js'
</script>

<template>
  <div>
    <VPivottable
      :data="tips"
      :rows="['Payer Smoker']"
      :cols="['Payer Gender']"
    />
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

<style scoped>

</style>
