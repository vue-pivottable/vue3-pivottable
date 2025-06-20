---
"vue-pivottable": patch
"@vue-pivottable/plotly-renderer": patch
---

fix: 베타 버전 중복 및 peerDependencies 오염 문제 긴급 수정

- 중복된 베타 버전 제거 (1.1.5-beta.xxx-beta.yyy → 1.1.5-beta.yyy)
- plotly-renderer의 peerDependencies를 원래 버전으로 복원