import { VuePivottable, VuePivottableUi } from './components'
import TableRenderer from './components/pivottable/renderer'
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
  TableRenderer
}

export { VuePivottable, VuePivottableUi, PivotUtilities, Renderer }
