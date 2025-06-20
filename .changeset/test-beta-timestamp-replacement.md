---
"vue-pivottable": patch
"@vue-pivottable/plotly-renderer": patch
---

test: 베타 타임스탬프 교체 시나리오 테스트

**현재 상황:**
- develop 브랜치에 이미 베타 버전들이 존재
- main PR #247이 승인되지 않은 상태
- 추가 changeset으로 베타 타임스탬프 교체 테스트

**기대 결과:**
- vue-pivottable: 1.1.6-beta.OLD → 1.1.7-beta.NEW
- plotly-renderer: 2.0.7-beta.OLD → 2.0.8-beta.NEW
- lazy-table-renderer: 1.1.7-beta.OLD (변경 없음, changeset 없음)

**테스트 목표:**
- 베타 중복 방지 (1.1.7-beta.xxx-beta.yyy 같은 형태 방지)
- 새로운 타임스탬프로 교체
- main PR #247 자동 업데이트