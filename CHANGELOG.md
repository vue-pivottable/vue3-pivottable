# Changelog

## 1.2.0

### Minor Changes

- feat: implement PivotModel two-way binding with complete feature set
- fix: resolve critical memory leak in VPivottableUi component (#270)

### Patch Changes

- fix: improve release script to prevent unwanted package updates

## 1.1.7

### Patch Changes

- a79ca01: chore: 베타 릴리즈를 위한 changeset 추가
  - PR #264 CI 체크 통과를 위한 changeset

## 1.1.7

### Patch Changes

- a6cd884: chore: 베타 버전 1.1.7-beta.1751886288 릴리즈
  - develop sync 제거 후 재빌드된 베타 버전

## 1.1.7

### Patch Changes

- 15ef3bb: fix: Release 워크플로우에서 develop 동기화 단계 제거
  - main 브랜치에서 stable 릴리즈 후 develop 브랜치와의 동기화 시 발생하는 버전 충돌 문제 해결
  - develop은 항상 베타 버전을 유지하고, main은 stable 버전만 유지하도록 워크플로우 개선
- e38ae7e: chore: 워크플로우 재실행을 위한 changeset
  - 이전 워크플로우 실행 시 npm 배포 중복 오류 해결을 위함

## 1.1.7

### Patch Changes

- 2de66de: chore: stable 버전 1.1.7 릴리즈 준비

  베타 테스트가 완료되어 stable 버전으로 릴리즈 준비합니다.

  ### 포함된 변경사항
  - fix: rows/cols가 비어있을 때 Vue2와 동일하게 렌더링되도록 수정
  - fix: VDragAndDropCell이 속성이 없을 때 사라지는 문제 수정
  - chore: 베타 버전 관리 및 릴리즈 프로세스 개선

## 1.1.7

### Patch Changes

- c9b80cb: fix: VDragAndDropCell이 속성이 없을 때 사라지는 문제 수정
  - DragAndDropCell 컴포넌트에서 속성이 누락되었을 때 발생하는 문제 해결
  - 이슈 #177 수정

## 1.1.7

### Patch Changes

- df8c87d: fix: rows/cols가 비어있을 때 Vue2와 동일하게 렌더링되도록 수정
  - 디버그용 console.log 코드 제거
  - rows/cols가 모두 비어있을 때도 테이블 구조와 총계가 표시되도록 수정
  - rowAttrs가 비어있을 때 헤더에 빈 행이 추가되는 문제 해결
  - Vue2의 렌더링 동작과 완전히 일치하도록 조건부 렌더링 로직 개선

## 1.1.7

### Patch Changes

- d72a22d: test: 수정된 베타 버전 증가 로직 테스트

  **수정된 워크플로우 검증:**
  1. changeset 실행 전 베타 접미사 제거
  2. changeset version으로 버전 증가 (1.1.6 → 1.1.7, 2.0.7 → 2.0.8)
  3. 증가된 버전에 베타 접미사 재적용

  **기대 결과:**
  - vue-pivottable: 1.1.6-beta.xxx → 1.1.7-beta.yyy
  - plotly-renderer: 2.0.7-beta.xxx → 2.0.8-beta.yyy
  - lazy-table-renderer: 변경 없음 (changeset 제외)

## 1.1.6

### Patch Changes

- d8c5bff: test: 올바른 베타 버전 증가 테스트

  **수정된 로직 테스트:**
  - changeset version의 버전 증가를 보존
  - 선택적 베타 타임스탬프 적용 (변경된 패키지만)
  - lazy-table-renderer는 changeset 없으므로 변경되지 않아야 함

  **기대 결과:**
  - vue-pivottable: 1.1.6-beta.old → 1.1.7-beta.new (버전 증가 + 새 타임스탬프)
  - plotly-renderer: 2.0.7-beta.old → 2.0.8-beta.new (버전 증가 + 새 타임스탬프)
  - lazy-table-renderer: 1.1.7-beta.old → 1.1.7-beta.old (변경 없음)

## 1.1.6

### Patch Changes

- d29dbcb: test: 베타 타임스탬프 교체 시나리오 테스트

  **현재 상황:**
  - develop 브랜치에 이미 베타 버전들이 존재
  - main PR #247이 승인되지 않은 상태
  - 추가 changeset으로 베타 타임스탬프 교체 테스트

  **기대 결과:**
  - vue-pivottable: 1.1.6-beta.OLD → 1.1.7-beta.NEW
  - plotly-renderer: 2.0.7-beta.OLD → 2.0.8-beta.NEW
  - lazy-table-renderer: 1.1.7-beta.OLD (변경 없음, changeset 없음)

  **테스트 목표:**
  - 베타 중복 방지 (1.1.7-beta.xxx-beta.yyy 같은 형태 방지)
  - 새로운 타임스탬프로 교체
  - main PR #247 자동 업데이트

## 1.1.6

### Patch Changes

- 655b3b1: test: 단일 패키지 배포 시나리오 테스트
  - vue-pivottable만 변경하여 1개 패키지 배포 테스트
  - main PR이 있는 상태에서 추가 변경사항 반영 테스트

## 1.1.6

### Patch Changes

- 9b0077c: fix: 워크플로우 및 버전 관리 시스템 개선
  - develop 브랜치에서 항상 베타 버전 보장하는 로직 추가
  - peerDependencies를 현재 npm latest와 일치하도록 수정
  - changeset이 없어도 베타 접미사가 자동으로 추가되도록 개선
  - npm 배포 충돌 및 버전 불일치 문제 근본 해결

## 1.1.6

### Patch Changes

- fix: 버전 관리 문제 해결을 위한 버전 범프
  - develop 브랜치의 버전이 베타 접미사 없이 유지되는 문제 해결
  - npm에 이미 배포된 버전과 충돌 방지

## 1.1.5

### Patch Changes

- 5ef202b: fix: develop 브랜치를 베타 버전으로 복구
  - develop 브랜치가 정식 버전으로 잘못 업데이트된 것을 수정
  - 모든 패키지를 베타 버전으로 변경
  - develop 브랜치는 항상 베타 버전을 유지해야 함

## 1.1.5

### Patch Changes

- 9dd7707: fix: 베타 릴리즈 프로세스 전체 개선
  - 베타 버전 중복 문제 해결 (1.1.5-beta.xxx-beta.yyy → 1.1.5-beta.yyy)
  - peerDependencies 베타 버전 오염 방지
  - changeset 적용 전 package.json 백업 및 peerDependencies 복원 로직 추가
  - 워크플로우에서 베타 버전이 의존성에 전파되지 않도록 개선

- 9dd7707: fix: 베타 버전 중복 및 peerDependencies 오염 문제 긴급 수정
  - 중복된 베타 버전 제거 (1.1.5-beta.xxx-beta.yyy → 1.1.5-beta.yyy)
  - plotly-renderer의 peerDependencies를 원래 버전으로 복원

## 1.1.5

### Patch Changes

- 464d7d2: test: main PR 자동 업데이트 기능 검증

## 1.1.4

### Patch Changes

- ba78d0c: test: 릴리즈 워크플로우 개선 테스트 (메인 패키지)

## 1.1.4

### Patch Changes

- d2ae696: test: 전체 릴리즈 프로세스 테스트를 위한 메인 패키지 업데이트

## 1.1.3

### Patch Changes

- 0c3c5b0: fix: 하위 패키지 이중 베타 버전 문제 해결
  - lazy-table-renderer와 plotly-renderer의 잘못된 베타 버전 수정
  - 워크플로우 개선사항 적용을 위한 릴리스 준비

## 1.1.3

### Patch Changes

- ad33eb8: fix: 프로덕션 릴리스를 위한 버전 업데이트
  - 워크플로우 개선사항 반영
  - 안정적인 배포 프로세스 확립

## 1.1.2

### Patch Changes

- dae29ab: fix: 베타와 프로덕션 릴리스 워크플로우 개선
  - 베타와 프로덕션 모두 동일한 release-packages.cjs 스크립트 사용
  - changeset이 적용된 패키지만 베타 버전 생성하도록 수정
  - 프로덕션 릴리스 시 기존 릴리스 브랜치 삭제 후 재생성
  - 프로덕션 배포가 릴리스 브랜치에서 실행되도록 수정

## 1.1.2

### Patch Changes

- 34e74ef: fix: 프로덕션 배포가 release 브랜치에서 실행되도록 수정
  - release.yml에서 release-packages.cjs 사용하도록 변경
  - npm 배포 전 release 브랜치로 checkout하도록 수정
  - 베타와 프로덕션 배포가 동일한 스크립트 사용

## 1.1.2

### Patch Changes

- c2d09a4: fix: 빌드 오류 처리 및 순서 개선
  - set -e 추가로 빌드 실패 시 워크플로우 즉시 중단
  - 메인 패키지를 먼저 빌드하여 타입 선언 파일 생성
  - 하위 패키지들이 메인 패키지 타입을 참조할 수 있도록 순서 조정

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
