# Vue Pivottable

<!-- [![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-) -->

**Pivot Table Component for Vue 3**

`vue-pivottable` is a Vue 3-compatible pivot table component, which is a Vue wrapper of the popular [react-pivottable](https://github.com/plotly/react-pivottable). This library allows you to easily summarize, transform, and visualize large datasets in a pivot table UI.

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

<!-- [![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-) -->

<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support). -->

<!-- 주요 기능 -->

## Features

- Built with Vue 3 Composition API
- Supports multiple aggregators and renderers
- Interactive UI with drag-and-drop field configuration
- Easy to customize and extend (renderers, aggregators, styles)

<!-- 설치 방법 -->

## Installation

```bash
# npm install
npm install vue-pivottable

# npm run dev
npm run dev
```

<!-- 사용법 (Quick Start)-->

## Quick Start

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
</script>
```

<!-- 링크나 세부 API 설명 -->

## Documentation

### VuePivottableUi

| Prop             | Type     | Description                                             | Default   |
| ---------------- | -------- | ------------------------------------------------------- | --------- |
| `data`           | `Array`  | The dataset array to display in the pivot table         | `[]`      |
| `rows`           | `Array`  | Fields to use as rows in the pivot table                | `[]`      |
| `cols`           | `Array`  | Fields to use as columns in the pivot table             | `[]`      |
| `vals`           | `Array`  | Fields to aggregate                                     | `[]`      |
| `aggregatorName` | `String` | Aggregation function name (e.g., "Sum", "Count")        | `"Count"` |
| `rendererName`   | `String` | Renderer to display the data ("Table", "Heatmap", etc.) | `"Table"` |

You can also pass custom renderers, aggregators, and sorters.
For detailed API and props usage, visit the [Wiki](https://vue-pivottable.vercel.app/).

<!-- 데모 사이트 링크 (없으면 임시로 로컬에서 돌릴 수 있는 설명)-->

## Live Demo

Try out the live demo of `vue-pivottable-ui` here:

- [Demo on Stackblitz](https://stackblitz.com/edit/vitejs-vite-dviwcxsq?file=src%2FApp.vue)

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
