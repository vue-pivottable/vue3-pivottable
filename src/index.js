import * as components from './components/index'
// import TableRenderer from './TableRenderer'

import {
  aggregatorTemplates,
  aggregators,
  derivers,
  locales,
  naturalSort,
  numberFormat,
  getSort,
  sortAs,
  PivotData
} from './helper/utilities'

const PivotUtilities = {
  aggregatorTemplates,
  aggregators,
  derivers,
  locales,
  naturalSort,
  numberFormat,
  getSort,
  sortAs,
  PivotData
}

const Renderer = {
  // TableRenderer
}

// if (typeof window !== 'undefined' && window.Vue) window.Vue.use(VuePivottable)

const install = (app) => {
  Object.entries(components).forEach(([componentName, component]) => {
    app.component(componentName, component)
  })
}

export default install
export * from './components/index'
export { PivotUtilities, Renderer }
