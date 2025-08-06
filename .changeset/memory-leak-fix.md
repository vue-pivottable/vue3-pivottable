---
"vue-pivottable": patch
---

Fix critical memory leak in VPivottableUi component (#270)

- Remove deep watch that created thousands of property watchers (80% of memory leak)
- Replace computed PivotData with shallowRef to prevent instance recreation on every access
- Add proper cleanup in onUnmounted lifecycle hook
- Results: 94% memory reduction (881MB → 53MB after 1000 refreshes)
- Fixes #270: Memory continuously increases when refreshing pivot chart
EOF < /dev/null