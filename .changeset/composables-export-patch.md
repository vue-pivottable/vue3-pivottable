---
"vue-pivottable": patch
---

Export all composables for external packages to enable custom renderer development

- Added `export * from './composables'` to main index.ts
- Resolves import errors for `useProvidePivotData` and `providePivotData` in external packages
- Enables plotly-renderer and lazy-table-renderer to properly import required functions
- No circular dependency issues detected after thorough analysis
- Maintains backward compatibility while improving extensibility