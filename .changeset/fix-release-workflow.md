---
"vue-pivottable": patch
"@vue-pivottable/lazy-table-renderer": patch
"@vue-pivottable/plotly-renderer": patch
---

fix: 프로덕션 배포가 release 브랜치에서 실행되도록 수정

- release.yml에서 release-packages.cjs 사용하도록 변경
- npm 배포 전 release 브랜치로 checkout하도록 수정
- 베타와 프로덕션 배포가 동일한 스크립트 사용