---
"@vue-pivottable/plotly-renderer": patch
"@vue-pivottable/lazy-table-renderer": patch
---

fix: peerDependencies가 존재하지 않는 버전을 참조하는 문제 수정

- vue-pivottable의 peerDependency를 ^1.1.5에서 ^1.1.4로 변경
- 1.1.5는 아직 정식 릴리즈되지 않았으므로 1.1.4를 참조해야 함
- plotly-renderer와 lazy-table-renderer 모두 수정