# AI 사용 지침 (AI Usage Guidelines)

## 목적
이 문서는 Cursor Editor 및 Claude Code에서 AI를 활용한 코드 작업 시 따라야 할 지침을 정의합니다.

## 핵심 원칙

### 1. 코드 변경 전 승인 필수
코드 변경이 필요한 경우, 반드시 다음 프로세스를 따릅니다:

작업을 시작하기 전에 먼저 이 지침사항과 일치하는지 자가 점검합니다. 의문이 들거나 확실하지 않은 경우 작업하기 전에 보고하고 확인을 받습니다.

1. **현재 상황 분석**
   - 문제점을 명확히 파악
   - 관련 코드 및 사용처 확인
   - 영향 범위 분석

2. **제안 사항 제시**
   - 변경이 필요한 이유를 명확한 근거와 함께 설명
   - 여러 해결 방안이 있다면 각각의 장단점 제시
   - 권장하는 방향 제안

3. **승인 대기**
   - 사용자의 명시적 승인을 받은 후 진행
   - 승인 없이 임의로 코드 변경 금지

작업 중에 추가 요청이 들어온 경우, sequential-thinking을 활용하여 기존 작업과 비교합니다. 현재 진행 중인 작업과의 연관성, 우선순위, 의존성을 분석하여 나중에 할지, 먼저 할지, 중간에 삽입할지 작업 계획을 재검토하고 사용자에게 제안합니다.

## 실제 사례 예시

### 사례 1: ESLint 설정 오류 해결

#### 1) 문제 발견
```bash
> pnpm lint
ConfigError: Config "UserConfig[0][2] > typescript-eslint/base": Key "plugins": Cannot redefine plugin "@typescript-eslint".
```

#### 2) 분석 및 보고
```markdown
문제를 발견했습니다. `@typescript-eslint` 플러그인이 중복 정의되었습니다.

**문제 분석:**
- tseslint를 플러그인으로 잘못 사용하고 있습니다.
- ESLint 9.27.0의 플랫 설정 구조에 맞지 않습니다.

수정하겠습니다.
```

#### 3) 실제 수정
```javascript
// Before
plugins: {
  'vue': pluginVue,
  '@typescript-eslint': tseslint  // 잘못된 사용
}

// After - 플러그인 제거하고 configs로 사용
...tseslint.configs.recommended,
```

### 사례 2: TypeScript 타입 오류 해결

#### 1) 문제 발견
```typescript
// 빌드 오류
Type 'undefined' is not assignable to type '(props: any) => () => VNode'.
```

#### 2) 분석 및 보고
```markdown
**문제 분석:**
- `RendererDefinition`의 `setup` 속성이 optional(`?`)인데, 일부 컴포넌트에서는 required로 기대하고 있습니다.
- 하위 패키지들이 `vue-pivottable`의 타입을 찾지 못하고 있습니다.

**제안 사항:**
1. `RendererDefinition`의 `setup`을 required로 변경하거나
2. 사용하는 곳에서 optional로 처리하도록 수정

어떤 방향으로 진행할까요? 기존 코드의 의도를 확인하고 싶습니다.
```

#### 3) 사용자 응답 후 진행
> "2번으로 변경 후 다른 변경사항이 있는 경우에는 동일하게 보고하고 컨펌받고 진행해야됩니다."

```markdown
네, 2번 방향으로 진행하겠습니다.
[코드 수정 진행]
```

### 사례 3: 타입 정의 개선

#### 1) 코드 분석
```typescript
// 실제 사용처 확인
grep -n "\.renderer[^s]" src/components/pivottable/VPivottable.vue
// 결과: 사용하지 않음

grep -B2 -A2 "\.value" src/components/pivottable/renderer/index.ts
// 결과: 사용하지 않음
```

#### 2) 보고 및 제안
```markdown
**현재 상황:**
- 실제 렌더러 정의: `name`과 `setup`만 사용
- `renderer`: 사용 안 함
- `value`: 사용 안 함
- `props`: optional로 사용 가능

**제안:**
```typescript
export interface RendererDefinition {
  name: string
  props?: Record<string, any>
  setup: (props: any) => () => VNode
}
```

이렇게 단순화하는 것이 맞을까요?
```

#### 3) 승인 후 수정
> "네 맞습니다. 제안대로 적용하고..."

### 사례 4: 빌드 오류 대응

#### 1) 테스트 실행
```bash
pnpm lint
pnpm typecheck
pnpm build:all
```

#### 2) 오류 발생 시 보고
```markdown
ESLint 오류가 발생했습니다. release-packages-beta.js 파일을 ES modules로 변환해야 합니다.

**오류 내용:**
```
3:22  error  A `require()` style import is forbidden
```

**원인:**
현재 프로젝트가 ES modules를 사용하는데 CommonJS 구문을 사용

**해결 방안:**
require → import 구문으로 변환
```

