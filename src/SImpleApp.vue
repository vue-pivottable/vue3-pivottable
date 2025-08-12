<template>
  <div id="app">
    <VuePivottable
      :data="[
        { color: 'blue', shape: 'circle' },
        { color: 'red', shape: 'triangle' }
      ]"
      :rows="['color']"
      :cols="['shape']"
    />
  </div>
</template>

<script setup>
import { VuePivottable } from './index.ts'
import 'vue-pivottable/dist/vue-pivottable.css'
</script>

<style scoped></style>
