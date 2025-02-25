import VuePivottable from './components/Pivottable'
import VuePivottableUi from './components/PivottableUi'
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
} from './Utilities'

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

const components = [
  VuePivottable,
  VuePivottableUi
]

// if (typeof window !== 'undefined' && window.Vue) window.Vue.use(VuePivottable)

const install = (app) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}

export {
  install as default,
  VuePivottable,
  VuePivottableUi,
  PivotUtilities,
  Renderer
}