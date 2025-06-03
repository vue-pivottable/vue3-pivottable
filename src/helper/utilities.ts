// TypeScript 변환된 Utilities 모듈
// 원본: utilities.js → TypeScript: utilities.ts

// ==================== 브랜드 타입 정의 ====================
type AttributeName = string & { readonly __brand: unique symbol }
type FlatKey = string & { readonly __brand: unique symbol }
type NumericValue = number & { readonly __brand: unique symbol }

// ==================== 기본 타입 정의 ====================
interface NumberFormatOptions {
  digitsAfterDecimal?: number
  scaler?: number
  thousandsSep?: string
  decimalSep?: string
  prefix?: string
  suffix?: string
}

type Formatter = (value: number) => string
type SortFunction = (a: any, b: any) => number
type RecordValue = string | number
type DataRecord = Record<string, RecordValue>

// ==================== Aggregator 관련 타입 ====================
interface AggregatorInstance {
  count?: number
  sum?: number
  vals?: number[]
  uniq?: any[]
  val?: any
  sorter?: SortFunction
  n?: number
  m?: number
  s?: number
  sumNum?: number
  sumDenom?: number
  selector?: [any[], any[]]
  inner?: AggregatorInstance
  push: (record: DataRecord) => void
  value: () => any
  format?: Formatter | ((x: any) => string)
  numInputs?: number
}

type AggregatorFunction = (data?: PivotDataContext, rowKey?: any[], colKey?: any[]) => AggregatorInstance
type AggregatorTemplate = (...args: any[]) => AggregatorFunction

interface AggregatorTemplates {
  count: (formatter?: Formatter) => AggregatorTemplate
  uniques: (fn: (uniq: any[]) => any, formatter?: Formatter) => AggregatorTemplate
  sum: (formatter?: Formatter) => AggregatorTemplate
  extremes: (mode: 'min' | 'max' | 'first' | 'last', formatter?: Formatter) => AggregatorTemplate
  quantile: (q: number, formatter?: Formatter) => AggregatorTemplate
  runningStat: (mode: 'mean' | 'var' | 'stdev', ddof?: number, formatter?: Formatter) => AggregatorTemplate
  sumOverSum: (formatter?: Formatter) => AggregatorTemplate
  fractionOf: (wrapped: AggregatorTemplate, type?: 'total' | 'row' | 'col', formatter?: Formatter) => AggregatorTemplate
  countUnique: (formatter?: Formatter) => AggregatorTemplate
  listUnique: (separator: string) => AggregatorTemplate
  max: (formatter?: Formatter) => AggregatorTemplate
  min: (formatter?: Formatter) => AggregatorTemplate
  first: (formatter?: Formatter) => AggregatorTemplate
  last: (formatter?: Formatter) => AggregatorTemplate
  median: (formatter?: Formatter) => AggregatorTemplate
  average: (formatter?: Formatter) => AggregatorTemplate
  var: (ddof: number, formatter?: Formatter) => AggregatorTemplate
  stdev: (ddof: number, formatter?: Formatter) => AggregatorTemplate
}

// ==================== PivotData 관련 타입 ====================
interface PivotDataProps {
  data: DataRecord[] | DataRecord[][] | ((callback: (record: DataRecord) => void) => void)
  aggregators?: Record<string, AggregatorTemplate>
  cols?: string[]
  rows?: string[]
  vals?: string[]
  aggregatorName?: string
  sorters?: Record<string, SortFunction> | ((attr: string) => SortFunction)
  valueFilter?: Record<string, Record<string, boolean>>
  rowOrder?: 'key_a_to_z' | 'key_z_to_a' | 'value_a_to_z' | 'value_z_to_a'
  colOrder?: 'key_a_to_z' | 'key_z_to_a' | 'value_a_to_z' | 'value_z_to_a'
  derivedAttributes?: Record<string, (record: DataRecord) => RecordValue>
}

