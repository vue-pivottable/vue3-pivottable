---
"vue-pivottable": patch
"@vue-pivottable/lazy-table-renderer": patch
"@vue-pivottable/plotly-renderer": patch
---

fix: 릴리즈 브랜치 생성 전 기존 브랜치 삭제

- 릴리즈 브랜치가 이미 존재할 경우 삭제 후 재생성
- 반복된 릴리즈 시도 시 발생하는 충돌 방지