import { inject, provide } from 'vue'
import { getSort } from '../helper/utilities'
const filterBoxKey = Symbol('filterBox')

export function provideFilterBox (props) {
  const localeStrings = props.languagePack[props.locale].localeStrings
  const sorter = (x) => getSort(props.sorters, x)
  const menuLimit = props.menuLimit

  provide(filterBoxKey, {
    localeStrings,
    sorter,
    menuLimit
  })
}

export function useProvideFilterBox () {
  return inject(filterBoxKey)
}