interface PivotDataContext {
  getAggregator: (rowKey: any[], colKey: any[]) => AggregatorInstance
}

// ==================== Locale 관련 타입 ====================
interface LocaleStrings {
  renderError: string
  computeError: string
  uiRenderError: string
  selectAll: string
  selectNone: string
  tooMany: string
  filterResults: string
  totals: string
  vs: string
  by: string
  cancel: string
  only: string
  apply?: string
}

interface Locale {
  aggregators?: Record<string, AggregatorTemplate>
  frAggregators?: Record<string, AggregatorTemplate>
  localeStrings: LocaleStrings
}

// ==================== Derivers 타입 ====================
interface Derivers {
  bin: (col: string, binWidth: number) => (record: DataRecord) => number
  dateFormat: (
    col: string,
    formatString: string,
    utcOutput?: boolean,
    mthNames?: string[],
    dayNames?: string[]
  ) => (record: DataRecord) => string
}

// ==================== 유틸리티 함수들 ====================

const addSeparators = (nStr: string | number, thousandsSep: string, decimalSep: string): string => {
  const x = String(nStr).split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? decimalSep + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, `$1${thousandsSep}$2`)
  }
  return x1 + x2
}

const numberFormat = (optsIn?: NumberFormatOptions): Formatter => {
  const defaults: Required<NumberFormatOptions> = {
    digitsAfterDecimal: 2,
    scaler: 1,
    thousandsSep: ',',
    decimalSep: '.',
    prefix: '',
    suffix: ''
  }
  const opts = Object.assign({}, defaults, optsIn)

  return (x: number): string => {
    if (isNaN(x) || !isFinite(x)) {
      return ''
    }
    const result = addSeparators(
      (opts.scaler * x).toFixed(opts.digitsAfterDecimal),
      opts.thousandsSep,
      opts.decimalSep
    )
    return `${opts.prefix}${result}${opts.suffix}`
  }
}

// 정규식 패턴들
const rx = /(\d+)|(\D+)/g
const rd = /\d/
const rz = /^0/

const naturalSort: SortFunction = (as: any, bs: any): number => {
  // nulls first
  if (bs !== null && as === null) {
    return -1
  }
  if (as !== null && bs === null) {
    return 1
  }

  // then raw NaNs
  if (typeof as === 'number' && isNaN(as)) {
    return -1
  }
  if (typeof bs === 'number' && isNaN(bs)) {
    return 1
  }

  // numbers and numbery strings group together
  const nas = Number(as)
  const nbs = Number(bs)
  if (nas < nbs) {
    return -1
  }
  if (nas > nbs) {
    return 1
  }

  // within that, true numbers before numbery strings
  if (typeof as === 'number' && typeof bs !== 'number') {
    return -1
  }
  if (typeof bs === 'number' && typeof as !== 'number') {
    return 1
  }
  if (typeof as === 'number' && typeof bs === 'number') {
    return 0
  }

  // 'Infinity' is a textual number, so less than 'A'
  if (isNaN(nbs) && !isNaN(nas)) {
    return -1
  }
  if (isNaN(nas) && !isNaN(nbs)) {
    return 1
  }

  // finally, "smart" string sorting
  let a = String(as)
  let b = String(bs)
  if (a === b) {
    return 0
  }
  if (!rd.test(a) || !rd.test(b)) {
    return a > b ? 1 : -1
  }

  // special treatment for strings containing digits
  const aMatches = a.match(rx)
  const bMatches = b.match(rx)

  if (!aMatches || !bMatches) {
    return a > b ? 1 : -1
  }

  while (aMatches.length && bMatches.length) {
    const a1 = aMatches.shift()!
    const b1 = bMatches.shift()!
    if (a1 !== b1) {
      if (rd.test(a1) && rd.test(b1)) {
        const numDiff = parseFloat(a1.replace(rz, '.0')) - parseFloat(b1.replace(rz, '.0'))
        return numDiff !== 0 ? numDiff : a1.length - b1.length
      }
      return a1 > b1 ? 1 : -1
    }
  }
  return aMatches.length - bMatches.length
}

