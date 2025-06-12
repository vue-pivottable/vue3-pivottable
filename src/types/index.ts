import { AggregatorTemplate } from '@/helper'
import type {
  ComputedRef,
  RendererElement,
  RendererNode,
  VNode
} from 'vue'

export interface DefaultPropsType {
  data: any
  aggregators?: Record<string, AggregatorTemplate>
  aggregatorName: string
  heatmapMode?: 'full' | 'col' | 'row' | ''
  tableColorScaleGenerator?: (...args: any[]) => any
  tableOptions?: Record<string, any>
  renderers: Record<string, any>
  rendererName: string
  locale?: string
  languagePack?: Record<string, any>
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

export type RendererComponent = ComputedRef<
  VNode<RendererNode, RendererElement, RendererProps>
>