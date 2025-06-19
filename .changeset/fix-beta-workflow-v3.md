---
"vue-pivottable": patch
---

fix: 베타 릴리스 워크플로우 근본 수정 (3번째 시도)

- step ID 누락 해결: 'id: version' 추가
- 베타 중복 방지: 기존 -beta.* 제거 후 새로 추가
- 릴리스 순서 개선: GitHub Release → npm 퍼블리시
- 태그명 표준화: vue-pivottable@버전 형식 사용