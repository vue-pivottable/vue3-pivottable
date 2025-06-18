---
title: VDropdown.vue TypeScript 변환 완전 가이드
date: "2025-05-28"
tags: [vue3, typescript]
categories: TypeScript
permalink: /blog/:year/:month/:day/:title/
last_modified_at: "2025-05-28"
---

## 📋 왜 VDropdown부터 시작할까요?

- ✅ **단순한 구조**: Props 2개, Event 1개
- ✅ **명확한 역할**: 드롭다운 선택 UI
- ✅ **타입 정의 연습하기 좋음**: 기본적인 패턴들 학습 가능
- ✅ **의존성 적음**: 다른 복잡한 컴포저블에 의존하지 않음

## 🔍 현재 VDropdown.vue 분석

### 코드 구조 파악

```vue
<template>
  <select v-model="valueModel" class="pvtDropdown">
    <option v-for="(text, key) in options" :key="key" :value="text">
      {{ text }}
    </option>
  </select>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  value: {
    type: String,
    default: ''
  }
})

const valueModel = ref(props.value || props.options[0])
const emit = defineEmits(['update:value'])

watch(valueModel, (newVal) => { 
  emit('update:value', newVal) 
}, { immediate: true })
</script>
```

### 🤔 분석 질문들

#### 1. Props 타입: `options`는 정확히 어떤 타입의 배열일까요?

<details>
<summary>💡 답변 보기</summary>
<div markdown="1">

**답변**: `string[]` 타입입니다.

템플릿을 보면 `v-for="(text, key) in options"`에서 각 항목이 `text`로 사용되고, `option`의 `value`와 내용으로 직접 사용됩니다. 이는 `options` 배열의 각 요소가 문자열임을 의미합니다.

```typescript
// 올바른 타입 정의
interface DropdownProps {
  options: string[]  // 문자열 배열
  value: string
}
```

</div>
</details>

#### 2. Value 타입: `value`는 항상 문자열일까요?

<details>
<summary>💡 답변 보기</summary>
<div markdown="1">

**답변**: 네, 현재 구현에서는 항상 `string` 타입입니다.

JavaScript 코드에서 `type: String`으로 정의되어 있고, HTML `select` 요소의 `value`는 항상 문자열로 처리됩니다. 따라서 TypeScript에서도 `string` 타입으로 정의하는 것이 맞습니다.

만약 숫자나 다른 타입도 지원하려면 제네릭을 사용해야 합니다.

</div>
</details>

#### 3. 이벤트 페이로드: `update:value`에는 어떤 타입이 전달될까요?

<details>
<summary>💡 답변 보기</summary>
<div markdown="1">

**답변**: `string` 타입이 전달됩니다.

`emit('update:value', newVal)`에서 `newVal`은 `valueModel`의 값이고, 이는 `select` 요소의 선택된 값이므로 문자열입니다.

```typescript
interface DropdownEmits {
  'update:value': [value: string]  // 튜플 형태로 정의
}
```

</div>
</details>

#### 4. 내부 상태: `valueModel`의 타입은 무엇일까요?

<details>
<summary>💡 답변 보기</summary>
<div markdown="1">

**답변**: `Ref<string>` 타입입니다.

`ref(props.value || props.options[0])`에서 두 값 모두 문자열이므로, Vue의 타입 추론에 의해 `Ref<string>`으로 추론됩니다.

```typescript
// 명시적 타입 지정
const valueModel = ref<string>(props.value || props.options[0] || '')
```

</div>
</details>

## 🛠️ TypeScript 변환 실습

### 직접 해보기 (TODO 형태)

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

// 🎯 TODO: Props 인터페이스 정의
interface DropdownProps {
  // 여기에 props 타입을 정의해보세요
  // 힌트: options는 문자열 배열? 아니면 다른 타입?
}

// 🎯 TODO: 이벤트 인터페이스 정의  
interface DropdownEmits {
  // 여기에 emit 이벤트 타입을 정의해보세요
}

const props = defineProps<DropdownProps>()
const emit = defineEmits<DropdownEmits>()

// 🎯 TODO: valueModel의 타입 정의
const valueModel = ref(/* 어떤 타입일까요? */)

