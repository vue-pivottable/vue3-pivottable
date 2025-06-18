<template>
  <td
    class="pvtVals"
    :class="{ pvtText: $slots.aggregatorCell }"
  >
    <slot name="aggregatorCell">
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
          v-for="(_, i) in Array.from({ length: numValsAllowed })"
          :key="i"
          :options="valsOptions"
          :value="vals[i]"
          @update:value="(val) => updateVals(val, i)"
        />
      </template>
    </slot>
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VDropdown from './VDropdown.vue'
import type { AggregatorTemplate } from '@/helper/utilities'

const emit = defineEmits<{
  (event: 'update:aggregatorName', value: string): void
  (event: 'update:rowOrder', value: string): void
  (event: 'update:colOrder', value: string): void
  (event: 'update:vals', value: string[]): void
}>()

type OrderType = 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'

interface AggregatorCellProps {
  aggregatorItems?: Record<string, AggregatorTemplate>
  aggregatorName?: string
  rowOrder: OrderType
  colOrder: OrderType
  vals?: string[]
  attributeNames?: string[]
  hiddenFromAggregators?: string[]
}

const props = withDefaults(defineProps<AggregatorCellProps>(), {
  aggregatorItems: () => ({}),
  aggregatorName: 'Count',
  vals: () => [],
  attributeNames: () => [],
  hiddenFromAggregators: () => []
})

const sortIcons: Record<
  OrderType,
  { rowSymbol: string; colSymbol: string; next: OrderType }
> = {
  key_a_to_z: { rowSymbol: '↕', colSymbol: '↔', next: 'value_a_to_z' },
  value_a_to_z: { rowSymbol: '↓', colSymbol: '→', next: 'value_z_to_a' },
  value_z_to_a: { rowSymbol: '↑', colSymbol: '←', next: 'key_a_to_z' }
} as const

const aggregatorOptions = computed(() => Object.keys(props.aggregatorItems))
const valsOptions = computed(() =>
  props.attributeNames.filter(
    (item) => !props.hiddenFromAggregators.includes(item)
  )
)
const numValsAllowed = computed(() => {
  const aggregator = props.aggregatorItems[props.aggregatorName]
  if (!aggregator) return 0
  const aggregatorInstance = aggregator([])?.()
  return aggregatorInstance?.numInputs || 0
})

const currentRowSortIcon = computed(() => sortIcons[props.rowOrder].rowSymbol)
const currentColSortIcon = computed(() => sortIcons[props.colOrder].colSymbol)

const updateAggregatorName = (value: string) =>
  emit('update:aggregatorName', value)
const updateRowOrder = () =>
  emit('update:rowOrder', sortIcons[props.rowOrder].next)
const updateColOrder = () =>
  emit('update:colOrder', sortIcons[props.colOrder].next)
const updateVals = (val: string, i: number) => {
  const newVals = [...props.vals]
  newVals[i] = val
  emit('update:vals', newVals)
}
</script>
