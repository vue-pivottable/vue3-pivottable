# Changelog

## 1.1.7

### Patch Changes

- 429cf68: fix: peerDependencies가 존재하지 않는 버전을 참조하는 문제 수정

  - vue-pivottable의 peerDependency를 ^1.1.5에서 ^1.1.4로 변경
  - 1.1.5는 아직 정식 릴리즈되지 않았으므로 1.1.4를 참조해야 함
  - plotly-renderer와 lazy-table-renderer 모두 수정
  - vue-pivottable@1.1.5

## 1.1.6

### Patch Changes

- 5ef202b: fix: develop 브랜치를 베타 버전으로 복구

  - develop 브랜치가 정식 버전으로 잘못 업데이트된 것을 수정
  - 모든 패키지를 베타 버전으로 변경
  - develop 브랜치는 항상 베타 버전을 유지해야 함

- Updated dependencies [5ef202b]
  - vue-pivottable@1.1.5

## 1.1.6

### Patch Changes

- 96362f1: test: 릴리즈 프로세스 최종 검증을 위한 테스트 업데이트
  - vue-pivottable@1.1.4

## 1.1.5

### Patch Changes

- 3769e71: test: release 워크플로우 직접 배포 테스트
  - vue-pivottable@1.1.4

## 1.1.4

### Patch Changes

- dfb072a: test: 릴리스 워크플로우 개선 테스트
  - vue-pivottable@1.1.4

## 1.1.4

### Patch Changes

- fe3926e: test: 하위 패키지만 업데이트 시 release 브랜치 동기화 워크플로우 테스트
  - vue-pivottable@1.1.4

## 1.1.3

### Patch Changes

- 94f0f23: test: 하위 패키지만 업데이트하는 경우 릴리즈 브랜치 동기화 테스트
  - vue-pivottable@1.1.4

## 1.1.3

### Patch Changes

- dc3b7dc: fix: 하위 패키지 빌드 오류 수정

  - lazy-table-renderer: vue-pivottable 버전 의존성 업데이트 (^1.1.4)
  - plotly-renderer: vue-pivottable 버전 의존성 업데이트 및 타입 오류 수정
  - vite 설정에서 moduleResolution 관련 수정
  - vue-pivottable@1.1.4

## 1.1.2

### Patch Changes

- ba78d0c: test: 릴리즈 워크플로우 개선 테스트 (lazy-table-renderer)

## 1.1.2

### Patch Changes

- d2ae696: test: 전체 릴리즈 프로세스 테스트를 위한 lazy-table-renderer 업데이트

## 1.1.1

### Patch Changes

- 67c8f7c: test: 릴리즈 워크플로우 테스트
- f8d2a1c: test: main 워크플로우 수정 확인

## 1.1.1

### Patch Changes

- 6c1a31f: test: 워크플로우 수정 테스트

## 1.1.0

### Patch Changes

- 34e74ef: fix: 프로덕션 배포가 release 브랜치에서 실행되도록 수정

  - release.yml에서 release-packages.cjs 사용하도록 변경
  - npm 배포 전 release 브랜치로 checkout하도록 수정
  - 베타와 프로덕션 배포가 동일한 스크립트 사용

## [1.1.0](https://github.com/vue-pivottable/vue3-pivottable/compare/@vue-pivottable/lazy-table-renderer@1.0.13...@vue-pivottable/lazy-table-renderer@1.1.0) (2024-06-18)

### Features

- TypeScript migration for improved type safety
- Enhanced virtual scrolling performance
- Better integration with main vue-pivottable package

## [1.0.13](https://github.com/vue-pivottable/vue3-pivottable/compare/@vue-pivottable/lazy-table-renderer@1.0.12...@vue-pivottable/lazy-table-renderer@1.0.13) (2024-05-07)

### Bug Fixes

- Fixed build configuration for monorepo setup

## [1.0.0](https://github.com/vue-pivottable/vue3-pivottable/releases/tag/@vue-pivottable/lazy-table-renderer@1.0.0) (2024-05-07)

### Bug Fixes

- **lazy-table-renderer:** fix lint ([39f597c](https://github.com/vue-pivottable/vue3-pivottable/commit/39f597c081e885b7668fdaeec4ef38f2cb43b41c))
- **slot:** pvtAttr scoped slot 버그 수정 ([#68](https://github.com/vue-pivottable/vue3-pivottable/issues/68)) ([e2986ac](https://github.com/vue-pivottable/vue3-pivottable/commit/e2986acaf5e247551d499de9a70b7a5e17b85087))
