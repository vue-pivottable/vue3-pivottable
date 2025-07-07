---
"vue-pivottable": patch
---

fix: Release 워크플로우에서 develop 동기화 단계 제거

- main 브랜치에서 stable 릴리즈 후 develop 브랜치와의 동기화 시 발생하는 버전 충돌 문제 해결
- develop은 항상 베타 버전을 유지하고, main은 stable 버전만 유지하도록 워크플로우 개선