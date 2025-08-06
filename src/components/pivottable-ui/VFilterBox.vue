<template>
  <div
    class="pvtFilterBox"
    :style="{ display: 'block', cursor: 'initial', zIndex: props.zIndex }"
    @click="moveFilterBoxToTop"
  >
    <div class="pvtSearchContainer">
      <p v-if="!showMenu">
        {{ localeStrings.tooMany }}
      </p>
      <input
        v-if="showMenu"
        class="pvSearch"
        type="text"
        :placeholder="localeStrings.filterResults"
        v-model="filterText"
      />
      <a
        class="pvtFilterTextClear"
        @click="handleFilterTextClear"
      />
      <a
        class="pvtButton"
        role="button"
        @click="removeValuesFromFilter(filteredList)"
      >
        {{ localeStrings.selectAll }}
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
        :class="{ selected: !(x in unselectedValues) }"
        @click="toggleValue(x)"
      >
        <input
          type="checkbox"
          :checked="!(x in unselectedValues)"
        />
        {{ x }}
        <span>({{ filterBoxValues[x] }})</span>
        <a
          class="pvtOnly"
          @click="selectOnly($event, x)"
        >
          {{ localeStrings.only }}
        </a>
        <a class="pvtOnlySpacer" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProvideFilterBox } from '../../composables'

interface FilterBoxProps {
  unselectedFilterValues?: Record<string, boolean>
  filterBoxKey?: string
  zIndex?: number
  filterBoxValues?: Record<string, number>
}

const props = withDefaults(defineProps<FilterBoxProps>(), {
  unselectedFilterValues: () => ({}),
  filterBoxKey: '',
  zIndex: 0,
  filterBoxValues: () => ({})
})

const { localeStrings, sorter, menuLimit } = useProvideFilterBox()!
const filterBoxValuesList = Object.keys(props.filterBoxValues)
const filterText = ref('')
const showMenu = ref(filterBoxValuesList.length < menuLimit.value)
const sortedList = [...filterBoxValuesList].sort(sorter(props.filterBoxKey))
const filteredList = computed(() => sortedList.filter(matchesFilter))
const unselectedValues = computed(() => props.unselectedFilterValues)

const emit = defineEmits<{
  (event: 'update:zIndexOfFilterBox', attributeName: string): void
  (
    event: 'update:unselectedFilterValues',
    payload: { key: string; value: Record<string, boolean> }
  ): void
}>()

const moveFilterBoxToTop = (e: MouseEvent) => {
  e.stopPropagation()
  emit('update:zIndexOfFilterBox', props.filterBoxKey)
}
const handleFilterTextClear = () => {
  filterText.value = ''
}
const matchesFilter = (x: string) =>
  x
    .toLowerCase()
    .trim()
    .includes((filterText.value ?? '').toLowerCase().trim())
const addValuesToFilter = (values: string[]) => {
  const filterValues = values.reduce(
    (r, v) => {
      r[v] = true
      return r
    },
    Object.assign({}, unselectedValues.value)
  )
  console.log('FilterBox emit addValues:', props.filterBoxKey, filterValues)
  emit('update:unselectedFilterValues', {
    key: props.filterBoxKey,
    value: filterValues
  })
}
const removeValuesFromFilter = (values: string[]) => {
  const filterValues = values.reduce(
    (r, v) => {
      if (r[v]) {
        delete r[v]
      }
      return r
    },
    Object.assign({}, unselectedValues.value)
  )
  console.log('FilterBox emit removeValues:', props.filterBoxKey, filterValues)
  emit('update:unselectedFilterValues', {
    key: props.filterBoxKey,
    value: filterValues
  })
}
const toggleValue = (value: string) => {
  console.log('FilterBox toggleValue:', value, 'in unselected:', value in unselectedValues.value)
  if (value in unselectedValues.value) {
    removeValuesFromFilter([value])
  } else {
    addValuesToFilter([value])
  }
}
const selectOnly = (e: MouseEvent, value: string) => {
  e.stopPropagation()
  setValuesInFilter(
    props.filterBoxKey,
    filterBoxValuesList.filter((y) => y !== value)
  )
}
const setValuesInFilter = (filterBoxKey: string, values: string[]) => {
  const filterValues = values.reduce<Record<string, boolean>>((r, v) => {
    r[v] = true
    return r
  }, {})
  emit('update:unselectedFilterValues', {
    key: filterBoxKey,
    value: filterValues
  })
}
</script>
