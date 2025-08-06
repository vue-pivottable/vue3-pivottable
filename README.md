# Vue Pivottable

> English | [한국어](./README.ko.md)

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
[![npm](https://flat.badgen.net/npm/v/vue-pivottable)](https://npmjs.com/package/vue-pivottable)
[![npm](https://flat.badgen.net/npm/dt/vue-pivottable)](https://npmjs.com/package/vue-pivottable)
[![npm](https://flat.badgen.net/npm/license/vue-pivottable)](https://flat.badgen.net/npm/license/vue-pivottable)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/vue-pivottable/badge)](https://www.jsdelivr.com/package/npm/vue-pivottable)

**Pivot Table Component for Vue 3**

`vue-pivottable` is a Vue 3-compatible pivot table component, which is a Vue wrapper of the popular [react-pivottable](https://github.com/plotly/react-pivottable). This library allows you to easily summarize, transform, and visualize large datasets in a pivot table UI.

Looking for the Vue 2 compatible version?
👉 [v0.4.68 on github](https://github.com/seungwoo321/vue-pivottable)

<!-- 주요 기능 -->

## Features

- Built with Vue 3 Composition API
- Supports multiple aggregators and renderers
- Interactive UI with drag-and-drop field configuration
- **PivotModel Two-way Binding** - v-model:pivotModel support for state tracking and management
- Easy to customize and extend (renderers, aggregators, styles)

<!-- 설치 방법 -->

## Installation

### NPM

```bash
npm install vue-pivottable
```

### PNPM

```bash
pnpm add vue-pivottable
```

<!-- 사용법 (Quick Start)-->

## Quick Start

### Basic Usage

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

### PivotModel Two-way Binding

```vue
<template>
  <div>
    <VuePivottableUi
      v-model:pivot-model="pivotModel"
      :data="data"
      @change="onPivotModelChange"
    />
    
    <!-- Display PivotModel state -->
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
  console.log('PivotModel changed:', model)
}
</script>
```

<!-- 링크나 세부 API 설명 -->

## Documentation

For detailed API and props usage, please visit the [docs](https://vue-pivottable.vercel.app/).

<!-- 데모 사이트 링크 (없으면 임시로 로컬에서 돌릴 수 있는 설명)-->

## Live Demo

Try out the live demo of `vue-pivottable-ui` in [Stackblitz](https://stackblitz.com/edit/vitejs-vite-dviwcxsq?file=src%2FApp.vue)

## Development

To run the project locally:

```bash
# Clone the repo
git clone https://github.com/vue-pivottable/vue3-pivottable.git
cd vue-pivottable

# Install dependencies
pnpm install

# Start the dev server
pnpm dev

```

Then open http://localhost:8080 in your browser.

## Inspired

Inspired by plotly/react-pivottable - React-based pivot table library

<!-- end -->

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

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

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!
