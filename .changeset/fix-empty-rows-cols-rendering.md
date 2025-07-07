---
"vue-pivottable": patch
---

fix: rows/cols가 비어있을 때 Vue2와 동일하게 렌더링되도록 수정

- 디버그용 console.log 코드 제거
- rows/cols가 모두 비어있을 때도 테이블 구조와 총계가 표시되도록 수정
- rowAttrs가 비어있을 때 헤더에 빈 행이 추가되는 문제 해결
- Vue2의 렌더링 동작과 완전히 일치하도록 조건부 렌더링 로직 개선