<template>
  <td>
    <h3>VDragAndDropCell ({{ cellType }})</h3>
    <Draggable
      tag="ul"
      :list="items"
      :group="{ name: 'sharted', pull: true, put: true }"
      ghost-class="pvtPlaceholder"
      filter=".pvtFilterBox"
      :preventOnfFilter="false"
      :class="classes"
      @sort="(e) => $emit('dragged:attribute', e, cellType)"
    >
    <!-- filter=".pvtFilterBox" 이게 모지 -->
      <VDraggableAttribute
        v-for="item in items"
        :key="item"
        :name="item"
        :sortable="true"
        :draggable="true"
        :attrValues="{}"
        :sorter="getSort(() => { }, item)"
        :menuLimit="500"
        :zIndex="1000"
        :valueFilter="{}"
        :open="false"
        :async="false"
        :unused="false"
        :localeStrings="{}"
        @update:filter="$emit('update:filter')"
        @moveToTop:filterbox="$emit('moveToTop:filterbox')"
        @open:filterbox="$emit('open:filterbox')"
        @no:filterbox="$emit('no:filterbox')"
      >
        <template #pvtAttr="{ attrName }">
          {{ attrName }}
        </template>
      </VDraggableAttribute>
    </Draggable>
  </td>
</template>

<script setup>
import VDraggableAttribute from './VDraggableAttribute.vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'
import { getSort } from '../../helper'

// 여기 안에 있는 데이터들 props데이터 맞는지 다 확인
defineProps({
  cellType: {
    type: String,
    default: ''
  },
  // items랑 onChange, classes는 makeDnDCell 파라미터임
  items: {
    type: Array,
    default: () => []
  },
  // onChange: Function,
  classes: String,
  // 없어도 될거같기도 하고
  sortonlyFromDragDrop: {
    type: Array,
    default: function () {
      return []
    }
  },
  // 없어도 될거같기도 하고
  disabledFromDragDrop: {
    type: Array,
    default: function () {
      return []
    }
  },
  // propsData(attrValues, )
  attrValues: Object,
  sorters: Object,
  menuLimit: {
    type: Number,
    default: 500
  },
  zIndices: Object,
  maxZIndex: {
    type: Number
  },
  propsData: Object,
  openStatus: Object,
  async: Boolean,
  unusedAttrs: Array,
  locales: Object,
  locale: String
})

defineEmits([
  'update:filter',
  'moveToTop:filterbox',
  'open:filterbox',
  'no:filterbox',
  'dragged:attribute'
])

</script>

<style scoped>
</style>

<!--
<template v-for="x in items" :key="x">
  <DraggableAttribute
    :sortable="sortonlyFromDragDrop.includes(x) || !disabledFromDragDrop.includes(x)"
    :draggable="!sortonlyFromDragDrop.includes(x) && !disabledFromDragDrop.includes(x)"
    :name="x"
    :attr-values="attrValues[x]"
    :sorter="getSort(sorters, x)"
    :menu-limit="menuLimit"
    :z-index="zIndices[x] || maxZIndex"
    :value-filter="propsData.valueFilter[x]"
    :open="openStatus[x]"
    :async="async"
    :unused="unusedAttrs.includes(x)"
    :locale-strings="locales[locale].localeStrings"
    @update:filter="$emit('update:filter')"
    @moveToTop:filterbox="$emit('moveToTop:filterbox')"
    @open:filterbox="$emit('open:filterbox')"
    @no:filterbox="handleNoFilterBox"
  >
    <template v-if="slots.pvtAttr" #pvtAttr="props">
      <slot name="pvtAttr" v-bind="props"></slot>
    </template>
  </DraggableAttribute>
</template> -->
