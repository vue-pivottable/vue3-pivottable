# @vue-pivottable/lazy-table-renderer

A Vue 3 + IntersectionObserver-based lazy renderer for pivot tables, built on top of the `vue-pivottable` package.

Renders only the visible part of a pivot table in chunks based on the scroll position, improving performance when handling large datasets.

---

## Features

- Lazy rendering using IntersectionObserver
- Fixed average row height (30px)
- Automatic top/bottom padding height adjustment
- Fully compatible with the **Vue 3** version of `vue-pivottable`

---

## Props

This component inherits all standard props from the `vue-pivottable` package, with the following two additional props:

| Prop         | Type   | Default | Description                                                 |
| ------------ | ------ | ------- | ----------------------------------------------------------- |
| `chunkSize`  | Number | `50`    | Number of rows rendered per chunk                           |
| `bufferSize` | Number | `1`     | Number of chunks rendered before and after the visible area |

All other props behave the same as in the original [`vue-pivottable`](https://github.com/vue-pivottable/vue3-pivottable) package.

---

## License

MIT