// watch는 그대로 사용 가능
watch(valueModel, (newVal) => { 
  emit('update:value', newVal) 
}, { immediate: true })
</script>
```

## 🎯 도전 과제들

TypeScript 변환에 필요한 핵심 패턴들을 단계별로 연습해봅시다!

### 도전 1: Default Values 처리

<details>
<summary>🤔 생각해보기</summary>
<div markdown="1">

**문제**: 기존 JavaScript에서는 `default: () => []`로 기본값을 설정했는데, TypeScript에서는 어떻게 처리할까요?

```javascript
// 기존 JavaScript 방식
const props = defineProps({
  options: {
    type: Array,
    default: () => []  // 이 부분을 TypeScript로?
  },
  value: {
    type: String,
    default: ''
  }
})
```

**힌트**: `withDefaults()` 함수를 사용해보세요.

</div>
</details>

<details>
<summary>💡 해답</summary>
<div markdown="1">

**방법 1: withDefaults 사용**

```typescript
interface DropdownProps {
  options: string[]
  value: string
}

const props = withDefaults(defineProps<DropdownProps>(), {
  options: () => [],  // 배열은 함수 형태로
  value: ''          // 원시값은 직접
})
```

**방법 2: 인터페이스에서 옵셔널로 정의**

```typescript
interface DropdownProps {
  options?: string[]  // 옵셔널로 정의
  value?: string
}

const props = defineProps<DropdownProps>()
// 사용시: props.options || []
```

**차이점**:

- `withDefaults`: Vue가 기본값을 자동 할당
- 옵셔널: 코드에서 직접 fallback 처리

</div>
</details>

### 도전 2: 이벤트 타입 안전성

<details>
<summary>🤔 생각해보기</summary>
<div markdown="1">

**문제**: emit 이벤트의 타입을 어떻게 정의해야 할까요?

현재는 `defineEmits(['update:value'])`로 되어 있는데, 이것만으로는 타입 검증이 안됩니다.

- 잘못된 페이로드 타입을 보내도 에러가 안남
- 존재하지 않는 이벤트명을 사용해도 에러가 안남

더 엄격한 타입 정의 방법이 있을까요?

**힌트**:

- 이벤트 이름과 페이로드 타입을 함께 정의할 수 있습니다
- Props의 value 타입과 일치해야 합니다

</div>
</details>

<details>
<summary>💡 해답</summary>
<div markdown="1">

**방법 1: 객체 형태로 정의 (좋음)**

```typescript
const emit = defineEmits<{
  'update:value': [value: string]  // 튜플로 페이로드 타입 정의
}>()
```

**방법 2: 인터페이스로 분리 (베스트)**

```typescript
interface DropdownEmits {
  'update:value': [value: string]
}

const emit = defineEmits<DropdownEmits>()
```

**방법 3: Props와 연결된 타입 (고급)**

```typescript
interface DropdownProps {
  options: string[]
  value: string
}

interface DropdownEmits {
  'update:value': [value: DropdownProps['value']]  // Props 타입 재사용
}
```

**장점들**:

- 잘못된 타입 전달시 컴파일 에러
- 존재하지 않는 이벤트 사용시 컴파일 에러  
- IDE에서 자동완성 및 타입 힌트 제공

</div>
</details>

### 도전 3: ref 타입 추론

<details>
<summary>🤔 생각해보기</summary>
<div markdown="1">

**문제**: `ref`의 타입을 어떻게 정의해야 할까요?

```typescript
const props = defineProps<{ options: string[], value: string }>()

// 방법 1: 자동 추론에 맡기기
const valueModel = ref(props.value)

// 방법 2: 명시적 타입 지정
const valueModel = ref<string>(props.value)

// 방법 3: 초기값이 복잡한 경우
const valueModel = ref(props.value || props.options[0])
```

**고민해볼 점들**:

- 타입 추론이 항상 정확할까요?
- 초기값이 `undefined`일 수 있다면?
- 가독성 vs 간결성 중 무엇이 더 중요할까요?

</div>
</details>

<details>
<summary>💡 해답</summary>
<div markdown="1">

**추천: 명시적 타입 지정**

```typescript
const valueModel = ref<string>(props.value || props.options[0] || '')
```

**이유들**:

**1. 타입 안전성**

```typescript
// 자동 추론의 문제점
const valueModel = ref(props.value || props.options[0])
// 만약 둘 다 undefined라면? ref<undefined>가 될 수 있음