const sortAs = (order: any[]): SortFunction => {
  const mapping: Record<string, number> = {}
  const lMapping: Record<string, number> = {}

  for (const i in order) {
    const x = order[i]
    mapping[x] = parseInt(i)
    if (typeof x === 'string') {
      lMapping[x.toLowerCase()] = parseInt(i)
    }
  }

  return (a: any, b: any): number => {
    if (a in mapping && b in mapping) {
      return mapping[a] - mapping[b]
    } else if (a in mapping) {
      return -1
    } else if (b in mapping) {
      return 1
    } else if (a in lMapping && b in lMapping) {
      return lMapping[a] - lMapping[b]
    } else if (a in lMapping) {
      return -1
    } else if (b in lMapping) {
      return 1
    }
    return naturalSort(a, b)
  }
}

const getSort = (sorters: Record<string, SortFunction> | ((attr: string) => SortFunction) | null, attr: string): SortFunction => {
  if (sorters) {
    if (typeof sorters === 'function') {
      const sort = sorters(attr)
      if (typeof sort === 'function') {
        return sort
      }
    } else if (attr in sorters) {
      return sorters[attr]
    }
  }
  return naturalSort
}

// 기본 포매터들
const usFmt = numberFormat()
const usFmtInt = numberFormat({ digitsAfterDecimal: 0 })
const usFmtPct = numberFormat({
  digitsAfterDecimal: 1,
  scaler: 100,
  suffix: '%'
})

// ==================== Aggregator Templates ====================

