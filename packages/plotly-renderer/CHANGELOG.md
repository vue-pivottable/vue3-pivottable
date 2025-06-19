# Changelog

## 2.0.1

### Patch Changes

- dc3b7dc: fix: 하위 패키지 빌드 오류 수정

  - lazy-table-renderer: vue-pivottable 버전 의존성 업데이트 (^1.1.4)
  - plotly-renderer: vue-pivottable 버전 의존성 업데이트 및 타입 오류 수정
  - vite 설정에서 moduleResolution 관련 수정
  - vue-pivottable@1.1.4

## 2.0.0

### Patch Changes

- 34e74ef: fix: 프로덕션 배포가 release 브랜치에서 실행되도록 수정

  - release.yml에서 release-packages.cjs 사용하도록 변경
  - npm 배포 전 release 브랜치로 checkout하도록 수정
  - 베타와 프로덕션 배포가 동일한 스크립트 사용

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
