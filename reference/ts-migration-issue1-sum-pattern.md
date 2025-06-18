# sum(attrs)() 패턴이 잘못된 이유와 근거

## 1. AggregatorTemplate의 함수 구조

- aggregatorTemplates의 각 함수(예: sum)는 다음과 같은 구조를 가집니다.
  1. 첫 번째 함수: 포맷터 등 옵션을 받음
  2. 두 번째 함수: 실제 집계할 속성 배열([attr])을 받음
  3. 세 번째 함수: AggregatorInstance(집계기 객체)를 반환

예시:

```ts
const sumAggTemplate = aggregatorTemplates.sum(usFmt) // 1단계: 포맷터 적용
const sumAgg = sumAggTemplate(['value']) // 2단계: 속성명 적용
const instance = sumAgg() // 3단계: AggregatorInstance 생성
```

## 2. sum(attrs)() 패턴의 문제점

- sum(attrs)에서 attrs는 포맷터(옵션)이지, 실제 집계할 속성 배열이 아님
- sum(attrs)()처럼 바로 실행하면 속성 정보 없이 인스턴스를 만들어버림
- 피벗테이블에서 어떤 필드를 합산할지 지정해야 하므로 반드시 [attr](예: ['value'])가 필요
- 속성 없이 인스턴스를 만들면, 집계 대상 필드가 없어 잘못된 결과가 나옴

## 3. 올바른 호출 방식

- 잘못된 예시: `aggregatorTemplates.sum(usFmt)()`
- 올바른 예시: `aggregatorTemplates.sum(usFmt)(['value'])`

## 4. 실제 코드 근거

```ts
sum (formatter: Formatter = usFmt): AggregatorTemplate {
  return ([attr]: [string]) => () => ({
    sum: 0,
    push (record: DataRecord) {
      const val = parseFloat(String(record[attr]))
      if (!isNaN(val)) {
        this.sum += val
      }
    },
    value () {
      return this.sum
    },
    format: formatter,
    numInputs: typeof attr !== 'undefined' ? 0 : 1
  })
}
```

- 첫 번째 함수: 포맷터를 받고
- 두 번째 함수: [attr]을 받고
- 세 번째 함수: AggregatorInstance를 반환

## 5. 결론

- sum(attrs)()는 속성 배열 없이 인스턴스를 만들어 잘못된 동작을 유발함
- 반드시 sum(attrs)([attr])처럼 속성 배열을 명시적으로 넘겨야 함
- 실제로는 aggregators 객체에 템플릿 함수만 저장하고, 사용할 때 속성 배열을 넘기는 구조가 맞음

## 쉬운 설명 (한줄 요약)

> 옵션(포맷터)은 잘 받으면서, 진짜 필수인 속성 정보([attr])는 안 받아서, 집계할 대상을 모르는 잘못된 인스턴스가 만들어진다!

## 수정 과정에서 발견된 추가 이슈

- aggregators, frAggregators 객체에는 AggregatorTemplate(템플릿 함수)만 저장해야 하며, 실제 사용할 때 속성 배열([attr])을 넘겨 AggregatorFunction을 생성해야 함
- Locale, PivotDataProps 등에서 aggregators 타입을 Record<string, AggregatorTemplate>로 맞춰야 타입 불일치 에러가 발생하지 않음
- PivotData 클래스에서는 생성자에서 this.aggregator = aggregators[aggregatorName]!(this.props.vals)처럼 반드시 속성 배열을 넘겨야 실제 집계 함수가 정상 동작하고 타입도 맞음
- 이 과정을 통해 타입 안정성과 런타임 동작의 일관성을 모두 확보할 수 있음