const aggregatorTemplates: AggregatorTemplates = {
  count (formatter: Formatter = usFmtInt): AggregatorTemplate {
    return () => () => ({
      count: 0,
      push () {
        this.count++
      },
      value () {
        return this.count
      },
      format: formatter
    })
  },

  uniques (fn: (uniq: any[]) => any, formatter: Formatter = usFmtInt): AggregatorTemplate {
    return ([attr]: [string]) => () => ({
      uniq: [] as any[],
      push (record: DataRecord) {
        if (!this.uniq.includes(record[attr])) {
          this.uniq.push(record[attr])
        }
      },
      value () {
        return fn(this.uniq)
      },
      format: formatter,
      numInputs: typeof attr !== 'undefined' ? 0 : 1
    })
  },

  sum (formatter: Formatter = usFmt): AggregatorTemplate {
    return ([attr]: [string]) => () => ({
      sum: 0,
      push (record: DataRecord) {
        const val = parseFloat(String(record[attr]))
        if (!isNaN(val)) {
          this.sum += val
        }
      },
      value () {
        return this.sum
      },
      format: formatter,
      numInputs: typeof attr !== 'undefined' ? 0 : 1
    })
  },

  extremes (mode: 'min' | 'max' | 'first' | 'last', formatter: Formatter = usFmt): AggregatorTemplate {
    return ([attr]: [string]) => (data?: PivotDataContext) => ({
      val: null as any,
      sorter: getSort(
        typeof data !== 'undefined' ? (data as any).sorters : null,
        attr
      ),
      push (record: DataRecord) {
        let x = record[attr]
        if (['min', 'max'].includes(mode)) {
          const numX = parseFloat(String(x))
          if (!isNaN(numX)) {
            this.val = Math[mode as 'min' | 'max'](numX, this.val !== null ? this.val : numX)
          }
        }
        if (
          mode === 'first' &&
          this.sorter(x, this.val !== null ? this.val : x) <= 0
        ) {
          this.val = x
        }
        if (
          mode === 'last' &&
          this.sorter(x, this.val !== null ? this.val : x) >= 0
        ) {
          this.val = x
        }
      },
      value () {
        return this.val
      },
      format (x: any) {
        if (isNaN(x)) {
          return x
        }
        return formatter(x)
      },
      numInputs: typeof attr !== 'undefined' ? 0 : 1
    })
  },

  quantile (q: number, formatter: Formatter = usFmt): AggregatorTemplate {
    return ([attr]: [string]) => () => ({
      vals: [] as number[],
      push (record: DataRecord) {
        const x = parseFloat(String(record[attr]))
        if (!isNaN(x)) {
          this.vals.push(x)
        }
      },
      value () {
        if (this.vals.length === 0) {
          return null
        }
        this.vals.sort((a: number, b: number) => a - b)
        const i = (this.vals.length - 1) * q
        return (this.vals[Math.floor(i)] + this.vals[Math.ceil(i)]) / 2.0
      },
      format: formatter,
      numInputs: typeof attr !== 'undefined' ? 0 : 1
    })
  },

  runningStat (mode: 'mean' | 'var' | 'stdev' = 'mean', ddof: number = 1, formatter: Formatter = usFmt): AggregatorTemplate {
    return ([attr]: [string]) => () => ({
      n: 0.0,
      m: 0.0,
      s: 0.0,
      push (record: DataRecord) {
        const x = parseFloat(String(record[attr]))
        if (isNaN(x)) {
          return
        }
        this.n += 1.0
        if (this.n === 1.0) {
          this.m = x
        }
        const mNew = this.m + (x - this.m) / this.n
        this.s = this.s + (x - this.m) * (x - mNew)
        this.m = mNew
      },
      value () {
        if (mode === 'mean') {
          if (this.n === 0) {
            return 0 / 0
          }
          return this.m
        }
        if (this.n <= ddof) {
          return 0
        }
        switch (mode) {
          case 'var':
            return this.s / (this.n - ddof)
          case 'stdev':
            return Math.sqrt(this.s / (this.n - ddof))
          default:
            throw new Error('unknown mode for runningStat')
        }
      },
      format: formatter,
      numInputs: typeof attr !== 'undefined' ? 0 : 1
    })
  },

  sumOverSum (formatter: Formatter = usFmt): AggregatorTemplate {
    return ([num, denom]: [string, string]) => () => ({
      sumNum: 0,
      sumDenom: 0,
      push (record: DataRecord) {
        const numVal = parseFloat(String(record[num]))
        const denomVal = parseFloat(String(record[denom]))
        if (!isNaN(numVal)) {
          this.sumNum += numVal
        }
        if (!isNaN(denomVal)) {
          this.sumDenom += denomVal
        }
      },
      value () {
        return this.sumNum / this.sumDenom
      },
      format: formatter,
      numInputs:
        typeof num !== 'undefined' && typeof denom !== 'undefined' ? 0 : 2
    })
  },

  fractionOf (wrapped: AggregatorTemplate, type: 'total' | 'row' | 'col' = 'total', formatter: Formatter = usFmtPct): AggregatorTemplate {
    return (...x: any[]) =>
      (data: PivotDataContext, rowKey: any[], colKey: any[]): AggregatorInstance => ({
        selector: { total: [[], []], row: [rowKey, []], col: [[], colKey] }[type] as [any[], any[]],
        inner: wrapped(...Array.from(x || []))(data, rowKey, colKey),
        push (record: DataRecord) {
          this.inner.push(record)
        },
        format: formatter,
        value () {
          return (
            this.inner.value() /
            (data as any)
              .getAggregator(...Array.from(this.selector || []))
              .inner.value()
          )
        },
        numInputs: wrapped(...Array.from(x || []))().numInputs
      })
  },

  // 편의 함수들
  countUnique (f?: Formatter): AggregatorTemplate {
    return this.uniques((x: any[]) => x.length, f)
  },

  listUnique (s: string): AggregatorTemplate {
    return this.uniques(
      (x: any[]) => x.join(s),
      (x: any) => x
    )
  },

  max (f?: Formatter): AggregatorTemplate {
    return this.extremes('max', f)
  },

  min (f?: Formatter): AggregatorTemplate {
    return this.extremes('min', f)
  },

  first (f?: Formatter): AggregatorTemplate {
    return this.extremes('first', f)
  },

  last (f?: Formatter): AggregatorTemplate {
    return this.extremes('last', f)
  },

  median (f?: Formatter): AggregatorTemplate {
    return this.quantile(0.5, f)
  },

  average (f?: Formatter): AggregatorTemplate {
    return this.runningStat('mean', 1, f)
  },

  var (ddof: number, f?: Formatter): AggregatorTemplate {
    return this.runningStat('var', ddof, f)
  },

  stdev (ddof: number, f?: Formatter): AggregatorTemplate {
    return this.runningStat('stdev', ddof, f)
  }
}

