import type { AggregatorTemplate } from '@/helper'
import { VNode } from 'vue'

export interface DefaultPropsType {
  data: any
  aggregators?: Record<string, AggregatorTemplate>
  aggregatorName: string
  heatmapMode?: 'full' | 'col' | 'row' | ''
  tableColorScaleGenerator?: (...args: any[]) => any
  tableOptions?: Record<string, any>
  renderers: Record<string, RendererDefinition>
  rendererName: string
  locale?: string
  languagePack?: Record<string, { localeStrings: Record<string, string> }>
  showRowTotal?: boolean
  showColTotal?: boolean
  cols: string[]
  rows: string[]
  vals?: string[]
  attributes?: string[]
  valueFilter?: Record<string, any>
  sorters?: any
  derivedAttributes?: any
  rowOrder?: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'
  colOrder?: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a'
  tableMaxWidth?: number
}

export type RendererProps = DefaultPropsType & Record<string, unknown>

export interface RendererDefinition {
  name: string
  props?: Record<string, any>
  setup: (props: any) => () => VNode
}
