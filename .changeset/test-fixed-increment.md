---
"vue-pivottable": patch
"@vue-pivottable/plotly-renderer": patch
---

test: 수정된 베타 버전 증가 로직 테스트

**수정된 워크플로우 검증:**

1. changeset 실행 전 베타 접미사 제거
2. changeset version으로 버전 증가 (1.1.6 → 1.1.7, 2.0.7 → 2.0.8)
3. 증가된 버전에 베타 접미사 재적용

**기대 결과:**
- vue-pivottable: 1.1.6-beta.xxx → 1.1.7-beta.yyy
- plotly-renderer: 2.0.7-beta.xxx → 2.0.8-beta.yyy  
- lazy-table-renderer: 변경 없음 (changeset 제외)