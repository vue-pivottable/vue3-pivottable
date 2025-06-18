import { computed, ComputedRef, inject, provide, InjectionKey } from 'vue'
import { getSort } from '@/helper'
import { DefaultPropsType } from '@/types'

type ProvideFilterBoxProps = Pick<DefaultPropsType,
  'languagePack' | 'locale' | 'sorters'> & {
    menuLimit: number
  }

interface FilterBoxContext {
  localeStrings: ComputedRef<any>
  sorter: (x: string) => any
  menuLimit: ComputedRef<number>
}

const filterBoxKey = Symbol('filterBox') as InjectionKey<FilterBoxContext>

export function provideFilterBox (props: ProvideFilterBoxProps) {
  const localeStrings = computed(
    () => props.languagePack?.[props.locale || 'en']?.localeStrings
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
