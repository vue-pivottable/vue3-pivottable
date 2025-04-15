<template>
  <th
    class="pvtTotalLabel"
    :rowSpan="colAttrsLength + (rowAttrsLength === 0 ? 0 : 1)"
  >
    {{ localeStrings.totals }}
  </th>
</template>

<script setup>
defineProps({
  colAttrsLength: {
    type: Number,
    required: true
  },
  rowAttrsLength: {
    type: Number,
    required: true
  },
  localeStrings: {
    type: Object,
    required: true
  }
})
</script>
