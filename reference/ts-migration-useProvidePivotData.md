# useProvidePivotData.js → useProvidePivotData.ts TypeScript 마이그레이션 상세 기록

## 브랜치명

`feature/useProvidePivotData-ts` (기반: develop)

---

## 1. 개요

- 기존 Vue 3 Composition API 기반의 JS 유틸리티 useProvidePivotData.js를 TypeScript로 변환
- 타입 안정성, IDE 자동완성, 추후 유지보수성 강화 목적
- 기존 로직/동작 100% 유지, 타입 명시 및 오류 방지에 집중

---

## 2. 주요 변경 내역

### 2.1 파일 확장자 및 import 경로 변경

- src/composables/useProvidePivotData.js → src/composables/useProvidePivotData.ts
- 타입 선언은 `@/helper/utilities.d`에서, 실제 클래스는 `@/helper/utilities.js`에서 import

```ts
import type { PivotData } from '@/helper/utilities.d'
import { PivotData as PivotDataClass } from '@/helper/utilities.js'
```

---

### 2.2 props 및 반환 객체 타입 명시

- ProvidePivotDataProps 인터페이스로 props 타입 정의 (heatmapMode, tableColorScaleGenerator 등)
- 반환 객체는 PivotDataContext로 명확히 타입화

---

### 2.3 내부 변수 및 함수 타입 지정

- error, pivotData, rowKeys, colKeys, colAttrs, rowAttrs 등 모두 Ref/ComputedRef로 타입 지정
- getAggregator, valueCellColors, spanSize 등 함수 시그니처에 타입 명시

---

### 2.4 any[] 인덱스 접근 → string 변환(JSON.stringify)

- 객체 인덱스에 배열을 직접 사용하는 부분을 string 변환하여 타입 오류 방지

```ts
const key = JSON.stringify(r)
scales[key] = ...
...
return rowColorScales.value[JSON.stringify(rowKey)]?.(value)
```

---

### 2.5 타입 선언과 실제 구현 분리

- 타입은 .d.ts에서, 실제 클래스는 .js에서 import
- 타입스크립트 환경에서 타입 정보와 런타임 객체를 명확히 분리하여 linter 오류 해결

---

## 3. 전체 코드 예시 (핵심 부분)

```ts
import { Ref, ref, provide, inject, computed, ComputedRef } from 'vue'
import type { PivotData } from '@/helper/utilities.d'
import { PivotData as PivotDataClass } from '@/helper/utilities.js'

const PIVOT_DATA_KEY = Symbol('pivotData')

export function providePivotData(
  props: ProvidePivotDataProps
): PivotDataContext {
  // ... (상세 구현은 실제 파일 참고)
}
export function useProvidePivotData(): PivotDataContext | undefined {
  return inject<PivotDataContext>(PIVOT_DATA_KEY)
}
```

---

## 4. 마이그레이션 과정에서 고려한 점

- 기존 JS 코드의 동작을 100% 유지
- 타입스크립트 strict 옵션(특히 noImplicitAny, strictNullChecks 등)에서 오류 없이 동작하도록 타입 명시
- 외부에서 사용할 때 타입 추론 및 자동완성 지원 강화
- 기존 레퍼런스 문서의 포맷을 참고하되, 실제 코드와 타입 선언을 최대한 상세하게 기록

---

## 5. 결론 및 참고

- useProvidePivotData.ts는 이제 타입 안정성과 유지보수성이 크게 향상됨
- 추후 다른 composable 함수 변환 시에도 이 패턴을 참고할 것
- 관련 브랜치: `feature/useProvidePivotData-ts`
- 관련 이슈: [#134](https://github.com/vue-pivottable/vue3-pivottable/issues/134)

---

> **참고:**  
> 기존 레퍼런스 문서(예: ts-migration-issue3-type-casting.md, ts-migration-tutorial.md)
