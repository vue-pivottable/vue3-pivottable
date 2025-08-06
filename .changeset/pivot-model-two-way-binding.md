---
"vue-pivottable": minor
---

feat: PivotModel 양방향 바인딩 기능 구현

- VPivottableUi 컴포넌트에 v-model:pivotModel 지원 추가
- PivotModel 인터페이스 정의 및 타입 시스템 구축
- 필터 변경사항이 즉시 PivotModel에 반영되도록 수정
- props 정의를 Partial<DefaultPropsType>로 변경하여 pivotModel 사용 시 개별 props를 선택적으로 만듦
- PivotModel 유틸리티 함수 추가 (비교, 생성, 복제)
- PivotModel 히스토리 관리를 위한 composable 추가 (usePivotModelHistory)
- PivotModel 직렬화/역직렬화 유틸리티 추가