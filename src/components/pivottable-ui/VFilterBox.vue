<template>
  <div
    class="pvtFilterBox"
    :style="{ display: block, cursor: initial, zIndex: props.zIndex}"
    @click="handleClick($event)"
  >
    <div
      class="pvtSearchContainer"
    >
        <p v-if="!showMenu">
          (too many to list)
        </p>
        <input
          v-if="showMenu"
          class="pvSearch"
          type="text"
          placeholder="Filter values"
          :value="filterText"
          @input="handleInput($event)"
        >
        <a
          class="pvtFilterTextClear"
          @click="handleFilterTextClear"
        >
        </a>
        <a
          class="pvtButton"
          role="button"
          @click="removeValuesFromFilter(name, Object.keys(attrValues).filter(matchesFilter))"
        >
          Select All
        </a>
        <a
          class="pvtButton"
          role="button"
          @click="addValuesToFilter(name, Object.keys(attrValues).filter(matchesFilter))"
        >
          Select None
        </a>
    </div>
    <div
      v-if="showMenu"
      class="pvtCheckContainer"
    >
      <p
        v-for="x in shown"
        :key="x"
        :class="{'selected': !(x in valueFilter)}"
        @click="toggleValue(x)"
      >
        <input
          type="checkbox"
          :checked="!(x in valueFilter)"
        >
        <template v-html="x"></template>
        <a
          class="pvtOnly"
          @click="selectOnly($event, x)"
        >
          only
        </a>
        <a
          class="pvtOnlySpacer"
        >
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/** props & emit */
const props = defineProps({
  valueFilter: Object,
  name: String,
  attrValues: Object,
  sorter: Function,
  menuLimit: Number
})
const emit = defineEmits([
  'moveToTop:filterbox',
  'input',
  'update:filter'
])

/** state */
const filterText = ref('')
const showMenu = ref(Object.keys(props.attrValues).length < props.menuLimit)
const shown = computed(() => Object.keys(props.attrValues).filter(matchesFilter).sort(props.sorter)) // ref vs computed

/** method */
const handleClick = (e) => {
  e.stopPropagation()
  moveFilterBoxToTop(props.name)
}
const moveFilterBoxToTop = (attribute) => {
  emit('moveToTop:filterbox', { attribute })
}
const handleInput = (e) => {
  filterText.value = e.target.value
  emit('input', e.target.value)
}
const handleFilterTextClear = () => { filterText.value = '' }
const matchesFilter = (x) => {
  return x
    .toLowerCase()
    .trim()
    .includes(filterText.value.toLowerCase().trim())
}
const addValuesToFilter = (attribute, values) => {
  const valueFilter = values.reduce((r, v) => {
    r[v] = true
    return r
  }, Object.assign({}, props.valueFilter))
  emit('update:filter', { attribute, valueFilter })
}
const removeValuesFromFilter = (attribute, values) => {
  const valueFilter = values.reduce((r, v) => {
    if (r[v]) {
      delete r[v]
    }
    return r
  }, Object.assign({}, props.valueFilter))
  emit('update:filter', { attribute, valueFilter })
}
const toggleValue = (value) => {
  if (value in props.valueFilter) {
    removeValuesFromFilter(props.name, [value])
  } else {
    addValuesToFilter(props.name, [value])
  }
}
const selectOnly = (e, value) => {
  e.stopPropagation()
  setValuesInFilter(props.name, Object.keys(props.attrValues).filter(y => y !== value))
}
const setValuesInFilter = (attribute, values) => {
  const valueFilter = values.reduce((r, v) => {
    r[v] = true
    return r
  }, {})
  emit('update:filter', { attribute, valueFilter })
}
</script>

// *** Draggable Attribute ***
// data/filterText 삭제 (VFilterBox.vue로 이동)
// data/values 삭제
// data/attribute 삭제
// data/filter 삭제

// *** 논의 ***
// bind(this)
// !(x in valueFilter) => 함수
