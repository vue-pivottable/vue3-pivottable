import { inject, provide } from 'vue'

const filterBoxKey = Symbol('filterBox')

export function provideFilterBox (props) {
  const localeStrings = props.languagePack[props.locale]
  const sorter = props.sorters
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
