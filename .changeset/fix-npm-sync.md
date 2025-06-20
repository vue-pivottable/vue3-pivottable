---
"vue-pivottable": patch
"@vue-pivottable/plotly-renderer": patch  
"@vue-pivottable/lazy-table-renderer": patch
---

fix: 워크플로우 및 버전 관리 시스템 개선

- develop 브랜치에서 항상 베타 버전 보장하는 로직 추가
- peerDependencies를 현재 npm latest와 일치하도록 수정
- changeset이 없어도 베타 접미사가 자동으로 추가되도록 개선
- npm 배포 충돌 및 버전 불일치 문제 근본 해결