# Changelog

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
