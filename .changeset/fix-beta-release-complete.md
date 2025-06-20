---
"vue-pivottable": patch
"@vue-pivottable/plotly-renderer": patch
---

fix: 베타 릴리즈 프로세스 전체 개선

- 베타 버전 중복 문제 해결 (1.1.5-beta.xxx-beta.yyy → 1.1.5-beta.yyy)
- peerDependencies 베타 버전 오염 방지
- changeset 적용 전 package.json 백업 및 peerDependencies 복원 로직 추가
- 워크플로우에서 베타 버전이 의존성에 전파되지 않도록 개선