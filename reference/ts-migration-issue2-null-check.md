# TypeScript null/undefined 체크 강화: 집계 함수별 변경 내역

## 개요

- 기존 JS/TS 동작을 100% 유지하면서, strictNullChecks 등 TypeScript strict 옵션에 맞는 null/undefined 안전성 강화
- 값이 없거나 잘못된 값(null, undefined, NaN 등)은 집계에 포함하지 않고, 명확하게 NaN으로 처리하여 데이터 신뢰성과 타입 안전성을 확보
- **실제 코드가 Before/After로 바뀐 6가지 집계 함수만 다룸**

---

## 1. uniques (고유값 집계)

### Before

```ts
push (record: DataRecord) {
  if (!this.uniq.includes(record[attr])) {
    this.uniq.push(record[attr])
  }
}
```

### After

```ts
push (record: DataRecord) {
  const value = record?.[attr]
  if (!this.uniq.includes(value)) {
    this.uniq.push(value)
  }
}
```

### 변경 이유 및 의미

- 옵셔널 체이닝으로 안전하게 접근
- null/undefined도 고유값에 포함(기존 동작 유지)
- 타입 안전성 강화

---

## 2. sum (합계 집계)

### Before

```ts
push (record: DataRecord) {
  const val = parseFloat(String(record[attr]))
  if (!isNaN(val)) {
    this.sum += val
  }
}
```

### After

```ts
push (record: DataRecord) {
  const raw = record?.[attr]
  const val = raw != null ? parseFloat(String(raw)) : NaN
  if (!isNaN(val)) {
    this.sum += val
  }
}
```

### 변경 이유 및 의미

- null/undefined면 NaN으로 명확하게 처리
- NaN은 합계에 더하지 않음(기존 동작 유지)
- strictNullChecks 환경에서 안전

---

## 3. extremes (최댓값/최솟값/첫값/끝값 집계)

### Before

```ts
push (record: DataRecord) {
  let x = record[attr]
  const numX = parseFloat(String(x))
  if (!isNaN(numX)) {
    this.val = Math[mode](numX, this.val !== null ? this.val : numX)
  }
}
```

### After

```ts
push (record: DataRecord) {
  const raw = record?.[attr]
  let x = raw
  const numX = x != null ? parseFloat(String(x)) : NaN
  if (!isNaN(numX)) {
    this.val = Math[mode as 'min' | 'max'](numX, this.val !== null ? this.val : numX)
  }
}
```

### 변경 이유 및 의미

- null/undefined면 NaN으로 처리, 비교에서 무시
- 값이 없으면 집계에 포함되지 않음(기존 동작 유지)
- 타입 안전성 강화

---

## 4. quantile (분위수 집계)

### Before

```ts
push (record: DataRecord) {
  const x = parseFloat(String(record[attr]))
  if (!isNaN(x)) {
    this.vals.push(x)
  }
}
```

### After

```ts
push (record: DataRecord) {
  const raw = record?.[attr]
  const x = raw != null ? parseFloat(String(raw)) : NaN
  if (!isNaN(x)) {
    this.vals.push(x)
  }
}
```

### 변경 이유 및 의미

- null/undefined면 NaN, 분위수 계산에서 무시
- 값이 없으면 value()에서 null 반환
- 타입 안전성 강화

---

## 5. runningStat (평균/분산/표준편차 집계)

### Before

```ts
push (record: DataRecord) {
  const x = parseFloat(String(record[attr]))
  if (isNaN(x)) {
    return
  }
  ...
}
```

### After

```ts
push (record: DataRecord) {
  const raw = record?.[attr]
  const x = raw != null ? parseFloat(String(raw)) : NaN
  if (isNaN(x)) {
    return
  }
  ...
}
```

### 변경 이유 및 의미

- null/undefined면 NaN, 통계량 누적에서 무시
- 값이 없으면 value()에서 NaN 또는 0 반환
- 타입 안전성 강화

---

## 6. sumOverSum (분자/분모 합계 비율 집계)

### Before

```ts
push (record: DataRecord) {
  const numVal = parseFloat(String(record[num]))
  const denomVal = parseFloat(String(record[denom]))
  if (!isNaN(numVal)) { this.sumNum += numVal }
  if (!isNaN(denomVal)) { this.sumDenom += denomVal }
}
```

### After

```ts
push (record: DataRecord) {
  const rawNum = record?.[num]
  const rawDenom = record?.[denom]
  const numVal = rawNum != null ? parseFloat(String(rawNum)) : NaN
  const denomVal = rawDenom != null ? parseFloat(String(rawDenom)) : NaN
  if (!isNaN(numVal)) { this.sumNum += numVal }
  if (!isNaN(denomVal)) { this.sumDenom += denomVal }
}
```

### 변경 이유 및 의미

- null/undefined면 NaN, 합계에 더하지 않음
- 분모가 0이면 JS 표준 동작(무한대, NaN 등)
- 타입 안전성 강화

---

## 결론

- 모든 변경은 기존 동작(값이 없으면 집계에서 무시)을 100% 유지
- strictNullChecks 등 TS strict 옵션에서 타입 안전성만 강화
- 실무 데이터 신뢰성, 유지보수성, 협업 효율성 모두 향상