// 명시적 지정으로 해결
const valueModel = ref<string>(props.value || props.options[0] || '')
// 항상 string 타입 보장
```

**2. IDE 지원**

```typescript
// 명시적 타입 지정시
valueModel.value.  // ← string 메서드들 자동완성

// 자동 추론시 불확실한 경우
valueModel.value.  // ← 타입이 애매하면 자동완성 부정확
```

**3. 복잡한 초기값 처리**

```typescript
// 안전한 초기값 설정 패턴
const getInitialValue = (): string => {
  if (props.value) return props.value
  if (props.options.length > 0) return props.options[0]
  return ''
}

const valueModel = ref<string>(getInitialValue())
```

</div>
</details>

### 도전 4: 조건부 타입으로 옵션 검증

<details>
<summary>🤔 생각해보기</summary>
<div markdown="1">

**문제**: `options` 배열이 비어있을 때만 `value`를 옵셔널로 만들고, 옵션이 있을 때는 필수로 만들려면?

실제 사용 시나리오:

```typescript
// options가 비어있으면 value 불필요
<VDropdown :options="[]" />  

// options가 있으면 value 필수
<VDropdown :options="['A', 'B']" :value="'A'" />
```

**힌트**: 조건부 타입과 `keyof`를 활용해보세요.

</div>
</details>

<details>
<summary>💡 해답</summary>
<div markdown="1">

```typescript
type DropdownProps<T extends readonly string[]> = T extends readonly []
  ? {
      options: T
      value?: never  // value 속성 자체를 금지
    }
  : {
      options: T
      value: T[number]  // 배열 요소의 유니온 타입
    }

// 사용 예시
const emptyProps: DropdownProps<[]> = { 
  options: [] 
  // value: 'anything'  // ← 에러! value 불가
}

const withOptionsProps: DropdownProps<['A', 'B']> = { 
  options: ['A', 'B'], 
  value: 'A'  // ← 'A' | 'B'만 허용
}
```

**더 실용적인 버전**:

```typescript
// 헬퍼 타입
type NonEmptyArray<T> = [T, ...T[]]

interface EmptyDropdownProps {
  options: []
  value?: never
}

interface PopulatedDropdownProps<T extends readonly string[]> {
  options: NonEmptyArray<T[number]>
  value: T[number]
}

type SafeDropdownProps<T extends readonly string[]> = 
  T extends [] ? EmptyDropdownProps : PopulatedDropdownProps<T>
```

</div>
</details>

### 도전 5: 브랜드 타입으로 선택값 보장

<details>
<summary>🤔 생각해보기</summary>
<div markdown="1">

**문제**: `value`가 반드시 `options` 배열에 포함된 값이어야 한다는 것을 타입 레벨에서 보장하려면?

현재 문제:

```typescript
const props = { options: ['A', 'B'], value: 'C' }  // 'C'는 options에 없음!
```

런타임 검증은 가능하지만, 컴파일 타임에 잡을 수 있다면?

**힌트**: 브랜드 타입과 타입 가드를 조합해보세요.

</div>
</details>

<details>
<summary>💡 해답</summary>
<div markdown="1">

**🚨 중요한 오해 해결: 브랜드 타입의 실제 동작**

```typescript
// 1. 브랜드 타입 정의
type ValidOption<T extends readonly string[]> = T[number] & { 
  readonly __brand: unique symbol 
}

// 2. 실제 테스트해보기
const options = ['A', 'B', 'C'] as const
const value = 'A'  // 일반 문자열

// 브랜드 타입으로 캐스팅
const brandedValue = value as ValidOption<typeof options>

console.log(value)        // 결과: "A"
console.log(brandedValue) // 결과: "A" (똑같음!)

console.log('__brand' in brandedValue)  // 결과: false (키가 없음!)
console.log(Object.keys(brandedValue))  // 결과: [] (일반 문자열과 동일)

