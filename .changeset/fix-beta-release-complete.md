---
"vue-pivottable": patch
"@vue-pivottable/plotly-renderer": patch
---

fix: 베타 릴리즈 프로세스 개선 및 버그 수정

- 베타 버전 중복 문제 해결 (1.1.5-beta.xxx-beta.yyy → 1.1.5-beta.yyy)
- peerDependencies는 정식 버전 유지 (베타 버전이 의존성에 전파되지 않도록)
- changeset 적용 후 peerDependencies만 원래 버전으로 복원하는 로직 추가
- develop 브랜치는 베타 버전 유지, 의존성만 정식 버전 참조