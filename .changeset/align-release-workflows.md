---
"vue-pivottable": patch
"@vue-pivottable/lazy-table-renderer": patch
"@vue-pivottable/plotly-renderer": patch
---

fix: 베타와 프로덕션 릴리스 워크플로우 통일

- 베타와 프로덕션 모두 동일한 release-packages.cjs 스크립트 사용
- 프로덕션 릴리스 시 기존 릴리스 브랜치 삭제 후 재생성
- 프로덕션 배포가 릴리스 브랜치에서 실행되도록 수정