// 🎯 핵심: __brand 속성은 실제로 존재하지 않습니다!
```

**❓ 그럼 `__brand`는 뭔가요?**

**답**: `__brand`는 **TypeScript 컴파일러만 알고 있는 가상의 표시**입니다!

```typescript
type ValidOption<T> = T[number] & { __brand: unique symbol }
//                                  ^^^^^^^^^^^^^^^^^^^^^^^^
//                                  이 부분은 "타입 레벨"에서만 존재
//                                  런타임에는 아무것도 없음!
```

**📊 타입 레벨 vs 런타임 레벨 비교**

| 구분 | 타입 레벨 (컴파일 시간) | 런타임 레벨 (실행 시간) |
|------|----------------------|----------------------|
| **일반 문자열** | `string` | `"A"` |
| **브랜드 타입** | `string & { __brand: symbol }` | `"A"` (똑같음!) |
| **TypeScript가 보는 것** | 서로 다른 타입으로 인식 | 실제 값은 동일 |

**🔍 더 명확한 예시**

```typescript
type UserId = string & { __brand: 'UserId' }
type ProductId = string & { __brand: 'ProductId' }

const userId: UserId = 'user123' as UserId
const productId: ProductId = 'prod456' as ProductId

// 런타임에서는...
console.log(userId)     // "user123" (일반 문자열)
console.log(productId)  // "prod456" (일반 문자열)

// 하지만 TypeScript는 다르게 인식!
function getUser(id: UserId) { ... }

getUser(userId)     // ✅ 정상 (UserId 타입)
getUser(productId)  // ❌ 에러! (ProductId ≠ UserId)
getUser('user123')  // ❌ 에러! (string ≠ UserId)

// 런타임에서는 모두 동일한 문자열인데도 불구하고!
```

**🎭 브랜드 타입 = "가면"의 비유**

```
실제 값:     "A"
브랜드 타입:  "A" + 가상의_라벨
                ↑
           TypeScript만 볼 수 있는 라벨
           실제로는 존재하지 않음
```

**⚙️ 그럼 어떻게 타입 안전성이 보장되나요?**

```typescript
// TypeScript 컴파일러의 타입 체킹
function selectOption(option: ValidOption<['A', 'B']>) {
  console.log(option)  // 실제로는 그냥 문자열 받음
}

// 컴파일 시점에 타입 체크
selectOption('A')                    // ❌ 컴파일 에러
selectOption('A' as ValidOption<T>)  // ✅ 컴파일 통과

// 컴파일 후 JavaScript 코드
function selectOption(option) {  // 타입 정보 모두 사라짐
  console.log(option)
}
selectOption('A')  // 실제로는 이렇게 실행됨
```

**📋 정리**

1. `__brand: unique symbol` → **타입 정보일 뿐, 실제 속성 아님**
2. `value as ValidOption<T>` → **런타임에는 값 변화 없음, 컴파일러에게만 "이건 특별한 타입이야" 라고 알려줌**
3. 브랜드 타입 = **컴파일 시간의 타입 안전성**, **런타임 성능 오버헤드 없음**

따라서 `'A'`가 `ValidOption<T>`로 캐스팅되어도 여전히 그냥 `'A'` 문자열입니다! 🎯

**실용적인 Vue 컴포넌트 버전**:

```typescript
interface StrictDropdownProps<T extends readonly string[]> {
  options: T
  value: T[number]
}

// Props 검증 함수
function validateDropdownProps<T extends readonly string[]>(
  props: { options: T; value: string }
): props is StrictDropdownProps<T> {
  return props.options.includes(props.value as T[number])
}

// 컴포넌트에서 사용
const props = defineProps<{ options: string[]; value: string }>()

// 검증 후 사용
if (validateDropdownProps(props)) {
  // 이 블록 안에서는 props.value가 안전하게 보장됨
  console.log('Valid selection:', props.value)
}
```

</div>
</details>

### 도전 6: 고차 컴포넌트 타입 래퍼

<details>
<summary>🤔 생각해보기</summary>
<div markdown="1">

**문제**: 애플리케이션에서 여러 도메인의 드롭다운이 필요한데, 각각 다른 옵션 타입을 가지면서도 공통 인터페이스를 유지하려면?

예시 시나리오:

```typescript
// 국가 선택 드롭다운
const countryOptions = ['US', 'KR', 'JP'] as const

