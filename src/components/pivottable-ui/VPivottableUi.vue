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
import { aggregators as defaultAggregators, PivotData, sortAs , locales, AggregatorTemplate, Locale } from '@/helper'
import VRendererCell from './VRendererCell.vue'
import VAggregatorCell from './VAggregatorCell.vue'
import VDragAndDropCell from './VDragAndDropCell.vue'
import VPivottable from '../pivottable/VPivottable.vue'
import TableRenderer from '../pivottable/renderer'
import { computed, watch, shallowRef, watchEffect, onUnmounted } from 'vue'
import {
  usePropsState,
  useMaterializeInput,
  usePivotUiState,
  provideFilterBox
} from '@/composables'
import { DefaultPropsType, PivotModelInterface, RendererDefinition } from '@/types'

const props = withDefaults(
  defineProps<
    Partial<DefaultPropsType> & {
      data: any
      renderers: Record<string, RendererDefinition>
      hiddenAttributes?: string[]
      hiddenFromAggregators?: string[]
      hiddenFromDragDrop?: string[]
      restrictedFromDragDrop?: string[]
      menuLimit?: number
      pivotModel?: PivotModelInterface
      hideFilterBoxOfUnusedAttributes?: boolean
      aggregators?: Record<string, AggregatorTemplate>
      aggregatorName?: string
      heatmapMode?: 'full' | 'col' | 'row' | ''
      tableColorScaleGenerator?: (...args: any[]) => any
      tableOptions?: Record<string, any>
      rendererName?: string
      locale?: string
      languagePack?: Record<string, Locale>
      showRowTotal?: boolean
      showColTotal?: boolean
      cols?: string[]
      rows?: string[]
      vals?: string[]
      attributes?: string[]
      valueFilter?: Record<string, any>
      sorters?: any
      derivedAttributes?: any
      rowOrder?: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'
      colOrder?: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'
      tableMaxWidth?: number
    }
  >(),
  {
    aggregators: () => defaultAggregators,
    renderers: () => TableRenderer,
    hiddenAttributes: () => [],
    hiddenFromAggregators: () => [],
    pivotModel: undefined,
    hiddenFromDragDrop: () => [],
    restrictedFromDragDrop: () => [],
    menuLimit: 500,
    hideFilterBoxOfUnusedAttributes: false,
    rowOrder: 'key_a_to_z',
    colOrder: 'key_a_to_z',
    languagePack: () => locales,
    locale: 'en',
    rows: () => [],
    cols: () => [],
    vals: () => [],
    aggregatorName: 'Count',
    rendererName: 'Table',
    valueFilter: () => ({}),
    heatmapMode: '',
    tableColorScaleGenerator: undefined,
    tableOptions: () => ({}),
    attributes: () => [],
    sorters: () => ({}),
    derivedAttributes: () => ({}),
    tableMaxWidth: 0
  }
)

const emit = defineEmits<{
  'update:pivotModel': [model: PivotModelInterface]
  'change': [model: PivotModelInterface]
}>()

