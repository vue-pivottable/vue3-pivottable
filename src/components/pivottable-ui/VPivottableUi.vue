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
          :allFilters="allFilters"
          :valueFilter="state.valueFilter"
          :restrictedFromDragDrop="state.restrictedFromDragDrop"
          :hideFilterBoxOfUnusedAttributes="
            state.hideFilterBoxOfUnusedAttributes
          "
          :zIndices="pivotUiState.zIndices"
          :maxZIndex="pivotUiState.maxZIndex"
          :openStatus="pivotUiState.openStatus"
          @update:zIndexOfFilterBox="onMoveFilterBoxToTop"
          @update:unselectedFilterValues="onUpdateValueFilter"
          @update:openStatusOfFilterBox="onUpdateOpenStatus"
          @update:draggedAttribute="onDraggedAttribute"
        >
          <template v-slot:pvtAttr="props">
            <slot
              name="pvtAttr"
              v-bind="props"
            />
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
            :attributeNames="attributeNames"
            :hiddenFromAggregators="state.hiddenFromAggregators"
            :vals="state.vals"
            @update:aggregatorName="onUpdateAggregatorName"
            @update:rowOrder="onUpdateRowOrder"
            @update:colOrder="onUpdateColOrder"
            @update:vals="onUpdateVals"
          />
        </slot>

        <VDragAndDropCell
          classes="pvtAxisContainer pvtHorizList pvtCols"
          cellType="cols"
          :attributeNames="colAttrs"
          :allFilters="allFilters"
          :valueFilter="state.valueFilter"
          :restrictedFromDragDrop="state.restrictedFromDragDrop"
          :hideFilterBoxOfUnusedAttributes="
            state.hideFilterBoxOfUnusedAttributes
          "
          :zIndices="pivotUiState.zIndices"
          :maxZIndex="pivotUiState.maxZIndex"
          :openStatus="pivotUiState.openStatus"
          @update:zIndexOfFilterBox="onMoveFilterBoxToTop"
          @update:unselectedFilterValues="onUpdateValueFilter"
          @update:openStatusOfFilterBox="onUpdateOpenStatus"
          @update:draggedAttribute="onDraggedAttribute"
        >
          <template v-slot:pvtAttr="props">
            <slot
              name="pvtAttr"
              v-bind="props"
            />
          </template>
        </VDragAndDropCell>
      </tr>
      <tr>
        <VDragAndDropCell
          classes="pvtAxisContainer pvtVertList pvtRows"
          cellType="rows"
          :attributeNames="rowAttrs"
          :allFilters="allFilters"
          :valueFilter="state.valueFilter"
          :restrictedFromDragDrop="state.restrictedFromDragDrop"
          :hideFilterBoxOfUnusedAttributes="
            state.hideFilterBoxOfUnusedAttributes
          "
          :zIndices="pivotUiState.zIndices"
          :maxZIndex="pivotUiState.maxZIndex"
          :openStatus="pivotUiState.openStatus"
          @update:zIndexOfFilterBox="onMoveFilterBoxToTop"
          @update:unselectedFilterValues="onUpdateValueFilter"
          @update:openStatusOfFilterBox="onUpdateOpenStatus"
          @update:draggedAttribute="onDraggedAttribute"
        >
          <template v-slot:pvtAttr="props">
            <slot
              v-bind="props"
              name="pvtAttr"
            />
          </template>
        </VDragAndDropCell>
        <td class="pvtOutput">
          <slot
            name="outputSlot"
            :outputSlot="{ pivotData }"
          >
            <VPivottable v-bind="pivotProps" />
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { defaultProps, PivotData, sortAs } from '@/helper'
import VRendererCell from './VRendererCell.vue'
import VAggregatorCell from './VAggregatorCell.vue'
import VDragAndDropCell from './VDragAndDropCell.vue'
import VPivottable from '../pivottable/VPivottable.vue'
import TableRenderer from '../pivottable/renderer/index'
import { computed, watch } from 'vue'
import {
  usePropsState,
  useMaterializeInput,
  usePivotUiState,
  provideFilterBox
} from '@/composables'

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
  menuLimit: {
    type: Number,
    default: 500
  },
  pivotModel: {
    type: Object,
    default: () => ({})
  },
  hideFilterBoxOfUnusedAttributes: {
    type: Boolean,
    default: false
  }
})
const {
  state,
  localeStrings,
  updateMultiple,
  onUpdateValueFilter,
  onUpdateRendererName,
  onUpdateAggregatorName,
  onDraggedAttribute,
  onUpdateRowOrder,
  onUpdateColOrder,
  onUpdateVals
} = usePropsState(props)

const {
  state: pivotUiState,
  onMoveFilterBoxToTop,
  onUpdateOpenStatus,
  onUpdateUnusedOrder
} = usePivotUiState()

const { allFilters, materializedInput } = useMaterializeInput(
  computed(() => props.data),
  {
    derivedAttributes: computed(() => props.derivedAttributes)
  }
)

const rendererItems = computed(() =>
  Object.keys(state.renderers).length ? state.renderers : TableRenderer
)
const aggregatorItems = computed(() => state.aggregators)
const rowAttrs = computed(() => {
  return state.rows.filter(
    (e) =>
      !state.hiddenAttributes.includes(e) &&
      !state.hiddenFromDragDrop.includes(e)
  )
})
const colAttrs = computed(() => {
  return state.cols.filter(
    (e) =>
      !state.hiddenAttributes.includes(e) &&
      !state.hiddenFromDragDrop.includes(e)
  )
})
const attributeNames = computed(() => {
  return Object.keys(allFilters.value).filter(
    (e) =>
      !state.hiddenAttributes.includes(e) &&
      !state.hiddenFromAggregators.includes(e)
  )
})
const unusedAttrs = computed(() => {
  return attributeNames.value
    .filter(
      (e) =>
        !state.rows.includes(e) &&
        !state.cols.includes(e) &&
        !state.hiddenAttributes.includes(e) &&
        !state.hiddenFromDragDrop.includes(e)
    )
    .sort(sortAs(state.unusedOrder))
})

const pivotData = computed(() => new PivotData(state))
const pivotProps = computed(() => ({
  data: state.data,
  aggregators: state.aggregators,
  aggregatorName: state.aggregatorName,
  heatmapMode: state.heatmapMode,
  tableOptions: state.tableOptions,
  renderers: rendererItems.value,
  rendererName: state.rendererName,
  locale: state.locale,
  languagePack: state.languagePack,
  showRowTotal: state.showRowTotal,
  showColTotal: state.showColTotal,
  cols: state.cols,
  rows: state.rows,
  vals: state.vals,
  attributes: state.attributes,
  valueFilter: state.valueFilter,
  sorters: state.sorters,
  derivedAttributes: state.derivedAttributes,
  rowOrder: state.rowOrder,
  colOrder: state.colOrder,
  tableMaxWidth: state.tableMaxWidth,
  localeStrings: localeStrings.value
}))

onUpdateUnusedOrder(props.unusedAttrs)

provideFilterBox(props)

watch(
  [allFilters, materializedInput],
  () => {
    updateMultiple({
      ...state,
      allFilters: allFilters.value,
      materializedInput: materializedInput.value
    })
  },
  {
    deep: true
  }
)
</script>