// 언어 선택 드롭다운  
const languageOptions = ['en', 'ko', 'ja'] as const

// 테마 선택 드롭다운
const themeOptions = ['light', 'dark'] as const
```

각각의 타입 안전성을 보장하면서 공통 로직을 재사용하려면?

**힌트**: 고차 타입과 팩토리 패턴을 활용해보세요.

</div>
</details>

<details>
<summary>💡 해답</summary>
<div markdown="1">

**도메인별 타입 시스템**:

```typescript
// 1. 기본 드롭다운 인터페이스
interface BaseDropdown<T> {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  placeholder?: string
}

// 2. 도메인 스키마 정의
type AppDomains = {
  country: ['US', 'KR', 'JP']
  language: ['en', 'ko', 'ja']  
  theme: ['light', 'dark']
  priority: ['low', 'medium', 'high']
}

// 3. 도메인별 드롭다운 타입 생성
type DomainDropdowns = {
  [K in keyof AppDomains]: BaseDropdown<AppDomains[K][number]>
}

// 4. 타입 안전한 팩토리 함수
function createDomainDropdown<K extends keyof AppDomains>(
  domain: K,
  options: AppDomains[K],
  initialValue: AppDomains[K][number]
): DomainDropdowns[K] {
  return {
    options,
    value: initialValue,
    onChange: (value) => {
      console.log(`${domain} changed to:`, value)
      // 도메인별 특별한 로직 처리 가능
    }
  }
}

// 5. 사용 예시
const countryDropdown = createDomainDropdown(
  'country', 
  ['US', 'KR', 'JP'], 
  'KR'  // 타입 안전: 'US' | 'KR' | 'JP'만 허용
)

countryDropdown.onChange('JP')  // ✅ 안전
// countryDropdown.onChange('FR')  // ❌ 타입 에러

const themeDropdown = createDomainDropdown(
  'theme',
  ['light', 'dark'],
  'dark'  // 'light' | 'dark'만 허용
)
```

**Vue 컴포넌트와 통합**:

```typescript
// 제네릭 Vue 컴포넌트
interface GenericDropdownProps<T extends string> {
  options: readonly T[]
  modelValue: T
  placeholder?: string
}

interface GenericDropdownEmits<T extends string> {
  'update:modelValue': [value: T]
}

// 도메인별 컴포넌트 생성
type CountryDropdown = GenericDropdownProps<AppDomains['country'][number]>
type LanguageDropdown = GenericDropdownProps<AppDomains['language'][number]>

// 실제 컴포넌트에서 사용
const countryProps = defineProps<CountryDropdown>()
const countryEmit = defineEmits<GenericDropdownEmits<AppDomains['country'][number]>>()
```

</div>
</details>

## 📚 단계별 완성 가이드

### Step 1: 기본 변환

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

// Props 인터페이스 정의
interface DropdownProps {
  options: string[]
  value: string
}

// 이벤트 인터페이스 정의  
interface DropdownEmits {
  'update:value': [value: string]
}

// Props 정의 (기본값 포함)
const props = withDefaults(defineProps<DropdownProps>(), {
  options: () => [],
  value: ''
})

const emit = defineEmits<DropdownEmits>()

// valueModel 타입 정의
const valueModel = ref<string>(props.value || props.options[0] || '')

watch(valueModel, (newVal) => { 
  emit('update:value', newVal) 
}, { immediate: true })
</script>
```

### Step 2: 제네릭 사용 (고급)

```vue
<script setup lang="ts" generic="T extends string">
import { ref, watch } from 'vue'

// 드롭다운 옵션 타입
type DropdownOption<T> = T

// Props 인터페이스 (제네릭)
interface DropdownProps<T> {
  options: DropdownOption<T>[]
  value: T
}

// 이벤트 인터페이스 (제네릭)
interface DropdownEmits<T> {
  'update:value': [value: T]
}

// Props 정의 (타입 안전성 + 기본값)
const props = withDefaults(defineProps<DropdownProps<T>>(), {
  options: () => [] as T[],
  value: '' as T
})

const emit = defineEmits<DropdownEmits<T>>()

// valueModel 타입 정의
const valueModel = ref<T>(props.value ?? props.options[0] ?? '' as T)

watch(
  valueModel,
  (newVal: T) => {
    emit('update:value', newVal)
  },
  { immediate: true }
)
</script>
```

