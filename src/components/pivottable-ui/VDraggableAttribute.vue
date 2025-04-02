<template>
  <li :data-id="!disabled ? name : undefined">
    <span class="pvtAttr" :class="[filtered, { sortonly, disabled }]">
      <slot name="pvtAttr" :attrName="name">{{ name }}</slot>
      <span
        v-if="showDropdown"
        @click="toggleFilterBox"
        class="pvtTriangle"
      > ▾</span>
      <VFilterBox
        v-if="open"
        :valueFilter="valueFilter"
        :name="name"
        :attrValues="attrValues"
        :sorter="sorter"
        :menuLimit="menuLimit"
        :localeStrings="localeStrings"
        @update:filter="$emit('update:filter')"
        @moveToTop:filterbox="moveFilterBoxToTop"
      >
      <!-- @input="" 이벤트 받는 곳? -->
      </VFilterBox>
      <!-- <VFilterBox v-if="open" ></VFilterBox> -->
      <!-- <slot v-if="open" name="filterbox"></slot> -->
    </span>
  </li>
</template>

<script setup>
import VFilterBox from './VFilterBox.vue'
import { computed } from 'vue'

const props = defineProps({
  draggable: {
    type: Boolean,
    default: true
  },
  sortable: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    default: false
  },
  valueFilter: {
    type: Object,
    default: () => {
      return {}
    }
  },
  attrValues: {
    type: Object,
    required: false
  },
  sorter: {
    type: Function,
    required: true
  },
  localeStrings: {
    type: Object,
    default: function () {
      return {
        selectAll: 'Select All',
        selectNone: 'Select None',
        tooMany: '(too many to list)', // too many values to show
        filterResults: 'Filter values',
        only: 'only'
      }
    }
  },
  menuLimit: Number,
  zIndex: Number,
  async: Boolean,
  unused: Boolean
})

const disabled = computed(() => !props.sortable && !props.draggable)
const sortonly = computed(() => props.sortable && !props.draggable)

const filtered = computed(() => Object.keys(props.valueFilter).length !== 0 ? 'pvtFilteredAttribute' : '')
const showDropdown = computed(() => !disabled.value && (props.async ? !props.unused : true))

const emit = defineEmits(['no:filterbox', 'open:filterbox', 'moveToTop:filterbox'])

const openFilterBox = (attribute, open) => {
  emit('open:filterbox', { attribute, open })
}

const moveFilterBoxToTop = (attribute) => {
  emit('moveToTop:filterbox', { attribute })
}

const toggleFilterBox = (e) => {
  e.stopPropagation()
  if (!props.attrValues) {
    emit('no:filterbox')
    return
  }
  openFilterBox(props.name, !props.open)
  moveFilterBoxToTop(props.name)
}
</script>

<style scoped>

</style>

// emit 받는 부분 처리하기 (['no:filterbox', 'open:filterbox', 'moveToTop:filterbox'])
