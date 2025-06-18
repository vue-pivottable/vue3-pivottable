# Vite+TypeScript 라이브러리 dts 타입 선언 빌드 오류, 실전 해결 총정리

## 1. 기존 구조 및 마이그레이션 목표

- 기존 `src/helper/utilities.js`를 TypeScript(`utilities.ts`)로 변환하여 타입 안전성 강화 및 실무적 문서화 진행.
- 기존 동작 100% 유지, 점진적 strict 옵션 적용, 실무적 이슈/커밋/정책 관리 일관성 확보.
- **실전 맥락:** 오픈소스 라이브러리로 배포 시, 타입 선언(dts) 파일이 반드시 필요하고, Vite+TypeScript 조합에서 dts 자동 생성이 필수적임. 하지만 실제로는 dts 빌드 오류가 자주 발생하며, 특히 내부적으로 타입/값이 복잡하게 얽힌 유틸리티/핵심 클래스에서 문제가 집중됨.

## 2. 주요 이슈 및 시도한 해결책

### (1) 타입 선언(dts) 생성 실패

- `vite-plugin-dts` + `api-extractor` 조합에서 `PivotData` 등 일부 클래스/타입의 dts 생성 시 "Unable to follow symbol" 에러 발생.
- **실제 시도한 방법:**
  - 타입/값 export 분리 (type은 export type, 값은 export)
  - index.js에서만 export, 내부 파일에서는 export하지 않기
  - 타입만 export, 값은 직접 import(비권장)
  - 클래스명 바꾸기(예: PivotData → PivotDataCore 등, 효과 없음)
  - 타입 선언만 남기고 값 구현은 별도 파일에서 관리(유지보수성 저하)
  - vite-plugin-dts 옵션(staticImport, insertTypesEntry, rollupTypes 등) 다양한 조합 실험
  - tsconfig baseUrl/paths 최소화, 경로 alias 제거
  - 공식 이슈 트래커/FAQ/실전 사례 조사
- **실제로 효과 없었던 시도:**
  - 클래스명 바꾸기, 타입만 export, 값 직접 import, index.js 단일 export 등은 dts 빌드 오류(심볼 추적 꼬임) 해결에 효과 없음

### (2) 공식/실전 해결책 적용

- 모든 import 경로를 상대경로로 통일.
- vite-plugin-dts 옵션에서 rollupTypes: false, tsconfig baseUrl/paths 최소화 등 공식 권장 우회책 적용.
- 그래도 완전한 해결이 어려워, 타입 선언만 별도 수동 작성하는 방식(@types/react-pivottable 참고)도 검토.
- **리액트 공식 타입 구조와의 비교:**
  - @types/react-pivottable은 dts 자동 생성이 아니라 사람이 직접 index.d.ts를 작성함으로써, 타입스크립트의 심볼 추적 꼬임 문제를 원천 차단.
  - 생성자 함수(ES5)와 ES6 클래스 방식의 차이, 타입 선언만 있으면 실제 구현과 무관하게 타입 배포 가능.

### (3) 실무적 우회책 적용

- tsc로 `src/helper/utilities.ts`만 별도 dts 파일(`src/helper/utilities.d.ts`)을 생성.
- vite 빌드 시 해당 dts 파일을 타입 선언으로 사용하도록 build 스크립트(`package.json`) 수정.
- vite.config.ts의 dts 관련 커스텀 옵션 제거(기본값 복원).
- 필요시, git checkout으로 utilities.ts, index.js 등 핵심 파일을 원상복구하여 변경 이력 최소화.
- **실제 적용 예시:**
  ```json
  // package.json
  "build": "tsc src/helper/utilities.ts --declaration --emitDeclarationOnly --outDir src/helper && vite build"
  ```
  - 이 방식으로 tsc가 개별 dts만 생성, vite 빌드에서 타입 선언 에러 없이 배포 가능

## 3. 최종 빌드 및 검증

- `pnpm build` 실행 시, tsc가 utilities.ts의 dts 파일을 정상 생성하고, vite 빌드도 타입 선언 에러 없이 완료됨.
- dts 생성 과정에서 치명적 에러 없이, 경고(warning)만 존재(예: 사용되지 않는 변수).
- dist/types/에 타입 선언 파일이 정상적으로 생성되고, ES/UMD 번들, sourcemap 등도 정상 생성됨.