// ==================== 기본 Aggregators ====================

const aggregators: Record<string, AggregatorTemplate> = {
  'Count': aggregatorTemplates.count(usFmtInt),
  'Count Unique Values': aggregatorTemplates.countUnique(usFmtInt),
  'List Unique Values': aggregatorTemplates.listUnique(', '),
  'Sum': aggregatorTemplates.sum(usFmt),
  'Integer Sum': aggregatorTemplates.sum(usFmtInt),
  'Average': aggregatorTemplates.average(usFmt),
  'Median': aggregatorTemplates.median(usFmt),
  'Sample Variance': aggregatorTemplates.var(1, usFmt),
  'Sample Standard Deviation': aggregatorTemplates.stdev(1, usFmt),
  'Minimum': aggregatorTemplates.min(usFmt),
  'Maximum': aggregatorTemplates.max(usFmt),
  'First': aggregatorTemplates.first(usFmt),
  'Last': aggregatorTemplates.last(usFmt),
  'Sum over Sum': aggregatorTemplates.sumOverSum(usFmt),
  'Sum as Fraction of Total': aggregatorTemplates.fractionOf(aggregatorTemplates.sum(), 'total', usFmtPct),
  'Sum as Fraction of Rows': aggregatorTemplates.fractionOf(aggregatorTemplates.sum(), 'row', usFmtPct),
  'Sum as Fraction of Columns': aggregatorTemplates.fractionOf(aggregatorTemplates.sum(), 'col', usFmtPct),
  'Count as Fraction of Total': aggregatorTemplates.fractionOf(aggregatorTemplates.count(), 'total', usFmtPct),
  'Count as Fraction of Rows': aggregatorTemplates.fractionOf(aggregatorTemplates.count(), 'row', usFmtPct),
  'Count as Fraction of Columns': aggregatorTemplates.fractionOf(aggregatorTemplates.count(), 'col', usFmtPct)
}

// ==================== 프랑스어 Aggregators ====================

const frAggregators: Record<string, AggregatorTemplate> = {
  'Compte': aggregatorTemplates.count(usFmtInt),
  'Compter les valeurs uniques': aggregatorTemplates.countUnique(usFmtInt),
  'Liste des valeurs uniques': aggregatorTemplates.listUnique(', '),
  'Somme': aggregatorTemplates.sum(usFmt),
  'Somme de nombres entiers': aggregatorTemplates.sum(usFmtInt),
  'Moyenne': aggregatorTemplates.average(usFmt),
  'Médiane': aggregatorTemplates.median(usFmt),
  "Variance de l'échantillon": aggregatorTemplates.var(1, usFmt),
  "Écart-type de l'échantillon": aggregatorTemplates.stdev(1, usFmt),
  'Minimum': aggregatorTemplates.min(usFmt),
  'Maximum': aggregatorTemplates.max(usFmt),
  'Premier': aggregatorTemplates.first(usFmt),
  'Dernier': aggregatorTemplates.last(usFmt),
  'Somme Total': aggregatorTemplates.sumOverSum(usFmt)
}

// ==================== Locales ====================