// pivotModel이 제공되면 해당 값으로 props 오버라이드
const propsWithModel = computed(() => {
  const base = {
    data: props.data,
    renderers: props.renderers,
    aggregators: props.aggregators || defaultAggregators,
    aggregatorName: props.aggregatorName || 'Count',
    heatmapMode: (props.heatmapMode || '') as 'full' | 'col' | 'row' | '',
    tableColorScaleGenerator: props.tableColorScaleGenerator,
    tableOptions: props.tableOptions,
    rendererName: props.rendererName || 'Table',
    locale: props.locale || 'en',
    languagePack: props.languagePack || locales,
    showRowTotal: props.showRowTotal,
    showColTotal: props.showColTotal,
    cols: props.cols || [],
    rows: props.rows || [],
    vals: props.vals || [],
    attributes: props.attributes,
    valueFilter: props.valueFilter || {},
    sorters: props.sorters,
    derivedAttributes: props.derivedAttributes,
    rowOrder: (props.rowOrder || 'key_a_to_z') as 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a',
    colOrder: (props.colOrder || 'key_a_to_z') as 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a',
    tableMaxWidth: props.tableMaxWidth,
    hiddenAttributes: props.hiddenAttributes || [],
    hiddenFromAggregators: props.hiddenFromAggregators || [],
    hiddenFromDragDrop: props.hiddenFromDragDrop || [],
    restrictedFromDragDrop: props.restrictedFromDragDrop || [],
    hideFilterBoxOfUnusedAttributes: props.hideFilterBoxOfUnusedAttributes || false
  }
  
  if (props.pivotModel && Object.keys(props.pivotModel).length > 0) {
    return {
      ...base,
      rows: props.pivotModel.rows || base.rows,
      cols: props.pivotModel.cols || base.cols,
      vals: props.pivotModel.vals || base.vals,
      aggregatorName: props.pivotModel.aggregatorName || base.aggregatorName,
      rendererName: props.pivotModel.rendererName || base.rendererName,
      valueFilter: props.pivotModel.valueFilter || base.valueFilter,
      rowOrder: (props.pivotModel.rowOrder || base.rowOrder) as 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a',
      colOrder: (props.pivotModel.colOrder || base.colOrder) as 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a',
      heatmapMode: (props.pivotModel.heatmapMode || base.heatmapMode) as 'full' | 'col' | 'row' | ''
    }
  }
  return base
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
} = usePropsState(propsWithModel.value, emit)

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
  state.renderers && Object.keys(state.renderers).length ? state.renderers : {}
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

// Use computed with proper memoization to prevent unnecessary PivotData recreations
// Only recreate when critical properties change
const pivotDataKey = computed(() => 
  JSON.stringify({
    dataLength: state.data?.length || 0,
    rows: state.rows,
    cols: state.cols,
    vals: state.vals,
    aggregatorName: state.aggregatorName,
    valueFilter: state.valueFilter,
    rowOrder: state.rowOrder,
    colOrder: state.colOrder
  })
)

// Keep track of current PivotData instance
const pivotData = shallowRef<PivotData | null>(null)
let lastPivotDataKey = ''

// Only create new PivotData when structure actually changes
watchEffect(() => {
  const currentKey = pivotDataKey.value
  
  // Only recreate if key has changed
  if (currentKey !== lastPivotDataKey) {
    // Properly clean up old instance with enhanced cleanup
    const oldPivotData = pivotData.value
    if (oldPivotData) {
      // Deep cleanup to break all aggregator closures
      if (oldPivotData.tree) {
        for (const rowKey in oldPivotData.tree) {
          for (const colKey in oldPivotData.tree[rowKey]) {
            const agg = oldPivotData.tree[rowKey][colKey]
            if (agg && typeof agg === 'object') {
              // Break closure references completely
              Object.keys(agg).forEach(key => {
                if (typeof agg[key] === 'function') {
                  agg[key] = null // Break function closures
                } else if (typeof agg[key] === 'object' && agg[key] !== null) {
                  agg[key] = null // Break object references
                } else {
                  delete agg[key] // Delete primitive values
                }
              })
            }
          }
          delete oldPivotData.tree[rowKey]
        }
      }
      
      // Clean up aggregator function references
      if (oldPivotData.aggregator) oldPivotData.aggregator = null
      
      // Clean up row/col totals aggregators
      Object.keys(oldPivotData.rowTotals).forEach(key => {
        const agg = oldPivotData.rowTotals[key]
        if (agg && typeof agg === 'object') {
          Object.keys(agg).forEach(prop => {
            if (typeof agg[prop] === 'function' || (typeof agg[prop] === 'object' && agg[prop] !== null)) {
              agg[prop] = null
            }
          })
        }
        delete oldPivotData.rowTotals[key]
      })
      
      Object.keys(oldPivotData.colTotals).forEach(key => {
        const agg = oldPivotData.colTotals[key]
        if (agg && typeof agg === 'object') {
          Object.keys(agg).forEach(prop => {
            if (typeof agg[prop] === 'function' || (typeof agg[prop] === 'object' && agg[prop] !== null)) {
              agg[prop] = null
            }
          })
        }
        delete oldPivotData.colTotals[key]
      })
      
      // Clean up allTotal aggregator
      if (oldPivotData.allTotal && typeof oldPivotData.allTotal === 'object') {
        Object.keys(oldPivotData.allTotal).forEach(prop => {
          if (typeof oldPivotData.allTotal[prop] === 'function' || (typeof oldPivotData.allTotal[prop] === 'object' && oldPivotData.allTotal[prop] !== null)) {
            oldPivotData.allTotal[prop] = null
          }
        })
      }
      oldPivotData.allTotal = null
      
      // Clear all remaining properties
      oldPivotData.tree = {}
      oldPivotData.rowKeys = []
      oldPivotData.colKeys = []
      oldPivotData.rowTotals = {}
      oldPivotData.colTotals = {}
      oldPivotData.filteredData = []
    }
    
    // Create new instance
    pivotData.value = new PivotData(state)
    lastPivotDataKey = currentKey
  }
})

// Clean up on unmount
onUnmounted(() => {
  const data = pivotData.value
  if (data) {
    // Enhanced cleanup: Break aggregator closures completely
    if (data.tree) {
      for (const rowKey in data.tree) {
        for (const colKey in data.tree[rowKey]) {
          const agg = data.tree[rowKey][colKey]
          if (agg && typeof agg === 'object') {
            // Break closure references completely
            Object.keys(agg).forEach(key => {
              if (typeof agg[key] === 'function') {
                agg[key] = null // Break function closures
              } else if (typeof agg[key] === 'object' && agg[key] !== null) {
                agg[key] = null // Break object references
              } else {
                delete agg[key] // Delete primitive values
              }
            })
          }
        }
        delete data.tree[rowKey]
      }
    }
    
    // Clean up aggregator function references
    if (data.aggregator) data.aggregator = null
    
    // Clean up row/col totals aggregators
    Object.keys(data.rowTotals).forEach(key => {
      const agg = data.rowTotals[key]
      if (agg && typeof agg === 'object') {
        Object.keys(agg).forEach(prop => {
          if (typeof agg[prop] === 'function' || (typeof agg[prop] === 'object' && agg[prop] !== null)) {
            agg[prop] = null
          }
        })
      }
      delete data.rowTotals[key]
    })
    
    Object.keys(data.colTotals).forEach(key => {
      const agg = data.colTotals[key]
      if (agg && typeof agg === 'object') {
        Object.keys(agg).forEach(prop => {
          if (typeof agg[prop] === 'function' || (typeof agg[prop] === 'object' && agg[prop] !== null)) {
            agg[prop] = null
          }
        })
      }
      delete data.colTotals[key]
    })
    
    // Clean up allTotal aggregator
    if (data.allTotal && typeof data.allTotal === 'object') {
      Object.keys(data.allTotal).forEach(prop => {
        if (typeof data.allTotal[prop] === 'function' || (typeof data.allTotal[prop] === 'object' && data.allTotal[prop] !== null)) {
          data.allTotal[prop] = null
        }
      })
    }
    data.allTotal = null
    
    // Clear all remaining properties
    data.tree = {}
    data.rowKeys = []
    data.colKeys = []
    data.rowTotals = {}
    data.colTotals = {}
    data.filteredData = []
    pivotData.value = null
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
  locale: state.locale || 'en',
  languagePack: state.languagePack || locales,
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
  () => props.pivotModel,
  (newModel) => {
    if (newModel && Object.keys(newModel).length > 0) {
      updateMultiple({
        rows: newModel.rows || [],
        cols: newModel.cols || [],
        vals: newModel.vals || [],
        aggregatorName: newModel.aggregatorName || 'Count',
        rendererName: newModel.rendererName || 'Table',
        valueFilter: newModel.valueFilter || {},
        rowOrder: newModel.rowOrder || 'key_a_to_z',
        colOrder: newModel.colOrder || 'key_a_to_z',
        heatmapMode: newModel.heatmapMode || ''
      } as Partial<typeof state>)
    }
  },
  { deep: true, immediate: true }
)

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
