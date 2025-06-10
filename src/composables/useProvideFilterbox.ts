import { computed, ComputedRef, inject, provide, InjectionKey } from 'vue'
import { getSort } from '../helper/utilities'

interface ProvideFilterBoxProps {
  languagePack: Record<string, any>
  locale: string
  sorters: Record<string, any>
  menuLimit: number
  [key: string]: any
}

// 별도의 파일로 분리?
interface FilterBoxContext {
  localeStrings: ComputedRef<any>
  sorter: (x: string) => any
  menuLimit: ComputedRef<number>
}

const filterBoxKey = Symbol('filterBox') as InjectionKey<FilterBoxContext>

export function provideFilterBox(props: ProvideFilterBoxProps) {
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

export function useProvideFilterBox() {
  return inject(filterBoxKey)
}
