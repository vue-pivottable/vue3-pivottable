# Changelog

## 2.0.8

### Patch Changes

- 2de66de: chore: stable 버전 1.1.7 릴리즈 준비

  베타 테스트가 완료되어 stable 버전으로 릴리즈 준비합니다.

  ### 포함된 변경사항
  - fix: rows/cols가 비어있을 때 Vue2와 동일하게 렌더링되도록 수정
  - fix: VDragAndDropCell이 속성이 없을 때 사라지는 문제 수정
  - chore: 베타 버전 관리 및 릴리즈 프로세스 개선

- Updated dependencies [2de66de]
  - vue-pivottable@1.1.7

## 2.0.8

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

- Updated dependencies [d72a22d]
  - vue-pivottable@1.1.7

## 2.0.7

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

- Updated dependencies [d8c5bff]
  - vue-pivottable@1.1.6

## 2.0.7

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

- Updated dependencies [d29dbcb]
  - vue-pivottable@1.1.6

## 2.0.7

### Patch Changes

- 646ada0: test: 2개 패키지 배포 시나리오 테스트
  - plotly-renderer와 lazy-table-renderer만 변경
  - vue-pivottable은 변경하지 않음
  - GitHub Release 중복 방지 테스트
  - peerDependencies 자동 업데이트 방지 테스트
  - vue-pivottable@1.1.6-beta.1750400546

## 2.0.7

### Patch Changes

- 9b0077c: fix: 워크플로우 및 버전 관리 시스템 개선
  - develop 브랜치에서 항상 베타 버전 보장하는 로직 추가
  - peerDependencies를 현재 npm latest와 일치하도록 수정
  - changeset이 없어도 베타 접미사가 자동으로 추가되도록 개선
  - npm 배포 충돌 및 버전 불일치 문제 근본 해결

- Updated dependencies [9b0077c]
  - vue-pivottable@1.1.6

## 2.0.7

### Patch Changes

- 429cf68: fix: peerDependencies가 존재하지 않는 버전을 참조하는 문제 수정
  - vue-pivottable의 peerDependency를 ^1.1.5에서 ^1.1.4로 변경
  - 1.1.5는 아직 정식 릴리즈되지 않았으므로 1.1.4를 참조해야 함
  - plotly-renderer와 lazy-table-renderer 모두 수정
  - vue-pivottable@1.1.5

## 2.0.6

### Patch Changes

- 702023a: fix: peerDependencies가 존재하지 않는 버전을 참조하는 문제 수정
  - vue-pivottable의 peerDependency를 ^1.1.5에서 ^1.1.4로 변경
  - 1.1.5는 아직 정식 릴리즈되지 않았으므로 1.1.4를 참조해야 함

- 5ef202b: fix: develop 브랜치를 베타 버전으로 복구
  - develop 브랜치가 정식 버전으로 잘못 업데이트된 것을 수정
  - 모든 패키지를 베타 버전으로 변경
  - develop 브랜치는 항상 베타 버전을 유지해야 함

- Updated dependencies [5ef202b]
  - vue-pivottable@1.1.5

## 2.0.6

### Patch Changes

- 9dd7707: fix: 베타 릴리즈 프로세스 전체 개선
  - 베타 버전 중복 문제 해결 (1.1.5-beta.xxx-beta.yyy → 1.1.5-beta.yyy)
  - peerDependencies 베타 버전 오염 방지
  - changeset 적용 전 package.json 백업 및 peerDependencies 복원 로직 추가
  - 워크플로우에서 베타 버전이 의존성에 전파되지 않도록 개선

- 9dd7707: fix: 베타 버전 중복 및 peerDependencies 오염 문제 긴급 수정
  - 중복된 베타 버전 제거 (1.1.5-beta.xxx-beta.yyy → 1.1.5-beta.yyy)
  - plotly-renderer의 peerDependencies를 원래 버전으로 복원

- Updated dependencies [9dd7707]
- Updated dependencies [9dd7707]
  - vue-pivottable@1.1.5

## 2.0.6

### Patch Changes

- 8c517e1: test: PR 자동 업데이트 두 번째 검증
  - vue-pivottable@1.1.5-beta.1750384228

## 2.0.5

### Patch Changes

- 47d4f39: fix: npm 배포 태그 수정 및 정식 버전 배포 문제 해결
  - vue-pivottable@1.1.4

## 2.0.4

### Patch Changes

- 639ff48: test: 베타 태그 배포 수정 테스트
  - vue-pivottable@1.1.4

## 2.0.3

### Patch Changes

- da9795b: fix: 잘못된 베타 버전이 latest 태그로 배포된 문제 수정
  - vue-pivottable@1.1.4

## 2.0.2

### Patch Changes

- 726ccb7: fix: 중복된 베타 버전 정리
  - vue-pivottable@1.1.4

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
