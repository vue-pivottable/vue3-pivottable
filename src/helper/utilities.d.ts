type AttributeName = string & {
    readonly __brand: unique symbol;
};
type FlatKey = string & {
    readonly __brand: unique symbol;
};
type NumericValue = number & {
    readonly __brand: unique symbol;
};
interface NumberFormatOptions {
    digitsAfterDecimal?: number;
    scaler?: number;
    thousandsSep?: string;
    decimalSep?: string;
    prefix?: string;
    suffix?: string;
}
type Formatter = (value: number) => string;
type SortFunction = (a: any, b: any) => number;
type RecordValue = string | number;
type DataRecord = Record<string, RecordValue>;
interface AggregatorInstance {
    count?: number;
    sum?: number;
    vals?: number[];
    uniq?: any[];
    val?: any;
    sorter?: SortFunction;
    n?: number;
    m?: number;
    s?: number;
    sumNum?: number;
    sumDenom?: number;
    selector?: [any[], any[]];
    inner?: AggregatorInstance;
    push: (record: DataRecord) => void;
    value: () => any;
    format?: Formatter | ((x: any) => string);
    numInputs?: number;
}
type AggregatorFunction = (data?: PivotDataContext, rowKey?: any[], colKey?: any[]) => AggregatorInstance;
type AggregatorTemplate = (...args: any[]) => AggregatorFunction;
interface AggregatorTemplates {
    count: (formatter?: Formatter) => AggregatorTemplate;
    uniques: (fn: (uniq: any[]) => any, formatter?: Formatter) => AggregatorTemplate;
    sum: (formatter?: Formatter) => AggregatorTemplate;
    extremes: (mode: 'min' | 'max' | 'first' | 'last', formatter?: Formatter) => AggregatorTemplate;
    quantile: (q: number, formatter?: Formatter) => AggregatorTemplate;
    runningStat: (mode: 'mean' | 'var' | 'stdev', ddof?: number, formatter?: Formatter) => AggregatorTemplate;
    sumOverSum: (formatter?: Formatter) => AggregatorTemplate;
    fractionOf: (wrapped: AggregatorTemplate, type?: 'total' | 'row' | 'col', formatter?: Formatter) => AggregatorTemplate;
    countUnique: (formatter?: Formatter) => AggregatorTemplate;
    listUnique: (separator: string) => AggregatorTemplate;
    max: (formatter?: Formatter) => AggregatorTemplate;
    min: (formatter?: Formatter) => AggregatorTemplate;
    first: (formatter?: Formatter) => AggregatorTemplate;
    last: (formatter?: Formatter) => AggregatorTemplate;
    median: (formatter?: Formatter) => AggregatorTemplate;
    average: (formatter?: Formatter) => AggregatorTemplate;
    var: (ddof: number, formatter?: Formatter) => AggregatorTemplate;
    stdev: (ddof: number, formatter?: Formatter) => AggregatorTemplate;
}
interface PivotDataProps {
    data: DataRecord[] | DataRecord[][] | ((callback: (record: DataRecord) => void) => void);
    aggregators?: Record<string, AggregatorTemplate>;
    cols?: string[];
    rows?: string[];
    vals?: string[];
    aggregatorName?: string;
    sorters?: Record<string, SortFunction> | ((attr: string) => SortFunction);
    valueFilter?: Record<string, Record<string, boolean>>;
    rowOrder?: 'key_a_to_z' | 'key_z_to_a' | 'value_a_to_z' | 'value_z_to_a';
    colOrder?: 'key_a_to_z' | 'key_z_to_a' | 'value_a_to_z' | 'value_z_to_a';
    derivedAttributes?: Record<string, (record: DataRecord) => RecordValue>;
}
interface PivotDataContext {
    getAggregator: (rowKey: any[], colKey: any[]) => AggregatorInstance;
}
interface LocaleStrings {
    renderError: string;
    computeError: string;
    uiRenderError: string;
    selectAll: string;
    selectNone: string;
    tooMany: string;
    filterResults: string;
    totals: string;
    vs: string;
    by: string;
    cancel: string;
    only: string;
    apply?: string;
}
interface Locale {
    aggregators?: Record<string, AggregatorTemplate>;
    frAggregators?: Record<string, AggregatorTemplate>;
    localeStrings: LocaleStrings;
}
interface Derivers {
    bin: (col: string, binWidth: number) => (record: DataRecord) => number;
    dateFormat: (col: string, formatString: string, utcOutput?: boolean, mthNames?: string[], dayNames?: string[]) => (record: DataRecord) => string;
}
declare const numberFormat: (optsIn?: NumberFormatOptions) => Formatter;
declare const naturalSort: SortFunction;
declare const sortAs: (order: any[]) => SortFunction;
declare const getSort: (sorters: Record<string, SortFunction> | ((attr: string) => SortFunction) | null, attr: string) => SortFunction;
declare const aggregatorTemplates: AggregatorTemplates;
declare const aggregators: Record<string, AggregatorTemplate>;
declare const locales: Record<string, Locale>;
declare const derivers: Derivers;
declare class PivotData {
    static defaultProps: Required<PivotDataProps>;
    props: Required<PivotDataProps>;
    aggregator: AggregatorFunction;
    tree: Record<string, Record<string, AggregatorInstance>>;
    rowKeys: any[][];
    colKeys: any[][];
    rowTotals: Record<string, AggregatorInstance>;
    colTotals: Record<string, AggregatorInstance>;
    allTotal: AggregatorInstance;
    sorted: boolean;
    filteredData: DataRecord[];
    constructor(inputProps?: Partial<PivotDataProps>);
    filter(record: DataRecord): boolean;
    forEachMatchingRecord(criteria: Record<string, any>, callback: (record: DataRecord) => void): void;
    arrSort(attrs: string[]): SortFunction;
    sortKeys(): void;
    getFilteredData(): DataRecord[];
    getColKeys(): any[][];
    getRowKeys(): any[][];
    processRecord(record: DataRecord): void;
    getAggregator(rowKey: any[], colKey: any[]): AggregatorInstance;
    static forEachRecord(input: DataRecord[] | DataRecord[][] | ((callback: (record: DataRecord) => void) => void), derivedAttributes: Record<string, (record: DataRecord) => RecordValue>, f: (record: DataRecord) => void): void;
}
export { type NumberFormatOptions, type Formatter, type SortFunction, type RecordValue, type DataRecord, type AggregatorInstance, type AggregatorFunction, type AggregatorTemplate, type AggregatorTemplates, type PivotDataProps, type PivotDataContext, type LocaleStrings, type Locale, type Derivers, type AttributeName, type FlatKey, type NumericValue, aggregatorTemplates, aggregators, derivers, locales, naturalSort, numberFormat, getSort, sortAs, PivotData };
