# GitHub App 설정 가이드

이 가이드는 vue3-pivottable 프로젝트의 자동 릴리스를 위한 GitHub App 설정 방법을 설명합니다.

## 1. GitHub App 생성

### 1.1 GitHub 설정 페이지로 이동
- 개인 계정: https://github.com/settings/apps/new
- 조직 계정: https://github.com/organizations/{org-name}/settings/apps/new

### 1.2 기본 정보 입력

```
GitHub App name: vue-pivottable-release-bot
Homepage URL: https://github.com/vue-pivottable/vue3-pivottable
```

**설명 (Description)**:
```
Automated release bot for vue3-pivottable monorepo. Handles version bumps, changelog generation, and npm publishing.
```

### 1.3 Webhook 설정
- **Active**: ❌ 체크 해제 (webhook 불필요)

### 1.4 권한 (Permissions) 설정 - 상세 가이드

#### Repository permissions (필수):

1. **Actions: Read**
   - 이유: GitHub Actions 워크플로우 실행 상태 확인
   - 사용: 워크플로우 트리거 및 상태 모니터링

2. **Contents: Write** ⚠️ 중요
   - 이유: 코드 변경, 커밋, 태그 생성
   - 사용: 
     - `package.json` 버전 업데이트
     - `CHANGELOG.md` 생성 및 업데이트
     - Git 태그 생성
     - Protected branch에 직접 푸시

3. **Issues: Write**
   - 이유: 릴리스 노트를 이슈에 코멘트
   - 사용: 릴리스 관련 이슈 자동 닫기, 코멘트 추가

4. **Metadata: Read** (자동 필수)
   - 이유: 기본적인 저장소 정보 접근
   - 사용: 저장소 메타데이터 읽기

5. **Pull requests: Write** ⚠️ 중요
   - 이유: PR 생성, 수정, 코멘트
   - 사용:
     - Changesets Version PR 생성
     - PR 상태 업데이트
     - 릴리스 대시보드 코멘트

6. **Commit statuses: Write**
   - 이유: 커밋 상태 업데이트
   - 사용: CI/CD 상태 표시

#### Repository permissions (선택적 - 필요시 추가):

7. **Checks: Write**
   - 필요한 경우: GitHub Checks API 사용 시
   - 사용: 상세한 체크 결과 표시

8. **Deployments: Write**
   - 필요한 경우: 배포 환경 관리 시
   - 사용: 배포 상태 추적

9. **Packages: Write**
   - 필요한 경우: GitHub Packages 사용 시
   - 사용: GitHub Package Registry 배포

#### Account permissions:
- ❌ 모두 "No access"로 유지
- 이유: Organization 레벨 권한은 불필요

#### 권한 설정 시 주의사항:

1. **최소 권한 원칙**
   - 필요한 권한만 부여
   - Write 권한은 신중히 검토

2. **Contents: Write 권한**
   - Protected branch 우회의 핵심
   - 이 권한 없이는 자동 릴리스 불가

3. **Pull requests: Write 권한**
   - Changesets PR 생성에 필수
   - 릴리스 대시보드 기능에 필수

### 1.5 설치 위치
- **Where can this GitHub App be installed?**: Only on this account

## 2. App 생성 후 설정

### 2.1 Private Key 생성
1. App 설정 페이지에서 "Generate a private key" 클릭
2. `.pem` 파일이 다운로드됨
3. 이 파일의 내용을 안전하게 보관

### 2.2 필요한 정보 수집
생성된 App 페이지에서 다음 정보를 확인:
- **App ID**: 숫자 (예: 123456)
- **Installation ID**: App을 저장소에 설치한 후 URL에서 확인
  - `https://github.com/settings/installations/{installation_id}`

## 3. Repository에 App 설치

1. App 설정 페이지에서 "Install App" 클릭
2. vue3-pivottable 저장소 선택
3. "All repositories" 또는 "Only select repositories" 선택

## 4. Repository Secrets 설정

GitHub 저장소의 Settings → Secrets and variables → Actions에서 추가:

### 필수 Secrets:

```bash
# App ID (숫자)
APP_ID=123456

# Installation ID (숫자)
APP_INSTALLATION_ID=12345678

# Private Key (전체 내용 복사)
APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(전체 내용)
...
-----END RSA PRIVATE KEY-----

# NPM 토큰 (npm 배포용)
NPM_TOKEN=npm_...

# 추가 NPM 토큰 (plotly-renderer용)
NPM_TOKEN_SUMIN=npm_...
```

### Private Key 설정 시 주의사항:
- 전체 내용을 그대로 복사 (BEGIN/END 라인 포함)
- 줄바꿈 유지
- 앞뒤 공백 제거

## 5. Branch Protection Rules 업데이트

main 브랜치 보호 규칙에 App 추가:

1. Settings → Branches → main branch protection rule
2. "Restrict who can push to matching branches" 섹션
3. "Add app" 클릭 → "vue-pivottable-release-bot" 선택

이렇게 하면 App이 보호된 브랜치에 직접 푸시 가능

## 6. 테스트

### 워크플로우 테스트:
```yaml
- name: Generate GitHub App Token
  id: app-token
  uses: tibdex/github-app-token@v1
  with:
    app_id: ${{ secrets.APP_ID }}
    private_key: ${{ secrets.APP_PRIVATE_KEY }}
    installation_id: ${{ secrets.APP_INSTALLATION_ID }}

- name: Test Checkout
  uses: actions/checkout@v4
  with:
    token: ${{ steps.app-token.outputs.token }}
```

## 7. 문제 해결

### 일반적인 오류:

1. **"Bad credentials"**
   - App ID, Installation ID 확인
   - Private Key 형식 확인

2. **"Resource not accessible by integration"**
   - App 권한 재확인
   - Repository에 App이 설치되었는지 확인

3. **"Protected branch update failed"**
   - Branch protection rule에 App 추가 확인

### 디버깅 팁:

1. App 권한 확인:
   ```bash
   curl -H "Authorization: Bearer $GITHUB_TOKEN" \
     https://api.github.com/app/installations
   ```

2. 토큰 유효성 확인:
   ```bash
   curl -H "Authorization: Bearer $APP_TOKEN" \
     https://api.github.com/user
   ```

## 8. 보안 주의사항

- Private Key는 절대 코드에 직접 포함하지 않음
- Repository Secrets 사용
- 정기적으로 Key 로테이션
- 최소 권한 원칙 적용

## 참고 자료

- [GitHub Apps 문서](https://docs.github.com/en/apps)
- [tibdex/github-app-token Action](https://github.com/tibdex/github-app-token)
- [Branch Protection with Apps](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule)