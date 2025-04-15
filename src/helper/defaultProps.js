import { aggregators, locales } from './utilities'
import { redColorScaleGenerator } from './redColorScaleGenerator'
export default {
  data: {
    type: [Array, Object, Function],
    required: true
  },
  aggregators: {
    type: Object,
    default: () => aggregators
  },
  aggregatorName: {
    type: String,
    default: 'Count'
  },
  heatmapMode: String,
  tableColorScaleGenerator: {
    type: Function,
    default: redColorScaleGenerator
  },
  tableOptions: {
    type: Object,
    default: () => ({})
  },
  renderers: {
    type: Object,
    default: () => ({})
  },
  rendererName: {
    type: String,
    default: 'Table'
  },
  locale: {
    type: String,
    default: 'en'
  },
  languagePack: {
    type: Object,
    default: () => locales
  },
  showRowTotal: {
    type: Boolean,
    default: true
  },
  showColTotal: {
    type: Boolean,
    default: true
  },
  cols: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Array,
    default: () => []
  },
  vals: {
    type: Array,
    default: () => []
  },
  attributes: {
    type: Array,
    default: () => []
  },
  valueFilter: {
    type: Object,
    default: () => ({})
  },
  sorters: {
    type: [Function, Object],
    default: () => ({})
  },
  derivedAttributes: {
    type: [Function, Object],
    default: () => ({})
  },
  rowOrder: {
    type: String,
    default: 'key_a_to_z',
    validator: (value) => ['key_a_to_z', 'value_a_to_z', 'value_z_to_a'].indexOf(value) !== -1
  },
  colOrder: {
    type: String,
    default: 'key_a_to_z',
    validator: value => ['key_a_to_z', 'value_a_to_z', 'value_z_to_a'].indexOf(value) !== -1
  },
  tableMaxWidth: {
    type: Number,
    default: 0,
    validator: value => value >= 0
  }
}
