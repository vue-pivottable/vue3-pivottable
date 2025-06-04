import { computed, inject, provide } from 'vue'
import { getSort } from '../helper/utilities'
const filterBoxKey = Symbol('filterBox')

interface ProvideFilterBoxProps {
  languagePack: Record<string, any>
  locale: string
  sorters: Record<string, any>
  menuLimit: number
  [key: string]: any
}

export function provideFilterBox (props: ProvideFilterBoxProps) {
  const localeStrings = computed(
    () => props.languagePack[props.locale].localeStrings
  )
  const sorters = computed(() => props.sorters)
  const sorter = (x: string) => getSort(sorters.value, x)
  const menuLimit = computed(() => props.menuLimit)
  provide(filterBoxKey, {
    localeStrings,
    sorter,
    menuLimit
  })
}

export function useProvideFilterBox () {
  return inject(filterBoxKey)
}
