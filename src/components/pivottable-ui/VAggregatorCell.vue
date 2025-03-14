<!-- aggregatorCell -->
<template>
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
                    :values="Object.keys(aggregatorItems)"
                    :value="aggregatorName"
                    @input="emitPropUpdater({ key: 'aggregatorName', value: $event.target.value})"
                >
                </VDropdown>
                <a
                    class="pvtRowOrder"
                    role="button"
                    @click="emitPropUpdater({ key: 'rowOrder', value: sortIcons[props.rowOrder].next})"
                >
                    {{ sortIcons[props.rowOrder].rowSymbol }}
                </a>
                <a
                    class="pvtColOrder"
                    role="button"
                    @click="emitPropUpdater({ key: 'colOrder', value: sortIcons[props.colOrder].next})"
                >
                    {{ sortIcons[props.colOrder].colSymbol }}
                </a>
            </div>
            <template v-if="numValsAllowed">
                <VDropdown
                    v-for="(item, i) in new Array(numValsAllowed).fill()"
                    :key="i"
                    :values="fetchValues"
                    :value="vals[i]"
                    @input="emitValSlice($event, i)"
                >
                </VDropdown>
            </template>
        </td>
    </template>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import VDropdown from './VDropdown'
import defaultProps from '../../helper/defaultProps'
import { aggregators } from './helper/utils'

const sortIcons = {
  key_a_to_z: { rowSymbol: '↕', colSymbol: '↔', next: 'value_a_to_z' },
  value_a_to_z: { rowSymbol: '↓', colSymbol: '→', next: 'value_z_to_a' },
  value_z_to_a: { rowSymbol: '↑', colSymbol: '←', next: 'key_a_to_z' }
}
const props = defineProps({
  propsData: {
    type: Object,
    default: () => {}
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
const emit = defineEmits(['update:propUpdater', 'update:valSlice'])

const aggregatorItems = computed(() => (defaultProps.aggregators) || aggregators)
const numValsAllowed = computed(() => aggregatorItems[props.aggregatorName]([])().numInputs || 0)
const fetchValues = computed(() => Object.keys(props.attrValues).filter(e => !props.hiddenAttributes.includes(e) && !props.hiddenFromAggregators.includes(e)))

const emitValSlice = (e, i) => { emit('update:valSlice', { key: i, value: e.target.value }) }
const emitPropUpdater = (updateObj) => emit('update:propUpdater', updateObj)
// const emitPropUpdaterRowOrder = () => emit('update:propUpdater', { key: 'rowOrder', value: sortIcons[props.rowOrder].next })
// const emitPropUpdaterColOrder = () => emit('update:propUpdater', { key: 'colOrder', value: sortIcons[props.colOrder].next })
</script>

// @input="(e) => emitPropUpdater({ key: 'aggregatorName', value: e.target.value})"
