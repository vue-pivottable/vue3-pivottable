# [TS 전환] src/components/pivottable 전체 TypeScript 마이그레이션 이슈

## 목적

- `src/components/pivottable` 및 하위 renderer 디렉토리의 모든 Vue/JS 파일을 TypeScript로 전환하여 타입 안정성과 유지보수성을 높입니다.

## 대상 파일

- VPivottable.vue
- VPivottableBody.vue
- VPivottableHeaderColumns.vue
- VPivottableHeader.vue
- VPivottableBodyRowsTotalRow.vue
- VPivottableBodyRows.vue
- VPivottableHeaderRowsTotal.vue
- VPivottableHeaderRows.vue
- renderer/index.js
- renderer/TableRenderer.vue
- renderer/TSVExportRenderers.vue

---

## 시퀀셜 씽킹 기반 단계별 전환 계획

### 1. 사전 준비

- [ ] 각 파일별로 JS/TS 변환 난이도 및 의존성 파악
- [ ] 공통 타입/인터페이스 정의 필요성 조사 (예: PivotData, Cell, Header 등)
- [ ] 기존 JS 코드에서 any, 암시적 타입 사용 부분 목록화

### 2. 타입 정의 및 공통 유틸리티 작성

- [ ] 공통 타입/인터페이스를 별도 파일로 분리 (예: `types.ts`)
- [ ] renderer와 pivottable 컴포넌트 간 공유 타입 정의

### 3. 개별 파일별 TypeScript 전환

- [ ] VPivottable.vue → VPivottable.ts
- [ ] VPivottableBody.vue → VPivottableBody.ts
- [ ] VPivottableHeaderColumns.vue → VPivottableHeaderColumns.ts
- [ ] VPivottableHeader.vue → VPivottableHeader.ts
- [ ] VPivottableBodyRowsTotalRow.vue → VPivottableBodyRowsTotalRow.ts
- [ ] VPivottableBodyRows.vue → VPivottableBodyRows.ts
- [ ] VPivottableHeaderRowsTotal.vue → VPivottableHeaderRowsTotal.ts
- [ ] VPivottableHeaderRows.vue → VPivottableHeaderRows.ts
- [ ] renderer/index.js → renderer/index.ts
- [ ] renderer/TableRenderer.vue → renderer/TableRenderer.ts
- [ ] renderer/TSVExportRenderers.vue → renderer/TSVExportRenderers.ts

### 4. 타입 에러 및 마이그레이션 이슈 해결

- [ ] 각 파일별 타입 에러 수정
- [ ] any, unknown 등 임시 타입 최소화
- [ ] Vue 컴포넌트 옵션/props/emit 등 TS 명시화

### 5. 통합 테스트 및 QA

- [ ] 전체 pivottable 기능 정상 동작 확인
- [ ] 타입 체크 및 빌드 오류 없는지 확인
- [ ] 주요 시나리오별 수동 테스트

### 6. 문서화 및 코드 리뷰

- [ ] 타입/인터페이스 문서화
- [ ] PR 및 코드 리뷰

---

## 참고 사항

- 마이그레이션 중간에도 기능이 깨지지 않도록 점진적 전환 권장
- 필요시 `lang="ts"` 및 `<script setup>` 방식 적용
- 기존 JS 파일은 변환 완료 후 삭제 예정
- **타입 분리 및 정의 원칙:**
  - 여러 컴포넌트에서 공통으로 사용하는 타입만 helper/types 등에서 import하여 사용
  - 각 컴포넌트의 props, emits, slots 등은 해당 vue 파일 내에서 명확하게 타입 선언
  - 이미 정의된 helper의 타입/유틸리티 함수는 적극적으로 재활용
  - 타입 중복 정의를 피하고, helper에 없는 공통 타입만 신규로 정의

---

담당자: @
예상 일정:
관련 이슈:
