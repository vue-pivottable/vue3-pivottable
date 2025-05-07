<template>
  <td
    v-if="slots.aggregatorCell"
    class="pvtVals pvtText"
  >
    <slot name="aggregatorCell" />
  </td>
  <td
    v-else
    class="pvtVals"
  >
    <div>
      <VDropdown
        :options="aggregatorOptions"
        :value="aggregatorName"
        @update:value="updateAggregatorName"
      />
      <a
        class="pvtRowOrder"
        role="button"
        @click="updateRowOrder"
      >
        {{ currentRowSortIcon }}
      </a>
      <a
        class="pvtColOrder"
        role="button"
        @click="updateColOrder"
      >
        {{ currentColSortIcon }}
      </a>
    </div>
    <template v-if="numValsAllowed">
      <VDropdown
        v-for="(item, i) in new Array(numValsAllowed).fill()"
        :key="i"
        :options="valsOptions"
        :value="vals[i]"
        @update:value="(val) => updateVals(val, i)"
      />
    </template>
  </td>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import VDropdown from './VDropdown.vue'
const slots = useSlots()
const emit = defineEmits([
  'update:aggregatorName',
  'update:rowOrder',
  'update:colOrder',
  'update:vals'
])
const props = defineProps({
  aggregatorItems: {
    type: Object,
    default: () => ({})
  },
  aggregatorName: {
    type: String,
    default: 'Count'
  },
  rowOrder: {
    type: String,
    default: 'key_a_to_z',
    validator: function (value) {
      return (
        ['key_a_to_z', 'value_a_to_z', 'value_z_to_a'].indexOf(value) !== -1
      )
    }
  },
  colOrder: {
    type: String,
    default: 'key_a_to_z',
    validator: function (value) {
      return (
        ['key_a_to_z', 'value_a_to_z', 'value_z_to_a'].indexOf(value) !== -1
      )
    }
  },
  vals: {
    type: Array,
    default: function () {
      return []
    }
  },
  attributeNames: {
    type: Array,
    default: () => []
  },
  hiddenFromAggregators: {
    type: Array,
    default: () => []
  }
})
const sortIcons = {
  key_a_to_z: { rowSymbol: '↕', colSymbol: '↔', next: 'value_a_to_z' },
  value_a_to_z: { rowSymbol: '↓', colSymbol: '→', next: 'value_z_to_a' },
  value_z_to_a: { rowSymbol: '↑', colSymbol: '←', next: 'key_a_to_z' }
}
const aggregatorOptions = computed(() => Object.keys(props.aggregatorItems))
const valsOptions = computed(() =>
  props.attributeNames.filter(
    (item) => !props.hiddenFromAggregators.includes(item)
  )
)
const numValsAllowed = computed(
  () => props.aggregatorItems[props.aggregatorName]([])().numInputs || 0
)
const currentRowSortIcon = computed(() => sortIcons[props.rowOrder].rowSymbol)
const currentColSortIcon = computed(() => sortIcons[props.colOrder].colSymbol)
const updateAggregatorName = (value) => emit('update:aggregatorName', value)
const updateRowOrder = (value) =>
  emit('update:rowOrder', sortIcons[props.rowOrder].next)
const updateColOrder = (value) =>
  emit('update:colOrder', sortIcons[props.colOrder].next)
const updateVals = (val, i) => {
  const newVals = [...props.vals]
  newVals[i] = val
  emit('update:vals', newVals)
}
</script>
