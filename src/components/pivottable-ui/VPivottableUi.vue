<template>
  <table class="pvtUi">
    <slot name="colGroup" />
    <tbody>
      <tr>
        <VRendererCell
          :rendererName="rendererName"
          @update:propUpdater="propUpdater"
        />
        <VDragAndDropCell
          cellType="unused"
          :items="unusedAttrs"
          :unusedOrder="newProps.unusedOrder"
          :unusedItems="unusedAttrs"
          :sortonlyFromDragDrop="newProps.sortonlyFromDragDrop"
          :fields="newProps.unusedOrder"
          :attrValues="newProps.attrValues"
          :menuLimit="newProps.menuLimit"
          :maxZIndex="newProps.maxZIndex"
          :valueFilter="newProps.valueFilter"
          :async="newProps.async"
          :localeStrings="newProps.locales[newProps.locale].localeStrings"
          :getSort="getSort"
          classes="pvtAxisContainer pvtUnused pvtHorizList"
          @update:filter="onUpdateValueFilter"
          @moveToTop:filterbox="onMoveFilterBoxToTop"
          @no:filterbox="onNoFilterBox"
          @dragged:attribute="onDragAttribute"
        >
          <template v-slot:pvtAttr="props">
            <slot name="pvtAttr" v-bind="props"/>
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
          cellType="cols"
          :items="colAttrs"
          :unusedOrder="newProps.unusedOrder"
          :unusedItems="unusedAttrs"
          :sortonlyFromDragDrop="newProps.sortonlyFromDragDrop"
          :attrValues="newProps.attrValues"
          :menuLimit="newProps.menuLimit"
          :maxZIndex="newProps.maxZIndex"
          :valueFilter="newProps.valueFilter"
          :async="newProps.async"
          :localeStrings="newProps.locales[newProps.locale].localeStrings"
          :getSort="getSort"
          classes="pvtAxisContainer pvtHorizList pvtCols"
          @update:filter="onUpdateValueFilter"
          @moveToTop:filterbox="onMoveFilterBoxToTop"
          @no:filterbox="onNoFilterBox"
          @dragged:attribute="onDragAttribute"
        >
        <!-- items를 colAttrs로 내려야하는지 newProps.cols로 내려야하는지 -->
        <!-- :fields="newProps.cols" -->
          <template v-slot:pvtAttr="props">
            <slot name="pvtAttr" v-bind="props"/>
          </template>
        </VDragAndDropCell>

      </tr>
      <tr>
        <VDragAndDropCell
          cellType="rows"
          :items="rowAttrs"
          :unusedOrder="newProps.unusedOrder"
          :unusedItems="unusedAttrs"
          :sortonlyFromDragDrop="newProps.sortonlyFromDragDrop"
          :attrValues="newProps.attrValues"
          :menuLimit="newProps.menuLimit"
          :maxZIndex="newProps.maxZIndex"
          :valueFilter="newProps.valueFilter"
          :async="newProps.async"
          :localeStrings="newProps.locales[newProps.locale].localeStrings"
          :getSort="getSort"
          classes="pvtAxisContainer pvtVertList pvtRows"
          @update:filter="onUpdateValueFilter"
          @moveToTop:filterbox="onMoveFilterBoxToTop"
          @no:filterbox="onNoFilterBox"
          @dragged:attribute="onDragAttribute"
        >
        <!-- :fields="newProps.rows" -->
          <template v-slot:pvtAttr="props">
            <slot
              v-bind="props"
              name="pvtAttr"
            />
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
import { defaultProps, PivotData, aggregators, sortAs, getSort } from '../../helper'
import VRendererCell from './VRendererCell.vue'
import VAggregatorCell from './VAggregatorCell.vue'
import VDragAndDropCell from './VDragAndDropCell.vue'
import { VPivottable } from '../'
import { computed, ref, watch } from 'vue'
import { usePropsData } from '../../composables'
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
  return newProps.value.attributes.filter(
    e =>
      !newProps.rows.includes(e) &&
          !newProps.value.cols.includes(e) &&
          !newProps.value.hiddenAttributes.includes(e) &&
          !newProps.value.hiddenFromDragDrop.includes(e)
  ).sort(sortAs(newProps.value.unusedOrder))
})
const aggregatorItems = computed(() => (newProps.value.aggregators) || aggregators)
const numValsAllowed = computed(() => aggregatorItems.value[newProps.value.aggregatorName]([])().numInputs || 0)
const materializeInput = (nextData) => {
  if (props.data === nextData) {
    return
  }
  const newState = {
    data: nextData,
    attrValues: {},
    materializedInput: []
  }

  let recordsProcessed = 0
  PivotData.forEachRecord(newState.data, props.derivedAttributes, function (record) {
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
  })
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

const openFilterBox = ({ attribute, open }) => {
  state.value.openStatus[attribute] = open
}

// onChange 함수가 cell마다 각가 3개의 함수가 정의되어있는데 공통으로 합침(unusedAttrsCell, colAttrsCell, rowAttrsCell)
const onDragAttribute = (e, cellType) => {
  const cellClass = 'pvt' + cellType.charAt(0).toUpperCase() + cellType.slice(1)
  const item = e.item.getAttribute('data-id')
  // 에러남,, newProps.sortonlyFromDragDrop - undefined
  // if (newProps.sortonlyFromDragDrop.includes(item) && (!e.from.classList.contains(cellClass) || !e.to.classList.contains(cellClass))) {
  //   return
  // }
  console.log('옮기는 속성', item)
  if (e.from.classList.contains(cellClass)) {
    if (cellType === 'unused') {
      openFilterBox({ attribute: item, open: false }) // 이거 VDragAndDropCell에 있어도 되지 않나?
      const newAttributes = [...state.value.unusedOrder]
      newAttributes.splice(e.oldIndex, 1)
      state.value.unusedOrder = newAttributes
    } else {
      const newAttributes = [...newProps.value[cellType]]
      newAttributes.splice(e.oldIndex, 1)
      propUpdater({ key: cellType, value: newAttributes })
      // 업데이트가 되나 리렌더링되지 않음
    }
    // emit 정의되지 않음
    // this.$emit(`dragged:${cellType}`, item)
  }
  if (e.to.classList.contains(cellClass)) {
    if (cellType === 'unused') {
      openFilterBox({ attribute: item, open: false }) // 이거 VDragAndDropCell에 있어도 되지 않나?
      const newAttributes = [...state.value.unusedOrder]
      newAttributes.splice(e.newIndex, 0, item)
      state.value.unusedOrder = newAttributes
    } else {
      const newAttributes = [...newProps.value[cellType]]
      newAttributes.splice(e.newIndex, 0, item)
      propUpdater({ key: cellType, value: newAttributes })
    }
    // emit 정의되지 않음
    // this.$emit(`dropped:${cellType}`, item)
  }
}

const pivotData = new PivotData(newProps.value)

watch(() => props.data, (value) => {
  state.value.unusedOrder = props.unusedAttrs
  materializeInput(value)
}, {
  immediate: false
})

</script>

<style>
.pvtUi {
  border-collapse: collapse;
  width: 100%;
}

.pvtUi td, .pvtUi th {
  border: 1px solid black;
  padding: 8px;
}
</style>
