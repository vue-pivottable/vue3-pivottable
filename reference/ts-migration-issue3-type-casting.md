# TypeScript 타입 캐스팅 최소화 및 타입 안전성 강화: 변경 내역

## 개요

- 기존 any, as 등 타입 캐스팅을 최소화하고, strictNullChecks/noImplicitAny 등 strict 옵션에 맞는 타입 안전성 강화
- 실제 diff(코드 변경) 기준으로만 설명
- 기존 동작(런타임 결과)은 100% 유지

---

## 1. SortFunction 타입 명확화

### Before

```ts
type SortFunction = (a: any, b: any) => number
```

### After

```ts
type SortFunction = (
  a: string | number | null | undefined,
  b: string | number | null | undefined
) => number
```

### 변경 이유 및 의미

- any 대신 실제 비교 대상이 될 수 있는 타입으로 명확화
- 타입 안전성 강화, noImplicitAny 위배 방지

---

## 2. AggregatorInstance 등 내부 배열/값 타입 명확화

### Before

```ts
uniq?: any[]
val?: any
selector?: [any[], any[]]
value: () => any
format?: Formatter | ((x: any) => string)
```

### After

```ts
uniq?: (string | number | null | undefined)[]
val?: string | number | null
selector?: [string[] | number[] | null[] | undefined[], string[] | number[] | null[] | undefined[]]
value: () => string | number | null
format?: Formatter | ((x: string | number | null | undefined) => string)
```

### 변경 이유 및 의미

- any[] 등 대신 실제 데이터 타입으로 명확화
- 타입 추론, IDE 지원, 타입 안전성 강화

---

## 3. AggregatorFunction, AggregatorTemplate 시그니처 개선

### Before

```ts
type AggregatorFunction = (
  data?: PivotDataContext,
  rowKey?: any[],
  colKey?: any[]
) => AggregatorInstance
type AggregatorTemplate = (...args: any[]) => AggregatorFunction
```

### After

```ts
type AggregatorFunction = (
  data?: PivotDataContext,
  rowKey?: (string | number | null | undefined)[],
  colKey?: (string | number | null | undefined)[]
) => AggregatorInstance
type AggregatorTemplate = (...args: unknown[]) => AggregatorFunction
```

### 변경 이유 및 의미

- any[] → 실제 데이터 타입 배열로 명확화
- ...args: any[] → ...args: unknown[]로 최소한의 타입 안전성 확보

---

## 4. as any[], as [any[], any[]], as any 등 최소화

### Before

```ts
uniq: [] as any[]
selector: ... as [any[], any[]]
val: null as any
sorter: getSort(typeof data !== 'undefined' ? (data as any).sorters : null, attr)
```

### After

```ts
uniq: [] as (string | number | null | undefined)[]
selector: ... as [string[] | number[] | null[] | undefined[], string[] | number[] | null[] | undefined[]]
val: null as string | number | null
sorter: getSort(typeof data !== 'undefined' ? (data as { sorters?: Record<string, SortFunction> })?.sorters : null, attr)
```

### 변경 이유 및 의미

- 배열, 객체, 변수의 타입을 실제 사용되는 값에 맞게 구체적으로 지정
- as any 최소화, 불가피한 경우에는 타입 유틸리티/주석으로 명확히 설명

---

## 5. 함수 시그니처의 any → 명확한 타입

### Before

```ts
uniques (fn: (uniq: any[]) => any, formatter: Formatter = usFmtInt): AggregatorTemplate
fractionOf (...x: any[]): ...
```

### After

```ts
uniques (fn: (uniq: (string | number | null | undefined)[]) => string | number, formatter: Formatter = usFmtInt): AggregatorTemplate
fractionOf (...x: unknown[]): ...
```

### 변경 이유 및 의미

- any[] → 실제 데이터 타입 배열로 명확화
- ...x: any[] → ...x: unknown[]로 최소한의 타입 안전성 확보

---

## 6. PivotData 등 클래스/타입 선언 개선

### Before

```ts
public rowKeys: any[][]
public colKeys: any[][]
forEachMatchingRecord (criteria: Record<string, any>, callback: (record: DataRecord) => void): void
getColKeys (): any[][]
getRowKeys (): any[][]
```

### After

```ts
public rowKeys: (string | number | null | undefined)[][]
public colKeys: (string | number | null | undefined)[][]
forEachMatchingRecord (criteria: Record<string, string | number | null | undefined>, callback: (record: DataRecord) => void): void
getColKeys (): (string | number | null | undefined)[][]
getRowKeys (): (string | number | null | undefined)[][]
```

### 변경 이유 및 의미

- any[] → 실제 키 타입으로 명확화
- 타입 추론, IDE 지원, 타입 안전성 모두 강화

---

## 7. as FlatKey, as unknown as any[] 등

### Before

```ts
const flatRowKey = rowKey.join(String.fromCharCode(0)) as FlatKey
const flatColKey = colKey.join(String.fromCharCode(0)) as FlatKey
const firstRow = input[0] as unknown as any[]
```

### After

```ts
const flatRowKey = rowKey.join(String.fromCharCode(0)) as FlatKey // 브랜드 타입은 의도적 단언이므로 유지
const flatColKey = colKey.join(String.fromCharCode(0)) as FlatKey // 브랜드 타입은 의도적 단언이므로 유지
const firstRow = input[0] as (string | number | null | undefined)[]
```

### 변경 이유 및 의미

- 브랜드 타입(FlatKey)은 의도적 타입 단언이므로 유지
- any[] 대신 실제 데이터 타입 배열로 명확화

---

## 결론

- any, as 등 타입 캐스팅을 최소화하고, strictNullChecks/noImplicitAny 등 strict 옵션에 맞는 타입 안전성만 강화
- 기존 동작(런타임 결과)은 100% 유지
- 타입 추론, IDE 지원, 협업 효율성, 유지보수성 모두 향상
