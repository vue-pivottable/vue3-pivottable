import { aggregators, locales } from './utilities'
import { redColorScaleGenerator } from './redColorScaleGenerator'
import type { PropType } from 'vue'

export default {
  data: {
    type: [Array, Object, Function] as PropType<any>,
    required: true
  },
  aggregators: {
    type: Object as PropType<Record<string, Function>>,
    default: () => aggregators
  },
  aggregatorName: {
    type: String,
    default: 'Count'
  },
  heatmapMode: String as PropType<'full' | 'col' | 'row' | ''>,
  tableColorScaleGenerator: {
    type: Function,
    default: redColorScaleGenerator
  },
  tableOptions: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  renderers: {
    type: Object as PropType<Record<string, any>>,
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
    type: Object as PropType<Record<string, any>>,
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
    type: Array as PropType<string[]>,
    default: () => []
  },
  rows: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  vals: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  attributes: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  valueFilter: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  sorters: {
    type: [Function, Object] as PropType<any>,
    default: () => ({})
  },
  derivedAttributes: {
    type: [Function, Object] as PropType<any>,
    default: () => ({})
  },
  rowOrder: {
    type: String as PropType<'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'>,
    default: 'key_a_to_z',
    validator: (value: string) =>
      ['key_a_to_z', 'value_a_to_z', 'value_z_to_a'].indexOf(value) !== -1
  },
  colOrder: {
    type: String as PropType<'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'>,
    default: 'key_a_to_z',
    validator: (value: string) =>
      ['key_a_to_z', 'value_a_to_z', 'value_z_to_a'].indexOf(value) !== -1
  },
  tableMaxWidth: {
    type: Number,
    default: 0,
    validator: (value: number) => value >= 0
  }
}