const locales: Record<string, Locale> = {
  en: {
    aggregators,
    localeStrings: {
      renderError: 'An error occurred rendering the PivotTable results.',
      computeError: 'An error occurred computing the PivotTable results.',
      uiRenderError: 'An error occurred rendering the PivotTable UI.',
      selectAll: 'Select All',
      selectNone: 'Select None',
      tooMany: '(too many to list)',
      filterResults: 'Filter values',
      totals: 'Totals',
      vs: 'vs',
      by: 'by',
      cancel: 'Cancel',
      only: 'only'
    }
  },
  fr: {
    frAggregators,
    localeStrings: {
      renderError: 'Une erreur est survenue en dessinant le tableau croisé.',
      computeError: 'Une erreur est survenue en calculant le tableau croisé.',
      uiRenderError:
        "Une erreur est survenue en dessinant l'interface du tableau croisé dynamique.",
      selectAll: 'Sélectionner tout',
      selectNone: 'Ne rien sélectionner',
      tooMany: '(trop de valeurs à afficher)',
      filterResults: 'Filtrer les valeurs',
      totals: 'Totaux',
      vs: 'sur',
      by: 'par',
      apply: 'Appliquer',
      cancel: 'Annuler',
      only: 'seul'
    }
  }
}

// ==================== Date 관련 상수들 ====================

const mthNamesEn: readonly string[] = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const

const dayNamesEn: readonly string[] = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
] as const

const zeroPad = (number: number): string => `0${number}`.substr(-2, 2)

// ==================== Derivers ====================

const derivers: Derivers = {
  bin (col: string, binWidth: number) {
    return (record: DataRecord): number => {
      const value = Number(record[col])
      return value - (value % binWidth)
    }
  },

  dateFormat (
    col: string,
    formatString: string,
    utcOutput: boolean = false,
    mthNames: string[] = [...mthNamesEn],
    dayNames: string[] = [...dayNamesEn]
  ) {
    const utc = utcOutput ? 'UTC' : ''

    return (record: DataRecord): string => {
      const date = new Date(Date.parse(String(record[col])))
      if (isNaN(date.getTime())) {
        return ''
      }

      return formatString.replace(/%(.)/g, (m: string, p: string): string => {
        switch (p) {
          case 'y':
            return String((date as any)[`get${utc}FullYear`]())
          case 'm':
            return zeroPad((date as any)[`get${utc}Month`]() + 1)
          case 'n':
            return mthNames[(date as any)[`get${utc}Month`]()]
          case 'd':
            return zeroPad((date as any)[`get${utc}Date`]())
          case 'w':
            return dayNames[(date as any)[`get${utc}Day`]()]
          case 'x':
            return String((date as any)[`get${utc}Day`]())
          case 'H':
            return zeroPad((date as any)[`get${utc}Hours`]())
          case 'M':
            return zeroPad((date as any)[`get${utc}Minutes`]())
          case 'S':
            return zeroPad((date as any)[`get${utc}Seconds`]())
          default:
            return `%${p}`
        }
      })
    }
  }
}

// ==================== PivotData 클래스 ====================

class PivotData {
  public static defaultProps: Required<PivotDataProps> = {
    aggregators,
    cols: [],
    rows: [],
    vals: [],
    aggregatorName: 'Count',
    sorters: {},
    valueFilter: {},
    rowOrder: 'key_a_to_z',
    colOrder: 'key_a_to_z',
    derivedAttributes: {},
    data: []
  }

  public props: Required<PivotDataProps>
  public aggregator: AggregatorFunction
  public tree: Record<string, Record<string, AggregatorInstance>>
  public rowKeys: any[][]
  public colKeys: any[][]
  public rowTotals: Record<string, AggregatorInstance>
  public colTotals: Record<string, AggregatorInstance>
  public allTotal: AggregatorInstance
  public sorted: boolean
  public filteredData: DataRecord[]

