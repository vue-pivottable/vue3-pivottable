# Changelog

## 1.1.2

### Patch Changes

- 224a73a: fix: 베타 릴리스 워크플로우 근본 수정 (3번째 시도)

  - step ID 누락 해결: 'id: version' 추가
  - 베타 중복 방지: 기존 -beta.\* 제거 후 새로 추가
  - 릴리스 순서 개선: GitHub Release → npm 퍼블리시
  - 태그명 표준화: vue-pivottable@버전 형식 사용

## 1.0.16

### Patch Changes

- 1075ac6: feat: 릴리즈 브랜치를 활용한 새로운 배포 워크플로우 구현

  - main 브랜치 보호 규칙을 유지하면서 자동 릴리즈 가능
  - 각 릴리즈마다 release/v\* 브랜치 생성
  - 독립적인 패키지 빌드 및 배포 지원

## [1.1.1](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.1.0...v1.1.1) (2024-06-18)

### Bug Fixes

- TypeScript migration improvements
- Enhanced type definitions for props and components
- Fixed build configuration for monorepo structure

## [1.1.0](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.0.15...v1.1.0) (2024-06-15)

### Features

- Complete TypeScript migration
- Improved type safety across all components
- Better IDE support with type definitions

### Bug Fixes

- Fixed type errors in utility functions
- Resolved build issues with TypeScript configuration

## [1.0.15](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.0.14...v1.0.15) (2024-06-05)

### Bug Fixes

