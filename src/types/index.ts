import type { AggregatorTemplate } from '@/helper'
import { VNode } from 'vue'
import { Locale } from '@/helper'

export type RecordFunctionType = () => object

export interface RendererDefinition {
  name: string
  props?: Record<string, any>
  setup: (props: any) => () => VNode
}

export interface DefaultPropsType {
  data: any
  aggregators?: Record<string, AggregatorTemplate>
  aggregatorName?: string
  heatmapMode?: 'full' | 'col' | 'row' | ''
  tableColorScaleGenerator?: (...args: any[]) => any
  tableOptions?: Record<string, any>
  renderers?: Record<string, RendererDefinition>
  rendererName?: string
  locale?: string
  languagePack?: Record<string, Locale>
  showRowTotal?: boolean
  showColTotal?: boolean
  cols?: string[]
  rows?: string[]
  vals?: string[]
  attributes?: string[]
  valueFilter?: Record<string, any>
  sorters?: any
  derivedAttributes?: any
  rowOrder?: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'
  colOrder?: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'
  tableMaxWidth?: number
  aggregatorMap?: Record<string, string>
}

export type RendererProps = DefaultPropsType & Record<string, unknown>

export interface PivotModelInterface {
  rows: string[]
  cols: string[]
  vals: string[]
  aggregatorName: string
  rendererName: string
  heatmapMode?: 'full' | 'col' | 'row' | ''
  valueFilter: Record<string, any>
  rowOrder: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'
  colOrder: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'
  timestamp?: number
  version?: string
}

export type PivotModelChangeEvent = {
  type: 'field-move' | 'aggregator-change' | 'renderer-change' | 'filter-change' | 'sort-change'
  field?: string
  from?: string
  to?: string
  oldValue?: any
  newValue?: any
  timestamp: number
}
