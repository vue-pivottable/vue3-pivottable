<template>
  <div
    class="pvtFilterBox"
    :style="{ display: block, cursor: initial, zIndex: props.zIndex}"
    @click="moveFilterBoxToTop($event)"
  >
    <div
      class="pvtSearchContainer"
    >
        <p v-if="!showMenu">
          {{ localeStrings.tooMany }}
        </p>
        <input
          v-if="showMenu"
          class="pvSearch"
          type="text"
          :placeholder="localeStrings.filterResults"
          v-model="filterText"
        >
        <a
          class="pvtFilterTextClear"
          @click="handleFilterTextClear"
        >
        </a>
        <a
          class="pvtButton"
          role="button"
          @click="removeValuesFromFilter(filterBoxKey, Object.keys(filterBoxValues).filter(matchesFilter))"
        >
          {{  localeStrings.selectAll }}
        </a>
        <a
          class="pvtButton"
          role="button"
          @click="addValuesToFilter(filterBoxKey, Object.keys(filterBoxValues).filter(matchesFilter))"
        >
          {{ localeStrings.selectNone }}
        </a>
    </div>
    <div
      v-if="showMenu"
      class="pvtCheckContainer"
    >
      <p
        v-for="x in shown"
        :key="x"
        :class="{'selected': !(x in unselectedValues)}"
        @click="toggleValue(x)"
      >
        <input
          type="checkbox"
          :checked="!(x in unselectedValues)"
        >
        <template v-html="x"></template>
        <a
          class="pvtOnly"
          @click="selectOnly($event, x)"
        >
          {{ localeStrings.only }}
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
import { ref, computed, inject } from 'vue'
/** inject */
const sorters = inject('sorters')
const menuLimit = inject('menuLimit')
const localeStrings = inject('localeStrings')
const allFilters = inject('allFilters')
const filterBoxValues = computed(() => allFilters[props.filterBoxKey])
/** props */
const props = defineProps({
  unselectedFilterValues: {
    type: Object,
    default: () => {}
  },
  filterBoxKey: {
    type: String,
    default: ''
  },
  zIndex: {
    type: Number,
    default: 0
  }
})
/** state */
const filterText = ref('')
const showMenu = ref(Object.keys(filterBoxValues.value).length < menuLimit)
const shown = computed(() => Object.keys(filterBoxValues.value).filter(matchesFilter).sort(sorters(props.filterBoxKey)))
const unselectedValues = ref(props.unselectedFilterValues)
/** emit */
const emit = defineEmits([
  'update:zIndexOfFilterbox',
  'update:unselectedFilterValues'
])
/** method */
const moveFilterBoxToTop = (e) => {
  e.stopPropagation()
  emit('update:zIndexOfFilterbox', props.filterBoxKey)
}
const handleFilterTextClear = () => { filterText.value = '' }
const matchesFilter = (x) => x.toLowerCase().trim().includes(filterText.value.toLowerCase().trim())
// ----- start
// const updateUnselectedFilterValues = () => {}
const addValuesToFilter = (attribute, values) => {
  const filterValues = values.reduce((r, v) => {
    r[v] = true
    return r
  }, Object.assign({}, unselectedValues.value))
  emit('update:unselectedFilterValues', { attribute, filterValues })
}
const removeValuesFromFilter = (attribute, values) => {
  const filterValues = values.reduce((r, v) => {
    if (r[v]) {
      delete r[v]
    }
    return r
  }, Object.assign({}, unselectedValues.value))
  emit('update:unselectedFilterValues', { attribute, filterValues })
}
const toggleValue = (value) => {
  if (value in unselectedValues.value) {
    removeValuesFromFilter(props.filterBoxKey, [value])
  } else {
    addValuesToFilter(props.filterBoxKey, [value])
  }
}
// ----- end
const selectOnly = (e, value) => {
  e.stopPropagation()
  setValuesInFilter(props.filterBoxKey, Object.keys(filterBoxValues.value).filter(y => y !== value))
}
const setValuesInFilter = (attribute, values) => {
  const filterValues = values.reduce((r, v) => {
    r[v] = true
    return r
  }, {})
  emit('update:unselectedFilterValues', { attribute, filterValues })
}
</script>
