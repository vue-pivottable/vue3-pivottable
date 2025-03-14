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
    <VPivottableUi/>
  </div>

</template>

<style scoped>

</style>
