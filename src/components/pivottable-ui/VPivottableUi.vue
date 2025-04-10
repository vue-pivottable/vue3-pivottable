<template>
  <table class="pvtUi">
    <slot name="colGroup" />
    <tbody>
      <tr>
        <VRendererCell
          :rendererItems="rendererItems"
          :rendererName="rendererName"
        />
        <VDragAndDropCell
          cellType="unused"
          :attributeNames="unusedAttrs"
          classes="pvtAxisContainer pvtUnused pvtHorizList"
          :restrictedFromDragDrop="[]"
          :disabledFromDragDrop="[]"
          :zIndices="{}"
          :openStatus="{}"
          :hideFilterBoxOfUnusedAttributes="false"
          :valueFilter="{}"
        >
          <template v-slot:pvtAttr="props">
            <slot name="pvtAttr" v-bind="props" />
          </template>
        </VDragAndDropCell>
      </tr>
      <tr>
        <slot name="aggregatorCell">
          <VAggregatorCell
            :aggregatorItems="aggregatorItems"
            :aggregatorName="newProps.aggregatorName"
            :rowOrder="newProps.rowOrder"
            :colOrder="newProps.colOrder"
            :vals="newProps.vals"
            :attrValues="newProps.attrValues"
            :hiddenAttributes="newProps.hiddenAttributes"
            :hiddenFromAggregators="newProps.hiddenFromAggregators"
            :numValsAllowed="numValsAllowed"
            @update:propUpdater="propUpdater"
            @update:valSlice="onValSlice"
          />
        </slot>

        <VDragAndDropCell
          cellType="col"
          :attributeNames="colAttrs"
          classes="pvtAxisContainer pvtHorizList pvtCols"
          :restrictedFromDragDrop="[]"
          :disabledFromDragDrop="[]"
          :zIndices="{}"
          :openStatus="{}"
          :valueFilter="{}"
        >
          <template v-slot:pvtAttr="props">
            <slot name="pvtAttr" v-bind="props" />
          </template>
        </VDragAndDropCell>
      </tr>
      <tr>
        <VDragAndDropCell
          cellType="row"
          :attributeNames="rowAttrs"
          classes="pvtAxisContainer pvtVertList pvtRows"
          :restrictedFromDragDrop="[]"
          :disabledFromDragDrop="[]"
          :zIndices="{}"
          :openStatus="{}"
          :valueFilter="{}"
        >
          <template v-slot:pvtAttr="props">
            <slot v-bind="props" name="pvtAttr" />
          </template>
          <!-- <slot name="pvtAttr" v-bind="$props"></slot> -->
        </VDragAndDropCell>
        <td class="pvtOutput">
          <slot name="outputSlot" :outputSlot="{ pivotData }">
            <VPivottable v-bind="newProps" />
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import {
  defaultProps,
  PivotData,
  aggregators,
  sortAs,
  getSort
} from '../../helper'
import VRendererCell from './VRendererCell.vue'
import VAggregatorCell from './VAggregatorCell.vue'
import VDragAndDropCell from './VDragAndDropCell.vue'
import { VPivottable } from '../'
import { computed, ref, watch } from 'vue'
import { usePropsData } from '../../composables'
import TableRenderer from '../pivottable/renderer'
const props = defineProps({
  ...defaultProps,
  async: {
    type: Boolean,
    default: false
  },
  hiddenAttributes: {
    type: Array,
    default: function () {
      return []
    }
  },
  hiddenFromAggregators: {
    type: Array,
    default: function () {
      return []
    }
  },
  hiddenFromDragDrop: {
    type: Array,
    default: function () {
      return []
    }
  },
  sortonlyFromDragDrop: {
    type: Array,
    default: function () {
      return []
    }
  },
  disabledFromDragDrop: {
    type: Array,
    default: function () {
      return []
    }
  },
  menuLimit: {
    type: Number,
    default: 500
  },
  config: {
    type: Object,
    default: function () {
      return {}
    }
  }
})
const state = ref({
  unusedOrder: props.unusedAttrs,
  zIndices: {},
  maxZIndex: 1000,
  openDropdown: false,
  openStatus: {},
  attrValues: {},
  materializedInput: []
})
const rendererItems = computed(() => props.renderers || TableRenderer)
const { newProps, setProps, propUpdater } = usePropsData(props)
const rowAttrs = computed(() => {
  return newProps.value.rows.filter(
    e =>
      !newProps.value.hiddenAttributes.includes(e) &&
      !newProps.value.hiddenFromDragDrop.includes(e)
  )
})

const colAttrs = computed(() => {
  return newProps.value.cols.filter(
    e =>
      !newProps.value.hiddenAttributes.includes(e) &&
      !newProps.value.hiddenFromDragDrop.includes(e)
  )
})
const unusedAttrs = computed(() => {
  return newProps.value.attributes
    .filter(
      e =>
        !newProps.rows.includes(e) &&
        !newProps.value.cols.includes(e) &&
        !newProps.value.hiddenAttributes.includes(e) &&
        !newProps.value.hiddenFromDragDrop.includes(e)
    )
    .sort(sortAs(newProps.value.unusedOrder))
})
const aggregatorItems = computed(
  () => newProps.value.aggregators || aggregators
)
const numValsAllowed = computed(
  () =>
    aggregatorItems.value[newProps.value.aggregatorName]([])().numInputs || 0
)
const materializeInput = nextData => {
  if (props.data === nextData) {
    return
  }
  const newState = {
    data: nextData,
    attrValues: {},
    materializedInput: []
  }

  let recordsProcessed = 0
  PivotData.forEachRecord(
    newState.data,
    props.derivedAttributes,
    function (record) {
      newState.materializedInput.push(record)
      for (const attr of Object.keys(record)) {
        if (!(attr in newState.attrValues)) {
          newState.attrValues[attr] = {}
          if (recordsProcessed > 0) {
            newState.attrValues[attr].null = recordsProcessed
          }
        }
      }
      for (const attr in newState.attrValues) {
        const value = attr in record ? record[attr] : 'null'
        if (!(value in newState.attrValues[attr])) {
          newState.attrValues[attr][value] = 0
        }
        newState.attrValues[attr][value]++
      }
      recordsProcessed++
    }
  )
  state.value = newState
  setProps({
    ...newProps.value,
    ...state.value
  })
}
const onUpdateValueFilter = ({ attribute, valueFilter }) => {
  newProps.value.valueFilter[attribute] = valueFilter
}
const onMoveFilterBoxToTop = ({ attribute }) => {
  newProps.value.maxZIndex += 1
  newProps.value.zIndices[attribute] = newProps.value.maxZIndex + 1
}
const onNoFilterBox = () => this.$emit('no:filterbox')
const onValSlice = (e, i) => newProps.value.vals.splice(i, 1, e.target.value)

const pivotData = new PivotData(newProps.value)

watch(
  () => props.data,
  value => {
    state.value.unusedOrder = props.unusedAttrs
    materializeInput(value)
  },
  {
    immediate: false
  }
)

const updateFilters = ({ cellType, filters }) => {
  console.log('updated cell type', cellType)
  console.log('updated filter items', filters)
}
</script>

<style>
.pvtUi {
  border-collapse: collapse;
  width: 100%;
}

.pvtUi td,
.pvtUi th {
  border: 1px solid black;
  padding: 8px;
}
</style>