### 사례 5: 하위 패키지 타입 이슈

#### 1) 상황 파악
```markdown
**문제 분석:**
1. `RendererDefinition`에서 `setup`은 필수, `props`는 optional이 맞음
2. 하위 패키지들은 아직 TypeScript 전환이 완료되지 않음
3. 빌드는 성공하지만 타입 체크에서 경고가 발생

**제안 사항:**

### 1. 메인 패키지의 타입 수정
[타입 정의 코드]

### 2. 하위 패키지 타입 체크 무시
- 각 하위 패키지의 `tsconfig.json`에 `"skipLibCheck": true` 추가
- 또는 하위 패키지의 import 부분에 `// @ts-ignore` 추가
- 빌드 스크립트에서 타입 체크 제외

### 3. 워크플로우 수정
- PR 체크 시 하위 패키지의 타입 체크를 건너뛰도록 설정

어떤 방향이 좋을까요? 하위 패키지는 추후 타입 전환 시까지 타입 체크를 무시하는 것이 현실적일 것 같습니다.
```

## 주요 지침

### 1. 순차적 사고 (Sequential Thinking)
- 복잡한 작업은 단계별로 나누어 접근
- 각 단계를 명확히 정의하고 순서대로 진행
- 단계별 완료 확인 후 다음 단계 진행

#### 예시: 다중 파일 작업
```markdown
## 작업 계획
1. 문제 분석 및 영향 범위 파악
2. 첫 번째 파일 수정
3. 테스트 및 검증
4. 두 번째 파일 수정
5. 전체 통합 테스트
```

### 2. 점진적 접근
- 한 번에 하나의 문제만 해결
- 각 단계마다 테스트 수행
- 결과 보고 후 다음 단계 진행

### 3. MCP 서버 활용
- **sequential-thinking MCP 서버가 설정된 경우**: 복잡한 문제 해결 시 활용
- **context7 MCP 서버가 설정된 경우**: 기술적 이슈나 최신 내용 확인이 필요할 때 사용
- MCP 서버가 없는 경우: 순차적 사고 방식으로 접근

#### MCP 서버 사용 예시
```markdown
# sequential-thinking 서버
- 복잡한 버그 디버깅
- 다단계 리팩토링 작업
- 의존성 업데이트 영향 분석

# context7 서버
- 최신 라이브러리 API 확인
- 보안 이슈 검토
- 성능 최적화 가이드
```

### 4. Task 도구 활용
- 여러 파일에 걸친 복잡한 검색이나 분석 작업 시 활용
- 단순한 파일 읽기보다 복잡한 패턴 검색이나 코드 분석이 필요할 때

#### 예시: Task 도구 사용 케이스
```markdown
- ESLint 설정 파일과 관련된 모든 사용처 찾기
- 특정 타입이 프로젝트 전체에서 어떻게 사용되는지 분석
- 의존성 업데이트가 미치는 영향 범위 파악
```

### 5. 명확한 근거 제시
```markdown
// 좋은 예시
"RendererDefinition에서 renderer 속성이 실제로 사용되는 곳이 없습니다.
grep 검색 결과: [검색 결과 첨부]
따라서 제거를 제안합니다."

// 나쁜 예시
"이 속성은 필요 없어 보입니다."
```

### 6. 사용자 의도 확인
```markdown
"기존 코드의 의도를 확인하고 싶습니다."
"어떤 방향으로 진행할까요?"
"이렇게 수정하는 것이 맞을까요?"
```

### 7. 테스트 결과 공유
```bash
# 항상 다음 명령어로 검증
pnpm lint      # ESLint 검사
pnpm typecheck # TypeScript 타입 체크
pnpm build:all # 전체 빌드
```

## 금지 사항

1. **무단 코드 변경**
   - 승인 없이 코드 수정 금지
   - "수정하겠습니다" 후 바로 수정 X

2. **의존성 다운그레이드**
   - 특정 버전의 의존성(예: ESLint 9.27.0)은 프로젝트 호환성을 위해 반드시 유지
   - 버전 변경이 필요한 경우 충분한 검토와 승인 필요

3. **추측성 변경**
   - 사용처 확인 없이 "아마도", "보통은" 등으로 변경 금지
   - 명확한 근거 기반으로만 수정

## 커뮤니케이션 원칙

1. **간결하고 명확하게**
   - 불필요한 설명 최소화
   - 핵심만 전달

2. **단계별 보고**
   ```markdown
   1. 문제 발견
   2. 원인 분석
   3. 해결 방안 제시
   4. 승인 요청
   5. 실행 및 결과 보고
   ```

3. **오류 시 즉시 보고**
   - 예상치 못한 오류 발생 시 즉시 중단
   - 오류 내용과 원인 분석 제시
   - 해결 방안 제안 후 승인 대기

이 지침은 효율적이고 안전한 AI 활용 코드 작업을 위한 것입니다.