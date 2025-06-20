---
"@vue-pivottable/plotly-renderer": patch
---

fix: PR #238 CI 실패 문제 해결

- plotly-renderer의 peerDependencies에서 vue-pivottable 버전을 ^1.1.5에서 ^1.1.4로 수정
- 아직 정식 릴리즈되지 않은 1.1.5를 참조하여 lockfile 불일치 오류 발생
- 현재 최신 정식 버전인 1.1.4를 참조하도록 수정