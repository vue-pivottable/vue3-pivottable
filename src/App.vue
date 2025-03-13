<script setup>
import { VPivottable } from './index.js'
// import tips from './tips.js'
</script>

<template>

  <div>
    <VPivottable
      :data="[
        {
          color: 'blue',
          shape: 'circle'
        },
        {
          color: 'red',
          shape: 'triangle'
        }
      ]"
      :rows="['color']"
      :cols="['shape']"
    />
    <VPivottableUi
      :data="[
          {
            color: 'blue',
            shape: 'circle'
          },
          {
            color: 'red',
            shape: 'triangle'
          }
        ]"
        :rows="['color']"
        :cols="['shape']"
    >
        <template v-slot:pvtAttr="props">
          {{ props }} 11
        </template>

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