  constructor(inputProps: Partial<PivotDataProps> = {}) {
    this.props = Object.assign({}, PivotData.defaultProps, inputProps)
    this.aggregator = this.props.aggregators[this.props.aggregatorName]!(this.props.vals)
    this.tree = {}
    this.rowKeys = []
    this.colKeys = []
    this.rowTotals = {}
    this.colTotals = {}
    this.allTotal = this.aggregator(this, [], [])
    this.sorted = false
    this.filteredData = []

    // 입력 데이터 순회하면서 셀 데이터 누적
    PivotData.forEachRecord(
      this.props.data,
      this.props.derivedAttributes,
      (record: DataRecord) => {
        if (this.filter(record)) {
          this.filteredData.push(record)
          this.processRecord(record)
        }
      }
    )
  }

  filter (record: DataRecord): boolean {
    const allSelector = '*'
    for (const k in this.props.valueFilter) {
      if (k !== allSelector) {
        const valueFilterItem = this.props.valueFilter[k]
        if (valueFilterItem) {
          if (record[k] in valueFilterItem) {
            const existingKey = valueFilterItem[String(record[k])]
            if (existingKey === true) {
              return false
            }
          } else if (valueFilterItem[allSelector] === true) {
            return false
          }
        }
      }
    }
    return true
  }

  forEachMatchingRecord (criteria: Record<string, any>, callback: (record: DataRecord) => void): void {
    PivotData.forEachRecord(
      this.props.data,
      this.props.derivedAttributes,
      (record: DataRecord) => {
        if (!this.filter(record)) {
          return
        }
        for (const k in criteria) {
          const v = criteria[k]
          if (v !== (k in record ? record[k] : 'null')) {
            return
          }
        }
        callback(record)
      }
    )
  }

  arrSort (attrs: string[]): SortFunction {
    const sortersArr: SortFunction[] = attrs.map(a => getSort(this.props.sorters, a))

    return (a: any[], b: any[]): number => {
      for (const i of Object.keys(sortersArr)) {
        const sorter = sortersArr[parseInt(i)]
        const comparison = sorter(a[parseInt(i)], b[parseInt(i)])
        if (comparison !== 0) {
          return comparison
        }
      }
      return 0
    }
  }

  sortKeys (): void {
    if (!this.sorted) {
      this.sorted = true
      const v = (r: any[], c: any[]) => this.getAggregator(r, c).value()

      switch (this.props.rowOrder) {
        case 'value_a_to_z':
          this.rowKeys.sort((a, b) => naturalSort(v(a, []), v(b, [])))
          break
        case 'value_z_to_a':
          this.rowKeys.sort((a, b) => -naturalSort(v(a, []), v(b, [])))
          break
        default:
          this.rowKeys.sort(this.arrSort(this.props.rows))
      }

      switch (this.props.colOrder) {
        case 'value_a_to_z':
          this.colKeys.sort((a, b) => naturalSort(v([], a), v([], b)))
          break
        case 'value_z_to_a':
          this.colKeys.sort((a, b) => -naturalSort(v([], a), v([], b)))
          break
        default:
          this.colKeys.sort(this.arrSort(this.props.cols))
      }
    }
  }

  getFilteredData (): DataRecord[] {
    return this.filteredData
  }

  getColKeys (): any[][] {
    this.sortKeys()
    return this.colKeys
  }

  getRowKeys (): any[][] {
    this.sortKeys()
    return this.rowKeys
  }

