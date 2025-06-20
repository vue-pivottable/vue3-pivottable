---
"vue-pivottable": patch
"@vue-pivottable/plotly-renderer": patch
---

test: 올바른 베타 버전 증가 테스트

**수정된 로직 테스트:**
- changeset version의 버전 증가를 보존
- 선택적 베타 타임스탬프 적용 (변경된 패키지만)
- lazy-table-renderer는 changeset 없으므로 변경되지 않아야 함

**기대 결과:**
- vue-pivottable: 1.1.6-beta.old → 1.1.7-beta.new (버전 증가 + 새 타임스탬프)
- plotly-renderer: 2.0.7-beta.old → 2.0.8-beta.new (버전 증가 + 새 타임스탬프)
- lazy-table-renderer: 1.1.7-beta.old → 1.1.7-beta.old (변경 없음)