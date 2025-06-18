import { computed, inject, provide } from 'vue'
import { getSort } from '../helper/utilities'
const filterBoxKey = Symbol('filterBox')

export function provideFilterBox(props) {
  const localeStrings = computed(
    () => props.languagePack[props.locale].localeStrings
  )
  const sorters = computed(() => props.sorters)
  const sorter = (x) => getSort(sorters.value, x)
  const menuLimit = computed(() => props.menuLimit)
  provide(filterBoxKey, {
    localeStrings,
    sorter,
    menuLimit
  })
}

export function useProvideFilterBox() {
  return inject(filterBoxKey)
}
