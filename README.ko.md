# Vue Pivottable

> [English](./README.md) | 한국어

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
[![npm](https://flat.badgen.net/npm/v/vue-pivottable)](https://npmjs.com/package/vue-pivottable)
[![npm](https://flat.badgen.net/npm/dt/vue-pivottable)](https://npmjs.com/package/vue-pivottable)
[![npm](https://flat.badgen.net/npm/license/vue-pivottable)](https://flat.badgen.net/npm/license/vue-pivottable)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/vue-pivottable/badge)](https://www.jsdelivr.com/package/npm/vue-pivottable)

**Vue 3용 피벗 테이블 컴포넌트**

`vue-pivottable`은 Vue 3 호환 피벗 테이블 컴포넌트로, 인기 있는 [react-pivottable](https://github.com/plotly/react-pivottable)의 Vue 래퍼입니다. 이 라이브러리를 사용하면 대용량 데이터셋을 피벗 테이블 UI에서 쉽게 요약, 변환, 시각화할 수 있습니다.

Vue 2 호환 버전을 찾고 계신가요?
👉 [v0.4.68 on github](https://github.com/seungwoo321/vue-pivottable)

## 기능

- Vue 3 Composition API로 구축
- 다양한 집계기와 렌더러 지원
- 드래그 앤 드롭 필드 구성이 가능한 대화형 UI
- **PivotModel 양방향 바인딩** - v-model:pivotModel 지원으로 상태 추적 및 관리
- 쉬운 사용자 정의 및 확장 (렌더러, 집계기, 스타일)

## 설치

### NPM

```bash
npm install vue-pivottable
```

### PNPM

```bash
pnpm add vue-pivottable
```

## 빠른 시작

### 기본 사용법

```vue
<template>
  <VuePivottableUi
    :data="[
      { color: 'blue', shape: 'circle' },
      { color: 'red', shape: 'triangle' }
    ]"
    :rows="['color']"
    :cols="['shape']"
  />
</template>

<script setup>
import { VuePivottableUi } from 'vue-pivottable'
import 'vue-pivottable/dist/vue-pivottable.css'
</script>
```

### PivotModel 양방향 바인딩

```vue
<template>
  <div>
    <VuePivottableUi
      v-model:pivot-model="pivotModel"
      :data="data"
      @change="onPivotModelChange"
    />
    
    <!-- PivotModel 상태 표시 -->
    <pre>{{ JSON.stringify(pivotModel, null, 2) }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VuePivottableUi } from 'vue-pivottable'
import 'vue-pivottable/dist/vue-pivottable.css'

const data = ref([
  { color: 'blue', shape: 'circle' },
  { color: 'red', shape: 'triangle' }
])

const pivotModel = ref({
  rows: ['color'],
  cols: ['shape'],
  vals: [],
  aggregatorName: 'Count',
  rendererName: 'Table',
  valueFilter: {},
  rowOrder: 'key_a_to_z',
  colOrder: 'key_a_to_z',
  heatmapMode: ''
})

const onPivotModelChange = (model) => {
  console.log('PivotModel 변경됨:', model)
}
</script>
```

## 문서

자세한 API 및 props 사용법은 [문서](https://vue-pivottable.vercel.app/)를 참조하세요.

## 라이브 데모

[Stackblitz](https://stackblitz.com/edit/vitejs-vite-dviwcxsq?file=src%2FApp.vue)에서 `vue-pivottable-ui`의 라이브 데모를 사용해 보세요.

## 개발

프로젝트를 로컬에서 실행하려면:

```bash
# 저장소 클론
git clone https://github.com/vue-pivottable/vue3-pivottable.git
cd vue-pivottable

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

```

그런 다음 브라우저에서 http://localhost:8080을 여세요.

## 영감

plotly/react-pivottable에서 영감을 받음 - React 기반 피벗 테이블 라이브러리

## 기여자 ✨

이 멋진 사람들에게 감사드립니다 ([이모지 키](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/hyemyn2"><img src="https://avatars.githubusercontent.com/u/67949202?v=4?s=100" width="100px;" alt="hyemyn2"/><br /><sub><b>hyemyn2</b></sub></a><br /><a href="https://github.com/vue-pivottable/vue3-pivottable/commits?author=hyemyn2" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/gingerbeerlime"><img src="https://avatars.githubusercontent.com/u/89768065?v=4?s=100" width="100px;" alt="Sumin"/><br /><sub><b>Sumin</b></sub></a><br /><a href="https://github.com/vue-pivottable/vue3-pivottable/commits?author=gingerbeerlime" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://seungwoo321.github.io"><img src="https://avatars.githubusercontent.com/u/13829929?v=4?s=100" width="100px;" alt="Seungwoo321"/><br /><sub><b>Seungwoo321</b></sub></a><br /><a href="https://github.com/vue-pivottable/vue3-pivottable/commits?author=Seungwoo321" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

이 프로젝트는 [all-contributors](https://github.com/all-contributors/all-contributors) 사양을 따릅니다. 모든 종류의 기여를 환영합니다!