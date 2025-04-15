<template>
  <div
    class="pvtFilterBox"
    :style="{ display: 'block', cursor: 'initial', zIndex: props.zIndex}"
    @click="moveFilterBoxToTop"
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
          @click="removeValuesFromFilter(filteredList)"
        >
          {{  localeStrings.selectAll }}
        </a>
        <a
          class="pvtButton"
          role="button"
          @click="addValuesToFilter(filteredList)"
        >
          {{ localeStrings.selectNone }}
        </a>
    </div>
    <div
      v-if="showMenu"
      class="pvtCheckContainer"
    >
      <p
        v-for="x in filteredList"
        :key="x"
        :class="{'selected': !(x in unselectedValues)}"
        @click="toggleValue(x)"
      >
        <input
          type="checkbox"
          :checked="!(x in unselectedValues)"
        >
        {{ x }}
        <span>({{ filterBoxValues[x] }})</span>
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
import { ref, computed } from 'vue'
import { useProvideFilterBox } from '../../composables'
const props = defineProps({
  unselectedFilterValues: {
    type: Object,
    default: () => ({})
  },
  filterBoxKey: {
    type: String,
    default: ''
  },
  zIndex: {
    type: Number,
    default: 0
  },
  filterBoxValues: {
    type: Object,
    default: () => ({})
  }
})
const { localeStrings, sorter, menuLimit } = useProvideFilterBox()
const filterBoxValuesList = Object.keys(props.filterBoxValues)
const filterText = ref('')
const showMenu = ref(filterBoxValuesList.length < menuLimit)
const sortedList = [...filterBoxValuesList].sort(sorter(props.filterBoxKey))
const filteredList = computed(() => sortedList.filter(matchesFilter))
const unselectedValues = ref(props.unselectedFilterValues)
const emit = defineEmits([
  'update:zIndexOfFilterBox',
  'update:unselectedFilterValues'
])
const moveFilterBoxToTop = (e) => {
  e.stopPropagation()
  emit('update:zIndexOfFilterBox', props.filterBoxKey)
}
const handleFilterTextClear = () => {
  filterText.value = ''
}
const matchesFilter = (x) => x.toLowerCase().trim().includes(filterText.value.toLowerCase().trim())
const addValuesToFilter = (values) => {
  const filterValues = values.reduce((r, v) => {
    r[v] = true
    return r
  }, Object.assign({}, unselectedValues.value))
  emit('update:unselectedFilterValues', { key: props.filterBoxKey, value: filterValues })
}
const removeValuesFromFilter = (values) => {
  const filterValues = values.reduce((r, v) => {
    if (r[v]) {
      delete r[v]
    }
    return r
  }, Object.assign({}, unselectedValues.value))
  emit('update:unselectedFilterValues', { key: props.filterBoxKey, value: filterValues })
}
const toggleValue = (value) => {
  if (value in unselectedValues.value) {
    removeValuesFromFilter([value])
  } else {
    addValuesToFilter([value])
  }
}
const selectOnly = (e, value) => {
  e.stopPropagation()
  setValuesInFilter(props.filterBoxKey, filterBoxValuesList.filter(y => y !== value))
}
const setValuesInFilter = (filterBoxKey, values) => {
  const filterValues = values.reduce((r, v) => {
    r[v] = true
    return r
  }, {})
  emit('update:unselectedFilterValues', { key: filterBoxKey, value: filterValues })
}
</script>
