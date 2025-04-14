<template>
  <table class="pvtUi">
    <slot name="colGroup" />
    <tbody>
      <tr>
        <VRendererCell
          :rendererItems="rendererItems"
          :rendererName="state.rendererName"
          @update:rendererName="onUpdateRendererName"
        />
        <VDragAndDropCell
          classes="pvtAxisContainer pvtUnused pvtHorizList"
          cellType="unused"
          :attributeNames="unusedAttrs"
          :valueFilter="state.valueFilter"
          :disabledFromDragDrop="state.disabledFromDragDrop"
          :hideFilterBoxOfUnusedAttrs="state.hideFilterBoxOfUnusedAttrs"
          @update:zIndexOfFilterBox="onMoveFilterBoxToTop"
          @update:unselectedFilterValues="onUpdateValueFilter"
          @update:openStatusOfFilterBox="onUpdateOpenStatus"
          @update:draggedAttribute="onDraggedAttribute"
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
            :aggregatorName="state.aggregatorName"
            :rowOrder="state.rowOrder"
            :colOrder="state.colOrder"
            :attributeNames="state.attributeNames"
            :hiddenFromAggregators="state.hiddenFromAggregators"
            :vals="state.vals"
            @update:aggregatorName="onUpdateAggregatorName"
          />
        </slot>

        <VDragAndDropCell
          classes="pvtAxisContainer pvtHorizList pvtCols"
          cellType="cols"
          :attributeNames="colAttrs"
          :valueFilter="state.valueFilter"
          :disabledFromDragDrop="state.disabledFromDragDrop"
          :hideFilterBoxOfUnusedAttrs="state.hideFilterBoxOfUnusedAttrs"
          @update:zIndexOfFilterBox="onMoveFilterBoxToTop"
          @update:unselectedFilterValues="onUpdateValueFilter"
          @update:openStatusOfFilterBox="onUpdateOpenStatus"
          @update:draggedAttribute="onDraggedAttribute"
        >
          <template v-slot:pvtAttr="props">
            <slot name="pvtAttr" v-bind="props" />
          </template>
        </VDragAndDropCell>
      </tr>
      <tr>
        <VDragAndDropCell
          classes="pvtAxisContainer pvtVertList pvtRows"
          cellType="rows"
          :attributeNames="rowAttrs"
          :valueFilter="state.valueFilter"
          :disabledFromDragDrop="state.disabledFromDragDrop"
          :hideFilterBoxOfUnusedAttrs="state.hideFilterBoxOfUnusedAttrs"
          @update:zIndexOfFilterBox="onMoveFilterBoxToTop"
          @update:unselectedFilterValues="onUpdateValueFilter"
          @update:openStatusOfFilterBox="onUpdateOpenStatus"
          @update:draggedAttribute="onDraggedAttribute"
        >
          <template v-slot:pvtAttr="props">
            <slot v-bind="props" name="pvtAttr" />
          </template>
        </VDragAndDropCell>
        <td class="pvtOutput">
          <slot name="outputSlot" :outputSlot="{ pivotData }">
            <VPivottable v-bind="state" />
          </slot>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h4>State</h4>
          rows: {{ state.rows }} <br>
          cols: {{ state.cols }} <br>
          aggregatorName: {{ state.aggregatorName }} <br>
          rendererName: {{ state.rendererName }} <br>
          vals: {{ state.vals }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import {
  defaultProps,
  PivotData,
  sortAs
} from '@/helper'
import VRendererCell from './VRendererCell.vue'
import VAggregatorCell from './VAggregatorCell.vue'
import VDragAndDropCell from './VDragAndDropCell.vue'
import { VPivottable } from '@/'
import { computed, ref, toRefs, watch } from 'vue'
import { usePropsState, usePivotDataProcessing } from '@/composables'
import TableRenderer from '../pivottable/renderer/index'

const props = defineProps({
  ...defaultProps,
  hiddenAttributes: {
    type: Array,
    default: () => []
  },
  hiddenFromAggregators: {
    type: Array,
    default: () => []
  },
  hiddenFromDragDrop: {
    type: Array,
    default: () => []
  },
  restrictedFromDragDrop: {
    type: Array,
    default: () => []
  },
  disabledFromDragDrop: {
    type: Array,
    default: () => []
  },
  menuLimit: {
    type: Number,
    default: 500
  },
  pivotModel: {
    type: Object,
    default: () => ({})
  },
  hideFilterBoxOfUnusedAttrs: {
    type: Boolean,
    default: false
  }
})
const pivotUiState = ref({
  unusedOrder: props.unusedAttrs,
  zIndices: {},
  maxZIndex: 1000,
  openDropdown: false,
  openStatus: {},
  attrValues: {},
  materializedInput: []
})
const propsRefs = toRefs(props)

const { state, updateState } = usePropsState(propsRefs)
const { allFilters } = usePivotDataProcessing(
  computed(() => props.data),
  {
    derivedAttributes: computed(() => props.derivedAttributes)
  }
)

const rendererItems = computed(() => Object.keys(state.value.renderers).length ? state.value.renderers : TableRenderer)
const aggregatorItems = computed(() => state.value.aggregators)
const rowAttrs = computed(() => {
  return state.value.rows.filter(
    e =>
      !state.value.hiddenAttributes.includes(e) &&
      !state.value.hiddenFromDragDrop.includes(e)
  )
})
const colAttrs = computed(() => {
  return state.value.cols.filter(
    e =>
      !state.value.hiddenAttributes.includes(e) &&
      !state.value.hiddenFromDragDrop.includes(e)
  )
})
const attributeNames = computed(() => {
  return Object.keys(allFilters.value).filter(e =>
    !state.value.hiddenAttributes.includes(e) &&
    !state.value.hiddenFromAggregators.includes(e)
  )
})
const unusedAttrs = computed(() => {
  return attributeNames.value
    .filter(
      e =>
        !state.value.rows.includes(e) &&
        !state.value.cols.includes(e) &&
        !state.value.hiddenAttributes.includes(e) &&
        !state.value.hiddenFromDragDrop.includes(e)
    )
    .sort(sortAs(state.value.unusedOrder))
})

const onMoveFilterBoxToTop = ({ attribute }) => {
  updateState('maxZIndex', state.value.maxZIndex++)
  updateState('zIndices', {
    ...state.value.zIndices,
    [attribute]: state.value.maxZIndex
  })
}
const onUpdateValueFilter = ({ attribute, valueFilter }) => {
  updateState('valueFilter', {
    ...state.value.valueFilter,
    [attribute]: valueFilter
  })
}
const onUpdateRendererName = (rendererName) => {
  updateState('rendererName', rendererName)
}
const onUpdateAggregatorName = (aggregatorName) => {
  updateState('aggregatorName', aggregatorName)
}
const onDraggedAttribute = ({ cellType, attributes }) => {
  updateState(cellType, attributes)
}
const onUpdateOpenStatus = ({ attribute, status }) => {
  updateState('openStatus', {
    ...state.value.openStatus,
    [attribute]: status
  })
}
const pivotData = computed(() => new PivotData(state.value))

watch(() => props.data, value => {
  updateState('unusedOrder', props.unusedAttrs)
})
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
