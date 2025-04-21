<template>
  <tr>
    <th
      v-for="(r, i) in rowAttrs"
      :key="`rowAttr${i}`"
      class="pvtAxisLabel"
    >
      {{ r }}
    </th>
    <th
      class="pvtTotalLabel"
      v-if="rowTotal || colAttrsLength !== 0"
    >
      {{ colAttrsLength === 0 && rowTotal ? localeStrings.totals : null }}
    </th>
  </tr>
</template>

<script setup>
defineProps({
  rowAttrs: {
    type: Array,
    required: true
  },
  rowTotal: {
    type: Boolean,
    required: true
  },
  colAttrsLength: {
    type: Number,
    required: true
  },
  localeStrings: {
    type: Object,
    required: true
  }
})
</script>