  processRecord (record: DataRecord): void {
    // 이 코드는 타이트한 루프에서 호출됨
    const colKey: any[] = []
    const rowKey: any[] = []

    for (const x of this.props.cols) {
      colKey.push(x in record ? record[x] : 'null')
    }
    for (const x of this.props.rows) {
      rowKey.push(x in record ? record[x] : 'null')
    }

    const flatRowKey = rowKey.join(String.fromCharCode(0)) as FlatKey
    const flatColKey = colKey.join(String.fromCharCode(0)) as FlatKey

    this.allTotal.push(record)

    if (rowKey.length !== 0) {
      if (!this.rowTotals[flatRowKey]) {
        this.rowKeys.push(rowKey)
        this.rowTotals[flatRowKey] = this.aggregator(this, rowKey, [])
      }
      this.rowTotals[flatRowKey].push(record)
    }

    if (colKey.length !== 0) {
      if (!this.colTotals[flatColKey]) {
        this.colKeys.push(colKey)
        this.colTotals[flatColKey] = this.aggregator(this, [], colKey)
      }
      this.colTotals[flatColKey].push(record)
    }

    if (colKey.length !== 0 && rowKey.length !== 0) {
      if (!this.tree[flatRowKey]) {
        this.tree[flatRowKey] = {}
      }
      if (!this.tree[flatRowKey][flatColKey]) {
        this.tree[flatRowKey][flatColKey] = this.aggregator(
          this,
          rowKey,
          colKey
        )
      }
      this.tree[flatRowKey][flatColKey].push(record)
    }
  }

  getAggregator (rowKey: any[], colKey: any[]): AggregatorInstance {
    const flatRowKey = rowKey.join(String.fromCharCode(0)) as FlatKey
    const flatColKey = colKey.join(String.fromCharCode(0)) as FlatKey

    let agg: AggregatorInstance | undefined

    if (rowKey.length === 0 && colKey.length === 0) {
      agg = this.allTotal
    } else if (rowKey.length === 0) {
      agg = this.colTotals[flatColKey]
    } else if (colKey.length === 0) {
      agg = this.rowTotals[flatRowKey]
    } else {
      agg = this.tree[flatRowKey]?.[flatColKey]
    }

    return agg || {
      value: () => null,
      format: () => '',
      push: () => { }
    }
  }

  // Static method for processing records
  static forEachRecord (
    input: DataRecord[] | DataRecord[][] | ((callback: (record: DataRecord) => void) => void),
    derivedAttributes: Record<string, (record: DataRecord) => RecordValue>,
    f: (record: DataRecord) => void
  ): void {
    let addRecord: (record: DataRecord) => void

    if (Object.getOwnPropertyNames(derivedAttributes).length === 0) {
      addRecord = f
    } else {
      addRecord = (record: DataRecord) => {
        for (const k in derivedAttributes) {
          const derived = derivedAttributes[k](record)
          if (derived !== null) {
            record[k] = derived
          }
        }
        return f(record)
      }
    }

    // 함수인 경우, 콜백으로 호출
    if (typeof input === 'function') {
      return input(addRecord)
    } else if (Array.isArray(input)) {
      if (input.length > 0 && Array.isArray(input[0])) {
        // 배열의 배열 - 첫 번째 행이 헤더인 경우
        const firstRow = input[0] as unknown as any[]
        for (let i = 1; i < input.length; i++) {
          const compactRecord = input[i] as any[]
          const record: DataRecord = {}
          for (let j = 0; j < firstRow.length; j++) {
            const k = String(firstRow[j] || `col_${j}`)
            record[k] = compactRecord[j]
          }
          addRecord(record)
        }
        return
      }

      // 객체의 배열 - 타입 가드로 안전하게 처리
      const dataArray = input as DataRecord[]
      for (const record of dataArray) {
        addRecord(record)
      }
      return
    }

    throw new Error('unknown input format')
  }
}

// ==================== Export ====================

export {
  // 타입들
  type NumberFormatOptions,
  type Formatter,
  type SortFunction,
  type RecordValue,
  type DataRecord,
  type AggregatorInstance,
  type AggregatorFunction,
  type AggregatorTemplate,
  type AggregatorTemplates,
  type PivotDataProps,
  type PivotDataContext,
  type LocaleStrings,
  type Locale,
  type Derivers,
  type AttributeName,
  type FlatKey,
  type NumericValue,

  // 함수들과 객체들
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