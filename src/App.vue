<script setup>
import tips from './tips.js'
</script>

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

<style scoped>

</style>