- delay Draggable render to prevent \_sortable.option error on HMR [#150](https://github.com/vue-pivottable/vue3-pivottable/issues/150) ([2ea40c8](https://github.com/vue-pivottable/vue3-pivottable/commit/2ea40c83f39f561dd409e8da23f724fa7a08849e))

## [1.0.14](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.0.13...v1.0.14) (2024-05-13)

### Bug Fixes

- update workflows ([5417459](https://github.com/vue-pivottable/vue3-pivottable/commit/541745903e33f23e2bebe3fd9e82fd4e8efa2329))

## [1.0.13](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.0.12...v1.0.13) (2024-05-13)

### Bug Fixes

- Fixed semantic-release configuration

## [1.0.12](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.0.11...v1.0.12) (2024-05-12)

### Bug Fixes

- update workflows ([8c22dab](https://github.com/vue-pivottable/vue3-pivottable/commit/8c22dab434246b4203b8050a51f72da86b079234))
- update workflows ([5ee3741](https://github.com/vue-pivottable/vue3-pivottable/commit/5ee3741c1b705a1599f924824d5c01acffc143fc))
- update workflows ([855b765](https://github.com/vue-pivottable/vue3-pivottable/commit/855b7659dd51bac3d4df087c9ba6108380863bf5))

## [1.0.11](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.0.10...v1.0.11) (2024-05-12)

### Bug Fixes

- Fixed release process

## [1.0.10](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.0.9...v1.0.10) (2024-05-12)

### Bug Fixes

- add missing @semantic-release/git ([e95c90b](https://github.com/vue-pivottable/vue3-pivottable/commit/e95c90b8cd8737048e37da4eae8740d0b116fd37))

## [1.0.4](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.0.3...v1.0.4) (2024-05-08)

### Bug Fixes

- fix slot and slot-scoped close [#70](https://github.com/vue-pivottable/vue3-pivottable/issues/70) [#71](https://github.com/vue-pivottable/vue3-pivottable/issues/71) ([d7369bc](https://github.com/vue-pivottable/vue3-pivottable/commit/d7369bca19f5d4c547dc57f462da4f4f4aceecff))
- **lazy-table-renderer:** fix build script ([4b9dc1b](https://github.com/vue-pivottable/vue3-pivottable/commit/4b9dc1bbccff292d69d0152a43f5bcd7cc66b5b2))
- **lazy-table-renderer:** fix lint ([39f597c](https://github.com/vue-pivottable/vue3-pivottable/commit/39f597c081e885b7668fdaeec4ef38f2cb43b41c))
- pvtAttr scoped slot 버그 수정[#68](https://github.com/vue-pivottable/vue3-pivottable/issues/68) ([6383df4](https://github.com/vue-pivottable/vue3-pivottable/commit/6383df456c504a55cee560375bedeec5e7169d7a))
- **slot:** pvtAttr scoped slot 버그 수정 ([#68](https://github.com/vue-pivottable/vue3-pivottable/issues/68)) ([e2986ac](https://github.com/vue-pivottable/vue3-pivottable/commit/e2986acaf5e247551d499de9a70b7a5e17b85087))

### Features

- update script with new functionality ([83b4db2](https://github.com/vue-pivottable/vue3-pivottable/commit/83b4db211a1b89ae6575a1f0398941406129b1ba))

## [1.0.3](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.0.2...v1.0.3) (2024-05-01)

### Bug Fixes

- Minor bug fixes and improvements

## [1.0.2](https://github.com/vue-pivottable/vue3-pivottable/compare/v1.0.0...v1.0.2) (2024-04-30)

### Bug Fixes

- modify languagePack ([0b8c837](https://github.com/vue-pivottable/vue3-pivottable/commit/0b8c83771eb510b6b8b282b7e8d9a4740210a420))

### Features

- fix readme ([13b5989](https://github.com/vue-pivottable/vue3-pivottable/commit/13b5989ba6e0c6b31b855b1a92c7dd84bcb09422))
- set reademe ([a78d1bd](https://github.com/vue-pivottable/vue3-pivottable/commit/a78d1bd484dd5a5a6fea9c849bf808f1654e98d4))
- set readme ([1ca0d6b](https://github.com/vue-pivottable/vue3-pivottable/commit/1ca0d6bf7c06b01590048930a4347b7e3a2127ed))

## [1.0.0](https://github.com/vue-pivottable/vue3-pivottable/releases/tag/v1.0.0) (2024-04-28)

### Bug Fixes

- 필터박스 영역 클릭할 때 필터박스 닫히지 않도록 처리 ([fb5f1c8](https://github.com/vue-pivottable/vue3-pivottable/commit/fb5f1c87653849b3bae7b3d393bd053f84d43608))
- add missing event ([5e55b33](https://github.com/vue-pivottable/vue3-pivottable/commit/5e55b333b08868a8191f558ccfdd88e5942534c4))
- add missing methods (PR [#12](https://github.com/vue-pivottable/vue3-pivottable/issues/12), comment #r2041281526) ([a02ebff](https://github.com/vue-pivottable/vue3-pivottable/commit/a02ebffdee174d35f45dff05d9edc6dbcb5dcbbe)), closes [#r2041281526](https://github.com/vue-pivottable/vue3-pivottable/issues/r2041281526)
- build error ([855c468](https://github.com/vue-pivottable/vue3-pivottable/commit/855c468d1b3d9f463463067596e3ce353fe2022f))
- clean up v-bind props ([c9768b2](https://github.com/vue-pivottable/vue3-pivottable/commit/c9768b2e48dc03a10d7ada3caa27e0ed6f6968bc))
- duplicate maxZIndex increment in onMoveFilterBoxToTop (PR [#12](https://github.com/vue-pivottable/vue3-pivottable/issues/12), comment #r2039059426) ([c4c7714](https://github.com/vue-pivottable/vue3-pivottable/commit/c4c77146e092f941cdd216872ea7355263969f64)), closes [#r2039059426](https://github.com/vue-pivottable/vue3-pivottable/issues/r2039059426)
- fix error ([690138e](https://github.com/vue-pivottable/vue3-pivottable/commit/690138e3246ca42d77ad224bd7d045f326f38193))

### Initial release of vue3-pivottable

- Complete Vue 3 support with Composition API
- TypeScript support throughout the codebase
- Table renderer with virtual scrolling support
- TSV export functionality
- Plotly chart renderer support
- Drag and drop functionality for pivot configuration
- Filter box with multi-select capability
- Aggregator and renderer selection
- Responsive design improvements
- Performance optimizations for large datasets
