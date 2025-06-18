---
title: utilities.js → utilities.ts 마이그레이션 튜토리얼
date: '2025-01-28'
tags: ['javascript', 'typescript', 'migration']
categories: TypeScript
permalink: /tutorial/:year/:month/:day/:title/
last_modified_at: '2025-01-28'
---

> **대상**: TypeScript를 처음 시작하는 10년차 프론트엔드 개발자  
> **목표**: utilities.js를 TypeScript로 안전하게 변환하고 타입 시스템의 이점을 이해하기

<!--more-->

## 📚 목차

1. [마이그레이션 개요](#1-마이그레이션-개요)
2. [기본 타입 변환 패턴](#2-기본-타입-변환-패턴)
3. [브랜드 타입 활용](#3-브랜드-타입-활용)
4. [함수 타입 안전성 강화](#4-함수-타입-안전성-강화)
5. [클래스와 인터페이스 설계](#5-클래스와-인터페이스-설계)
6. [실무 적용 가이드](#6-실무-적용-가이드)

---

## 1. 마이그레이션 개요

### 1.1 왜 TypeScript로 변환해야 할까요?

**기존 JavaScript 코드의 문제점:**

```javascript
// utilities.js - 기존 코드
const addSeparators = function (nStr, thousandsSep, decimalSep) {
  // 파라미터 타입이 불분명
  // nStr이 숫자인지 문자열인지 알 수 없음
  const x = String(nStr).split('.')
  // ...
}
```

**TypeScript 변환 후:**

```typescript
// utilities.ts - 변환된 코드
const addSeparators = (
  nStr: string | number,
  thousandsSep: string,
  decimalSep: string
): string => {
  // ✅ 파라미터 타입 명확
  // ✅ 반환 타입 보장
  // ✅ IDE 자동완성 지원
  const x = String(nStr).split('.')
  // ...
}
```

### 1.2 변환 전략

**점진적 마이그레이션 접근법:**

1. **1단계**: 파일 확장자 변경 (.js → .ts)
2. **2단계**: 기본 타입 추가 (함수 파라미터, 반환값)
3. **3단계**: 인터페이스 정의 (복잡한 객체)
4. **4단계**: 고급 타입 활용 (브랜드 타입, 제네릭)

---

## 2. 기본 타입 변환 패턴

### 2.1 함수 파라미터 타입 지정

**Before (JavaScript):**

```javascript
const numberFormat = function (optsIn) {
  const defaults = {
    digitsAfterDecimal: 2,
    scaler: 1,
    thousandsSep: ',',
    decimalSep: '.',
    prefix: '',
    suffix: ''
  }
  const opts = Object.assign({}, defaults, optsIn)

  return function (x) {
    if (isNaN(x) || !isFinite(x)) {
      return ''
    }
    // ...
  }
}
```

**After (TypeScript):**

```typescript
// 📝 학습 포인트 1: 인터페이스로 옵션 타입 정의
interface NumberFormatOptions {
  digitsAfterDecimal?: number // ❓ 선택적 속성
  scaler?: number
  thousandsSep?: string
  decimalSep?: string
  prefix?: string
  suffix?: string
}

// 📝 학습 포인트 2: 함수 타입 별칭
type Formatter = (value: number) => string

const numberFormat = (optsIn?: NumberFormatOptions): Formatter => {
  const defaults: Required<NumberFormatOptions> = {
    // ⚡ Required<T>로 모든 속성을 필수로 만듦
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
    // ...
  }
}
```

**💡 학습 내용:**

- `interface`: 객체 구조 정의
- `?`: 선택적 속성 (optional property)
- `Required<T>`: 모든 속성을 필수로 변환하는 유틸리티 타입
- `type`: 타입 별칭으로 복잡한 타입을 간단하게 표현

### 2.2 배열과 객체 타입

**Before (JavaScript):**

```javascript
const naturalSort = (as, bs) => {
  // as, bs 타입 불분명
  // 비교 로직...
}
```

**After (TypeScript):**

```typescript
// 📝 학습 포인트 3: 함수 시그니처 타입
type SortFunction = (a: any, b: any) => number

const naturalSort: SortFunction = (as: any, bs: any): number => {
  // ✅ 명확한 반환 타입 (정렬 함수는 항상 숫자 반환)
  // 비교 로직...
  return 0 // -1, 0, 1 중 하나
}
```

**💡 학습 내용:**

- 정렬 함수는 항상 `number`를 반환해야 함
- `any` 타입은 최후의 수단으로만 사용
- 함수 시그니처를 타입으로 정의하면 재사용 가능

---

## 3. 브랜드 타입 활용

### 3.1 브랜드 타입이란?

**문제 상황:**

```javascript
// JavaScript - 문제가 되는 코드
const studentId = '2024001'
const lockerId = '2024001'

function findStudent(id) {
  // 학생을 찾는 함수
}

findStudent(lockerId) // 😱 실수! 사물함 번호를 넣었는데 에러가 안남!
```

**해결책: 브랜드 타입**

```typescript
// 📝 학습 포인트 4: 브랜드 타입으로 같은 타입이지만 다른 의미 구분
type AttributeName = string & { readonly __brand: unique symbol }
type FlatKey = string & { readonly __brand: unique symbol }
type NumericValue = number & { readonly __brand: unique symbol }

// 사용 예시
const flatRowKey = rowKey.join(String.fromCharCode(0)) as FlatKey
const flatColKey = colKey.join(String.fromCharCode(0)) as FlatKey

// ✅ 이제 FlatKey 타입만 받는 함수에 일반 string을 넣으면 에러 발생
```

**💡 학습 내용:**

- 브랜드 타입: 같은 기본 타입이지만 의미적으로 다른 값들을 구분
- `unique symbol`: 절대 겹치지 않는 특별한 식별자
- `readonly`: 속성이 읽기 전용임을 명시
- 런타임에는 브랜드가 사라지므로 성능 영향 없음

### 3.2 실무에서 브랜드 타입 활용

**Before (위험한 코드):**

```javascript
function processRecord(record) {
  const flatRowKey = rowKey.join('\0')  // 구분자로 합침
  const flatColKey = colKey.join('\0')

  // 실수로 rowKey와 colKey를 바꿔서 사용할 위험
  this.tree[flatColKey][flatRowKey] = // 😱 잘못된 순서!
}
```

**After (안전한 코드):**

```typescript
type FlatRowKey = string & { readonly __brand: unique symbol }
type FlatColKey = string & { readonly __brand: unique symbol }

processRecord(record: DataRecord): void {
  const flatRowKey = rowKey.join(String.fromCharCode(0)) as FlatRowKey
  const flatColKey = colKey.join(String.fromCharCode(0)) as FlatColKey

  // ✅ 타입이 다르므로 순서를 바꾸면 컴파일 에러
  this.tree[flatRowKey][flatColKey] = // 올바른 순서
}
```

---

## 4. 함수 타입 안전성 강화

### 4.1 복잡한 함수 타입 정의

**Before (JavaScript):**

```javascript
const aggregatorTemplates = {
  count(formatter = usFmtInt) {
    return () => () => ({
      count: 0,
      push() {
        this.count++
      },
      value() {
        return this.count
      },
      format: formatter
    })
  }
}
```

**After (TypeScript):**

```typescript
// 📝 학습 포인트 5: 복잡한 함수 체이닝 타입 정의
interface AggregatorInstance {
  count?: number
  sum?: number
  vals?: number[]
  // ... 기타 속성들
  push: (record: DataRecord) => void // 필수 메서드
  value: () => any // 필수 메서드
  format?: Formatter | ((x: any) => string) // 선택적 메서드
  numInputs?: number
}

type AggregatorFunction = (
  data?: PivotDataContext,
  rowKey?: any[],
  colKey?: any[]
) => AggregatorInstance
type AggregatorTemplate = (...args: any[]) => AggregatorFunction

interface AggregatorTemplates {
  count: (formatter?: Formatter) => AggregatorTemplate
  sum: (formatter?: Formatter) => AggregatorTemplate
  // ... 기타 메서드들
}

const aggregatorTemplates: AggregatorTemplates = {
  count(formatter: Formatter = usFmtInt): AggregatorTemplate {
    return () => (): AggregatorInstance => ({
      count: 0,
      push() {
        this.count++
      },
      value() {
        return this.count
      },
      format: formatter
    })
  }
}
```

**💡 학습 내용:**

- 고차 함수(함수를 반환하는 함수)의 타입 정의
- 메서드 체이닝을 위한 인터페이스 설계
- 선택적 속성과 필수 속성의 구분

### 4.2 제네릭 없이 타입 안전성 확보

**학습 포인트 6: 제네릭 대신 명시적 타입 사용**

```typescript
// ❌ 초보자에게 복잡한 제네릭
function createAggregator<T extends AggregatorInstance>(
  config: AggregatorConfig<T>
): AggregatorFunction<T> { ... }

// ✅ 명시적 타입으로 단순화
function createCountAggregator(formatter?: Formatter): AggregatorFunction {
  return (data?: PivotDataContext, rowKey?: any[], colKey?: any[]): AggregatorInstance => {
    // 구현...
  }
}
```

**💡 학습 내용:**

- 처음에는 제네릭보다 명시적 타입이 이해하기 쉬움
- 타입 안전성을 위해 단계적으로 복잡도 증가
- 실무에서는 가독성과 유지보수성이 더 중요

---

## 5. 클래스와 인터페이스 설계

### 5.1 클래스 속성 타입 정의

**Before (JavaScript):**

```javascript
class PivotData {
  constructor(inputProps = {}) {
    this.props = Object.assign({}, PivotData.defaultProps, inputProps)
    this.aggregator = this.props.aggregators[this.props.aggregatorName]
    this.tree = {}
    this.rowKeys = []
    // ...
  }
}
```

**After (TypeScript):**

```typescript
// 📝 학습 포인트 7: 클래스 속성의 명시적 타입 선언
class PivotData {
  // ✅ 모든 속성의 타입을 미리 선언
  public static defaultProps: Required<PivotDataProps> = { ... }

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
    this.aggregator = this.props.aggregators[this.props.aggregatorName]!
    this.tree = {}
    this.rowKeys = []
    this.colKeys = []
    // ...
  }
}
```

**💡 학습 내용:**

- `public`: 외부에서 접근 가능한 속성
- `Record<K, V>`: 객체 타입의 명시적 표현
- `Partial<T>`: 모든 속성을 선택적으로 만드는 유틸리티 타입
- `!`: Non-null assertion operator (null이 아님을 확신할 때 사용)

### 5.2 메서드 타입 정의

**학습 포인트 8: 메서드의 입력/출력 타입 명시**

```typescript
class PivotData {
  // ✅ 메서드의 파라미터와 반환 타입 명시
  filter(record: DataRecord): boolean {
    // boolean 반환 보장
    const allSelector = '*'
    // ...
    return true
  }

  forEachMatchingRecord(
    criteria: Record<string, any>,
    callback: (record: DataRecord) => void
  ): void {
    // void 반환 (아무것도 반환하지 않음)
    // ...
  }

  getAggregator(rowKey: any[], colKey: any[]): AggregatorInstance {
    // AggregatorInstance 반환 보장
    // ...
    return (
      agg || {
        value: () => null,
        format: () => '',
        push: () => {}
      }
    )
  }
}
```

**💡 학습 내용:**

- 메서드는 반드시 선언된 타입을 반환해야 함
- `void`: 아무것도 반환하지 않는 함수
- 기본값 객체로 null 체크 없이 안전한 반환

---

## 6. 실무 적용 가이드

### 6.1 마이그레이션 체크리스트

**단계별 체크리스트:**

```typescript
// ✅ 1단계: 기본 타입 변환
const addSeparators = (
  nStr: string | number,
  thousandsSep: string,
  decimalSep: string
): string => {
  // 함수 파라미터와 반환 타입 명시
}

// ✅ 2단계: 인터페이스 정의
interface NumberFormatOptions {
  digitsAfterDecimal?: number
  // ...
}

// ✅ 3단계: 복잡한 타입 정의
type AggregatorFunction = (
  data?: PivotDataContext,
  rowKey?: any[],
  colKey?: any[]
) => AggregatorInstance

// ✅ 4단계: 브랜드 타입 활용
type FlatKey = string & { readonly __brand: unique symbol }

// ✅ 5단계: 클래스 속성 타입 선언
class PivotData {
  public props: Required<PivotDataProps>
  // ...
}
```

### 6.2 자주 발생하는 에러와 해결법

**에러 1: "개체가 'null' 또는 'undefined'인 것 같습니다"**

```typescript
// ❌ 문제가 되는 코드
const valueFilterItem = this.props.valueFilter[k]
if (record[k] in valueFilterItem) {
  // 에러! valueFilterItem이 undefined일 수 있음
  // ...
}

// ✅ 해결된 코드
const valueFilterItem = this.props.valueFilter[k]
if (valueFilterItem && record[k] in valueFilterItem) {
  // null 체크 추가
  // ...
}
```

**에러 2: "형식을 할당할 수 없습니다"**

```typescript
// ❌ 문제가 되는 코드
const headers = input[0] as string[] // DataRecord[]를 string[]로 변환 불가

// ✅ 해결된 코드
const firstRow = input[0] as unknown as any[] // unknown을 거쳐서 안전하게 변환
```

**에러 3: "호출 시그니처가 호환되지 않습니다"**

```typescript
// ❌ 문제가 되는 코드
'Count': aggregatorTemplates.count(usFmtInt),  // AggregatorTemplate을 AggregatorFunction에 할당

// ✅ 해결된 코드
'Count': aggregatorTemplates.count(usFmtInt)(),  // ()를 추가해서 AggregatorFunction 반환
```

### 6.3 IDE 활용법

**VSCode에서 TypeScript 효과적으로 사용하기:**

1. **자동완성 활용**: `Ctrl + Space`로 타입 정보 확인
2. **타입 정보 확인**: `Ctrl + 마우스 호버`로 타입 확인
3. **에러 네비게이션**: `F8`로 다음 에러로 이동
4. **리팩토링**: `F2`로 안전한 이름 변경

### 6.4 점진적 타입 강화 전략

**Level 1: 기본 타입 (시작 단계)**

```typescript
function processData(data: any[], callback: Function): void {
  // any와 Function 사용으로 시작
}
```

**Level 2: 구체적 타입 (중간 단계)**

```typescript
function processData(
  data: DataRecord[],
  callback: (record: DataRecord) => void
): void {
  // 구체적인 타입 사용
}
```

**Level 3: 브랜드 타입 (고급 단계)**

```typescript
function processData(
  data: DataRecord[],
  callback: (record: DataRecord) => void,
  options: ProcessingOptions & { __validated: unique symbol }
): void {
  // 브랜드 타입으로 검증된 옵션만 허용
}
```

### 6.5 성능 고려사항

**TypeScript는 개발 시에만 영향:**

```typescript
// 📝 TypeScript 코드
type UserId = string & { readonly __brand: unique symbol }
const userId: UserId = 'user123' as UserId

// 🔄 컴파일 후 JavaScript
const userId = 'user123' // 브랜드 타입 정보 완전히 제거
```

**성능 팁:**

- 타입 체크는 빌드 시에만 발생
- 런타임 성능에 영향 없음
- 오히려 에러 사전 방지로 실행 시 안정성 향상

---

## 📋 마이그레이션 요약

### 변환 전후 비교

| 구분            | Before (JavaScript) | After (TypeScript)   |
| --------------- | ------------------- | -------------------- |
| **타입 안전성** | 런타임에 에러 발견  | 컴파일 시 에러 방지  |
| **IDE 지원**    | 제한적 자동완성     | 강력한 IntelliSense  |
| **리팩토링**    | 수동 검색/수정      | 안전한 자동 리팩토링 |
| **문서화**      | 별도 주석 필요      | 타입이 문서 역할     |
| **협업**        | 함수 사용법 추측    | 명확한 인터페이스    |

### 핵심 학습 포인트

1. **점진적 적용**: .js → .ts 확장자 변경부터 시작
2. **인터페이스 우선**: 복잡한 객체는 인터페이스로 정의
3. **브랜드 타입**: 같은 타입이지만 의미가 다른 값들 구분
4. **null 체크**: TypeScript는 null 안전성을 강제
5. **타입 가드**: 안전한 타입 변환을 위한 체크 로직

### 다음 단계

utilities.ts 마이그레이션을 완료했다면:

1. **다른 헬퍼 파일들** 순차적 변환
2. **Vue 컴포넌트** TypeScript 적용
3. **API 타입 정의** 추가
4. **테스트 코드** TypeScript 변환

**🎯 목표**: 타입 안전한 Vue 3 + TypeScript 프로젝트 완성!