### Step 3: 타입 분리 (파일 구조화)

**`src/types/components.ts`**

```typescript
export type DropdownOption<T = string> = T

export interface DropdownProps<T = string> {
  options: DropdownOption<T>[]
  value: T
}

export interface DropdownEmits<T = string> {
  'update:value': [value: T]
}
```

**`VDropdown.vue`**

```vue
<script setup lang="ts" generic="T extends string">
import { ref, watch } from 'vue'
import { DropdownProps, DropdownEmits } from '@/types/components'

const props = withDefaults(defineProps<DropdownProps<T>>(), {
  options: () => [] as T[],
  value: '' as T
})

const emit = defineEmits<DropdownEmits<T>>()

const valueModel = ref<T>(props.value ?? props.options[0] ?? '' as T)

watch(
  valueModel,
  (newVal: T) => {
    emit('update:value', newVal)
  },
  { immediate: true }
)

// 사용 예시:
// <VDropdown<string> :options="['A', 'B']" :value="'A'" />
</script>
```

## ⚠️ 제네릭 사용 시 주의사항

### generic 문법 호환성

<details>
<summary>⚠️ 중요한 호환성 이슈</summary>
<div markdown="1">

**주의**: `generic="T extends string"` 문법은 Vue 3.4 이상에서만 지원됩니다.
일부 환경(IDE, 테스트, ESLint 등)에서는 오류가 발생할 수 있습니다.

</div>
</details>

### 안전한 대안들

**방법 1: 안전한 초기값 분기 처리**

```typescript
const props = withDefaults(defineProps<Props>(), {
  options: () => [] as T[],
  value: undefined as unknown as T
})

const getDefaultValue = (): T => {
  if (props.options.length > 0) return props.options[0]
  return (typeof props.value === 'string' ? '' : 0) as T
}

const valueModel = ref<T>(props.value ?? getDefaultValue())
```

**방법 2: value를 필수 prop으로 만들기**

```typescript
interface DropdownProps<T = string> {
  options: DropdownOption<T>[]
  value: T  // 필수, 기본값 없음
}

const props = defineProps<DropdownProps<T>>()  // withDefaults 제거
```

## 🧪 테스트 방법

### 1. 타입 체크 테스트

```bash
npm run type-check
# 또는
npx vue-tsc --noEmit
```

### 2. 의도적 타입 에러 만들기 (학습용)

```typescript
// 이런 코드들을 시도해보세요
const props = defineProps<{
  options: string[]
  value: number  // 의도적으로 잘못된 타입
}>()

// 어떤 에러가 발생하나요?
```

### 3. IDE 타입 힌트 확인

- `props.` 입력 시 자동완성이 나타나는지
- `emit('update:value', )` 에서 타입 힌트가 나타나는지

## 📝 변환 완료 체크리스트

- [ ] `<script setup lang="ts">` 적용
- [ ] Props 인터페이스 정의
- [ ] Emits 인터페이스 정의
- [ ] 타입 컴파일 에러 없음
- [ ] 기존 기능 정상 동작
- [ ] Default values 적절히 처리
- [ ] ref 타입 명시적 정의
- [ ] 이벤트 페이로드 타입 안전성

## 🚀 성공 기준

변환이 성공했다면:

- ✅ TypeScript 컴파일 통과
- ✅ 기존 기능 100% 동작
- ✅ IDE에서 타입 힌트 제공
- ✅ 의도적 타입 에러 발생 시 적절한 에러 메시지
- ✅ 코드 가독성 향상

**다음 컴포넌트 변환 준비 완료!** 🎉

---

## 📚 관련 글

- [Vue 3 + TypeScript 아키텍처 패턴 가이드](/_posts/2025-05-27-ts-vue-architecture-design.md)
- [Vue 3 + TypeScript 패턴 가이드](/_posts/2025-05-27-ts-vue-pattern.md)
