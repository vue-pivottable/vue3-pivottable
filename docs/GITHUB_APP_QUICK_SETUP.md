# GitHub App 빠른 설정 가이드

## 🚀 5분 안에 GitHub App 설정하기

### Step 1: App 생성
1. [GitHub App 생성 페이지](https://github.com/settings/apps/new) 이동
2. 다음 정보 입력:
   ```
   App name: vue-pivottable-release-bot
   Homepage URL: https://github.com/vue-pivottable/vue3-pivottable
   ```

### Step 2: 권한 설정 (복사해서 사용)
Repository permissions에서 다음 항목 설정:
- ✅ Actions: **Read**
- ✅ Contents: **Write**
- ✅ Issues: **Write**
- ✅ Pull requests: **Write**
- ✅ Commit statuses: **Write**

### Step 3: Webhook 비활성화
- Active webhook: ❌ 체크 해제

### Step 4: 생성 후 필수 작업
1. **Private Key 생성**
   - "Generate a private key" 클릭
   - 다운로드된 `.pem` 파일 저장

2. **정보 수집**
   - App ID: `12345` (예시)
   - 앱 설치 → Installation ID 확인

### Step 5: Repository Secrets 추가
Settings → Secrets → Actions에서:

```bash
# 1. APP_ID
12345

# 2. APP_INSTALLATION_ID  
12345678

# 3. APP_PRIVATE_KEY (전체 내용)
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----

# 4. NPM_TOKEN
npm_xxxxxxxxxxxxx
```

### Step 6: Branch Protection 설정
1. Settings → Branches → main rule
2. "Restrict who can push" → Add apps
3. `vue-pivottable-release-bot` 선택

## ✅ 체크리스트

- [ ] GitHub App 생성 완료
- [ ] 필수 권한 5개 설정
- [ ] Private Key 다운로드
- [ ] App ID 메모
- [ ] Installation ID 메모
- [ ] Repository Secrets 4개 추가
- [ ] Branch Protection에 App 추가

## 🔍 확인 방법

워크플로우에서 테스트:
```yaml
- uses: tibdex/github-app-token@v1
  with:
    app_id: ${{ secrets.APP_ID }}
    private_key: ${{ secrets.APP_PRIVATE_KEY }}
    installation_id: ${{ secrets.APP_INSTALLATION_ID }}
```

성공하면 준비 완료! 🎉