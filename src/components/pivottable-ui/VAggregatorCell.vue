<template>
  <td
      v-if="slots.aggregatorCell"
      class="pvtVals pvtText"
  >
      <slot name="aggregatorCell"></slot>
  </td>
  <td
      v-else
      class="pvtVals"
  >
      <div>
          <VDropdown
              :values="aggregatorItemsKeys"
              :value="aggregatorName"
              @update:value="emitPropUpdater({ key: 'aggregatorName', value: $event.target?.value})"
          >
          </VDropdown>
          <a
              class="pvtRowOrder"
              role="button"
              @click="emitPropUpdater(nextRowSortIconObj)"
          >
              {{ currentRowSortIcon }}
          </a>
          <a
              class="pvtColOrder"
              role="button"
              @click="emitPropUpdater(nextColSortIconObj)"
          >
              {{ currentColSortIcon }}
          </a>
      </div>
      <template v-if="numValsAllowed">
          <VDropdown
              v-for="(item, i) in new Array(numValsAllowed).fill()"
              :key="i"
              :values="fetchValues"
              :value="vals[i]"
              @update:value="emitValSlice($event, i)"
          >
          </VDropdown>
      </template>
  </td>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import VDropdown from './VDropdown.vue'
import { aggregators } from '../../helper'

const sortIcons = {
  key_a_to_z: { rowSymbol: '↕', colSymbol: '↔', next: 'value_a_to_z' },
  value_a_to_z: { rowSymbol: '↓', colSymbol: '→', next: 'value_z_to_a' },
  value_z_to_a: { rowSymbol: '↑', colSymbol: '←', next: 'key_a_to_z' }
}

const props = defineProps({
  aggregatorName: {
    type: String,
    default: 'Count'
  },
  rowOrder: {
    type: String,
    default: 'key_a_to_z',
    validator: function (value) {
      return ['key_a_to_z', 'value_a_to_z', 'value_z_to_a'].indexOf(value) !== -1
    }
  },
  colOrder: {
    type: String,
    default: 'key_a_to_z',
    validator: function (value) {
      return ['key_a_to_z', 'value_a_to_z', 'value_z_to_a'].indexOf(value) !== -1
    }
  },
  vals: {
    type: Array,
    default: function () {
      return []
    }
  },
  attrValues: {
    type: Object,
    default: () => {}
  },
  hiddenAttributes: {
    type: Array,
    default: () => []
  },
  hiddenFromAggregators: {
    type: Array,
    default: () => []
  }
})
const slots = useSlots()
const emit = defineEmits(['update:propUpdater', 'update:valsSplice'])

const numValsAllowed = computed(() => aggregatorItems.value[props.aggregatorName]([])().numInputs || 0)
const fetchValues = computed(() => Object.keys(props.attrValues).filter(e => !props.hiddenAttributes.includes(e) && !props.hiddenFromAggregators.includes(e)))

const aggregatorItems = computed(() => (props.aggregators) || aggregators)
const aggregatorItemsKeys = computed(() => Object.keys(aggregatorItems.value))

const currentRowSortIcon = computed(() => sortIcons[props.rowOrder].rowSymbol)
const currentColSortIcon = computed(() => sortIcons[props.colOrder].colSymbol)
const nextRowSortIconObj = computed(() => ({ key: 'rowOrder', value: sortIcons[props.rowOrder].next }))
const nextColSortIconObj = computed(() => ({ key: 'colOrder', value: sortIcons[props.colOrder].next }))

const emitValSlice = (e, i) => { emit('update:valsSplice', { key: i, value: e.target.value }) }
const emitPropUpdater = (updateObj) => emit('update:propUpdater', updateObj)
</script>
