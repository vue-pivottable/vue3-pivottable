<template>
  <table class="pvtUi">
    <slot name="colGroup" />
    <tbody>
      <tr>
        <VRendererCell
          :renderer-items="rendererItems"
          :renderer-name="state.rendererName"
          @update:renderer-name="onUpdateRendererName"
        >
          <template
            v-if="$slots.rendererCell"
            #rendererCell
          >
            <slot name="rendererCell" />
          </template>
        </VRendererCell>

        <VDragAndDropCell
          classes="pvtAxisContainer pvtUnused pvtHorizList"
          cell-type="unused"
          :attributeNames="unusedAttrs"
          :all-filters="allFilters"
          :value-filter="state.valueFilter"
          :restricted-from-drag-drop="state.restrictedFromDragDrop"
          :hide-filter-box-of-unused-attributes="
            state.hideFilterBoxOfUnusedAttributes
          "
          :z-indices="pivotUiState.zIndices"
          :max-z-index="pivotUiState.maxZIndex"
          :open-status="pivotUiState.openStatus"
          @update:z-index-of-filter-box="onMoveFilterBoxToTop"
          @update:unselected-filter-values="onUpdateValueFilter"
          @update:open-status-of-filter-box="onUpdateOpenStatus"
          @update:dragged-attribute="onDraggedAttribute"
        />
      </tr>
      <tr>
        <VAggregatorCell
          :aggregator-items="aggregatorItems"
          :aggregator-name="state.aggregatorName"
          :row-order="state.rowOrder"
          :col-order="state.colOrder"
          :attributeNames="attributeNames"
          :hidden-from-aggregators="state.hiddenFromAggregators"
          :vals="state.vals"
          @update:aggregator-name="onUpdateAggregatorName"
          @update:row-order="onUpdateRowOrder"
          @update:col-order="onUpdateColOrder"
          @update:vals="onUpdateVals"
        >
          <template
            v-if="$slots.aggregatorCell"
            #aggregatorCell
          >
            <slot name="aggregatorCell" />
          </template>
        </VAggregatorCell>

        <VDragAndDropCell
          classes="pvtAxisContainer pvtHorizList pvtCols"
          cell-type="cols"
          :attributeNames="colAttrs"
          :all-filters="allFilters"
          :value-filter="state.valueFilter"
          :restricted-from-drag-drop="state.restrictedFromDragDrop"
          :hide-filter-box-of-unused-attributes="
            state.hideFilterBoxOfUnusedAttributes
          "
          :z-indices="pivotUiState.zIndices"
          :max-z-index="pivotUiState.maxZIndex"
          :open-status="pivotUiState.openStatus"
          @update:z-index-of-filter-box="onMoveFilterBoxToTop"
          @update:unselected-filter-values="onUpdateValueFilter"
          @update:open-status-of-filter-box="onUpdateOpenStatus"
          @update:dragged-attribute="onDraggedAttribute"
        >
          <template
            v-if="$slots.pvtAttr"
            #pvtAttr="propsValue"
          >
            <slot
              name="pvtAttr"
              v-bind="propsValue"
            />
          </template>
        </VDragAndDropCell>
      </tr>
      <tr>
        <VDragAndDropCell
          classes="pvtAxisContainer pvtVertList pvtRows"
          cell-type="rows"
          :attributeNames="rowAttrs"
          :all-filters="allFilters"
          :value-filter="state.valueFilter"
          :restricted-from-drag-drop="state.restrictedFromDragDrop"
          :hide-filter-box-of-unused-attributes="
            state.hideFilterBoxOfUnusedAttributes
          "
          :z-indices="pivotUiState.zIndices"
          :max-z-index="pivotUiState.maxZIndex"
          :open-status="pivotUiState.openStatus"
          @update:z-index-of-filter-box="onMoveFilterBoxToTop"
          @update:unselected-filter-values="onUpdateValueFilter"
          @update:open-status-of-filter-box="onUpdateOpenStatus"
          @update:dragged-attribute="onDraggedAttribute"
        >
          <template #pvtAttr="propsValue">
            <slot
              v-bind="propsValue"
              name="pvtAttr"
            />
          </template>
        </VDragAndDropCell>
        <td class="pvtOutput">
          <template v-if="$slots.outputSlot">
            <slot
              name="outputSlot"
              :output-slot="{ pivotData }"
            />
          </template>
          <template v-else-if="$slots.output">
            <slot name="output" />
          </template>
          <template v-else>
            <VPivottable v-bind="pivotProps" />
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { aggregators, PivotData, sortAs , locales } from '@/helper'
import VRendererCell from './VRendererCell.vue'
import VAggregatorCell from './VAggregatorCell.vue'
import VDragAndDropCell from './VDragAndDropCell.vue'
import VPivottable from '../pivottable/VPivottable.vue'
import { computed, watch, shallowRef, watchEffect, onUnmounted } from 'vue'
import {
  usePropsState,
  useMaterializeInput,
  usePivotUiState,
  provideFilterBox
} from '@/composables'
import { DefaultPropsType } from '@/types'

