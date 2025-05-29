declare class PivotData {
  constructor(inputProps?: any)
  props: any
  getRowKeys(): any[]
  getColKeys(): any[]
  getAggregator(rowKey: any, colKey: any): any
  [key: string]: any
}

declare const aggregators: Record<string, any>
declare const aggregatorTemplates: Record<string, any>
declare const locales: Record<string, any>
declare const naturalSort: (a: any, b: any) => number
declare const numberFormat: (opts?: any) => any
declare const getSort: any
declare const sortAs: any
declare const derivers: any

export {
  PivotData,
  aggregators,
  aggregatorTemplates,
  locales,
  naturalSort,
  numberFormat,
  getSort,
  sortAs,
  derivers
}
