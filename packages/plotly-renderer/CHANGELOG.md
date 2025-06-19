# Changelog

## 2.0.1

### Patch Changes

- a59a151: chore: plotly-renderer peerDependency를 'latest'로 변경

  - 베타 버전 대신 'latest'를 사용하여 더 유연한 버전 관리 가능

## [2.0.0](https://github.com/vue-pivottable/vue3-pivottable/compare/@vue-pivottable/plotly-renderer@1.0.0...@vue-pivottable/plotly-renderer@2.0.0) (2024-06-15)

### ⚠ BREAKING CHANGES

- Complete TypeScript migration
- Updated Plotly.js to latest version
- Changed prop interfaces for better type safety

### Features

- TypeScript support throughout the package
- Improved chart rendering performance
- Better error handling for invalid data
- Enhanced customization options for charts

### Bug Fixes

- Fixed memory leaks in chart disposal
- Resolved resize observer issues
- Fixed chart update race conditions

## [1.0.0](https://github.com/vue-pivottable/vue3-pivottable/releases/tag/@vue-pivottable/plotly-renderer@1.0.0) (2024-05-01)

### Features

- Initial release of Plotly renderer for vue3-pivottable
- Support for all major Plotly chart types
- Responsive chart sizing
- Custom color schemes
- Interactive chart features (zoom, pan, hover)
- Export to PNG/SVG functionality