const props = withDefaults(
  defineProps<
    DefaultPropsType & {
      hiddenAttributes?: string[]
      hiddenFromAggregators?: string[]
      hiddenFromDragDrop?: string[]
      restrictedFromDragDrop?: string[]
      menuLimit?: number
      pivotModel?: any
      hideFilterBoxOfUnusedAttributes?: boolean
    }
  >(),
  {
    aggregators: () => aggregators,
    hiddenAttributes: () => [],
    hiddenFromAggregators: () => [],
    pivotModel: () => ({}),
    hiddenFromDragDrop: () => [],
    restrictedFromDragDrop: () => [],
    menuLimit: 500,
    hideFilterBoxOfUnusedAttributes: false,
    rowOrder: 'key_a_to_z',
    colOrder: 'key_a_to_z',
    languagePack: () => locales,
    locale: 'en'
  }
)

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
  Object.keys(state.renderers).length ? state.renderers : {}
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
    .sort(sortAs(pivotUiState.unusedOrder))
})

// Use shallowRef instead of computed to prevent creating new PivotData instances on every access
const pivotData = shallowRef(new PivotData(state))

// Update pivotData when state changes, and clean up the watcher
const stopWatcher = watchEffect(() => {
  // Clean up old PivotData if exists
  const oldPivotData = pivotData.value
  pivotData.value = new PivotData(state)
  
  // Clear old data references
  if (oldPivotData) {
    oldPivotData.tree = {}
    oldPivotData.rowKeys = []
    oldPivotData.colKeys = []
    oldPivotData.rowTotals = {}
    oldPivotData.colTotals = {}
    oldPivotData.filteredData = []
  }
})

// Clean up on unmount
onUnmounted(() => {
  stopWatcher()
  if (pivotData.value) {
    pivotData.value.tree = {}
    pivotData.value.rowKeys = []
    pivotData.value.colKeys = []
    pivotData.value.rowTotals = {}
    pivotData.value.colTotals = {}
    pivotData.value.filteredData = []
  }
})
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
  localeStrings: localeStrings.value,
  menuLimit: props.menuLimit
}))

onUpdateUnusedOrder(unusedAttrs.value)

provideFilterBox(pivotProps.value)

// Remove deep watch to prevent memory leak
// Deep watch creates thousands of property watchers in Vue 3
watch(
  [allFilters, materializedInput],
  () => {
    // Only update the changed properties, not the entire state
    updateMultiple({
      allFilters: allFilters.value,
      materializedInput: materializedInput.value,
      data: materializedInput.value  // Ensure data is also updated
    })
  },
  {
    immediate: true  // Add immediate to ensure initial update
    // Removed deep: true - this was causing 80% of memory leak
  }
)
</script>
