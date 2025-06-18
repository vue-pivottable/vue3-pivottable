---
title: 브랜드 타입이 뭔가요? (중학생도 이해하는 설명)
date: "2025-05-28"
tags: ["typescript"]
categories: TypeScript
permalink: /blog/:year/:month/:day/:title/
last_modified_at: "2025-05-28"
---

`string & { __brand: unique symbol }` "이게 대체 뭐지?" 싶으실 텐데요. 이것이 바로 **브랜드 타입(Branded Types)**입니다.
브랜드 타입은 같은 타입이지만 서로 다른 의미를 가진 값들을 구분할 때 사용하는 고급 TypeScript 기법입니다.
<!--more-->

## 🤔 일상생활 예시로 이해하기

### 상황: 학교에서 일어날 수 있는 문제

```
철수의 학생번호: "2024001"
영희의 사물함번호: "2024001"
```

**문제 발생!**

- 선생님이 "2024001번 학생 나와봐"라고 하면?
- 철수와 영희가 동시에 일어날 수 있음!
- 둘 다 똑같은 "2024001" 숫자이지만 **의미가 다름**

### 해결책: 이름표(브랜드) 붙이기

```
철수: "학생-2024001" 
영희: "사물함-2024001"
```

이제 구분이 가능해짐!

## 💻 프로그래밍에서도 똑같은 문제가 생겨요

### 문제 상황

```typescript
// 둘 다 그냥 문자열
const studentId = "2024001"
const lockerId = "2024001"

// 이런 실수가 가능함
function findStudent(id: string) {
  // 학생을 찾는 함수
}

findStudent(lockerId)  // 앗! 사물함 번호를 넣었는데 에러가 안남!
```

### 브랜드 타입으로 해결

```typescript
// 브랜드(이름표) 붙이기
type StudentId = string & { __brand: "StudentId" }
type LockerId = string & { __brand: "LockerId" }

const studentId: StudentId = "2024001" as StudentId
const lockerId: LockerId = "2024001" as LockerId

function findStudent(id: StudentId) {
  // 이제 학생 ID만 받을 수 있음
}

findStudent(studentId)  // ✅ 정상
findStudent(lockerId)   // ❌ 에러! 사물함 번호는 안됨
```

## 🎯 브랜드 타입의 핵심 아이디어

### 1. 같은 타입이지만 다른 의미를 구분하자

**예시들:**

- 이메일 주소 vs 일반 문자열
- 전화번호 vs 일반 문자열  
- 돈(원화) vs 돈(달러) vs 일반 숫자
- 사용자 ID vs 상품 ID vs 일반 문자열

### 2. 실수를 방지하자

```typescript
// 브랜드 타입 없이
function sendEmail(email: string) { ... }
function logMessage(message: string) { ... }

const userEmail = "user@example.com"
const errorMessage = "에러가 발생했습니다"

sendEmail(errorMessage)  // 😱 실수! 에러 메시지를 이메일로 보냄
logMessage(userEmail)    // 😱 실수! 이메일을 로그로 출력
```

```typescript
// 브랜드 타입으로 해결
type Email = string & { __brand: "Email" }
type LogMessage = string & { __brand: "LogMessage" }

function sendEmail(email: Email) { ... }
function logMessage(message: LogMessage) { ... }

const userEmail: Email = "user@example.com" as Email
const errorMessage: LogMessage = "에러가 발생했습니다" as LogMessage

sendEmail(errorMessage)  // ❌ 컴파일 에러! 실수 방지됨
logMessage(userEmail)    // ❌ 컴파일 에러! 실수 방지됨
```

## 🔍 깊이 알아보기: 브랜드는 정말 어떻게 작동하나요?

### 🤔 궁금증 1: "브랜드"는 정말 값에 붙나요?

```typescript
type UserId = string & { __brand: "UserId" }
const userId: UserId = "abc123" as UserId

console.log(userId)  // 결과: "abc123"
console.log(typeof userId)  // 결과: "string"

// 🎯 놀라운 사실: __brand는 실제로 존재하지 않아요!
console.log('__brand' in userId)  // 결과: false
console.log(Object.keys(userId))  // 결과: [] (빈 배열)
```

**진실**: 브랜드는 **컴퓨터 프로그램이 실행될 때는 없어져요!**

### 🎭 브랜드 타입 = "보이지 않는 스티커"

**학교 비유로 다시 설명하면:**

1. **우리가 보는 것**:

   ```
   철수: "2024001" (그냥 숫자)
   영희: "2024001" (그냥 숫자)
   ```

2. **TypeScript가 보는 것**:

   ```
   철수: "2024001" + 보이지_않는_학생_스티커
   영희: "2024001" + 보이지_않는_사물함_스티커
   ```

3. **프로그램 실행할 때**:

   ```
   철수: "2024001" (스티커 사라짐)
   영희: "2024001" (스티커 사라짐)
   ```

### 🧪 실험해보기

```typescript
type StudentId = string & { __brand: "StudentId" }
type LockerId = string & { __brand: "LockerId" }

const student: StudentId = "2024001" as StudentId
const locker: LockerId = "2024001" as LockerId

// 실행해보면 둘 다 똑같아요!
console.log(student === locker)  // true (같다!)
console.log(student === "2024001")  // true (같다!)

// 하지만 TypeScript는 다르게 생각해요!
function useStudentId(id: StudentId) {}
function useLockerId(id: LockerId) {}

useStudentId(locker)  // ❌ TypeScript가 "안돼!" 라고 막음
useLockerId(student)  // ❌ TypeScript가 "안돼!" 라고 막음
```

### 💡 왜 이렇게 만들었을까요?

**장점들:**

1. **실수 방지**: 잘못된 값 사용을 막아줌
2. **빠른 속도**: 실제 실행시에는 원래 값 그대로 (속도 저하 없음)
3. **호환성**: 기존 JavaScript 코드와 잘 맞음

### 🔧 `unique symbol`은 뭔가요?

**더 특별한 스티커 만들기:**

```typescript
// 방법 1: 일반 스티커 (문제 있음)
type StudentId1 = string & { __brand: "Student" }
type StudentId2 = string & { __brand: "Student" }

const id1: StudentId1 = "abc" as StudentId1
const id2: StudentId2 = id1  // ✅ 문제없음 (같은 스티커라서)

// 방법 2: 특별한 스티커 (문제 해결)
type StudentId3 = string & { __brand: unique symbol }
type StudentId4 = string & { __brand: unique symbol }

const id3: StudentId3 = "abc" as StudentId3
const id4: StudentId4 = id3  // ❌ 에러! (다른 특별한 스티커라서)
```

**`unique symbol` = 절대 겹치지 않는 특별한 스티커**

- 각각 고유한 "마법의 번호"를 가짐
- TypeScript만 이 번호를 알 수 있음
- 실제 실행시에는 사라짐

## 🏭 실제로 어떻게 만들어 사용하나요?

### 1단계: 브랜드 타입 정의

```typescript
// 기본 패턴
type 새로운타입이름 = 기존타입 & { __brand: unique symbol }

// 예시들
type UserId = string & { __brand: unique symbol }
type ProductId = string & { __brand: unique symbol }
type Price = number & { __brand: unique symbol }
```

### 2단계: 안전한 생성 함수 만들기

```typescript
// 사용자 ID 검증해서 만들기
function createUserId(id: string): UserId | null {
  if (id.length >= 3 && id.startsWith("user_")) {
    return id as UserId  // 검증 통과하면 브랜드 타입으로 변환
  }
  return null  // 검증 실패하면 null
}

// 사용
const validId = createUserId("user_123")    // UserId 타입
const invalidId = createUserId("abc")       // null
```

### 3단계: 타입 안전하게 사용하기

```typescript
function getUserInfo(userId: UserId) {
  // 이 함수는 오직 UserId만 받을 수 있음
  console.log(`사용자 정보 조회: ${userId}`)
}

const myId = createUserId("user_456")
if (myId) {
  getUserInfo(myId)  // ✅ 안전하게 사용
}

// getUserInfo("just_string")  // ❌ 에러! 일반 문자열은 안됨
```

## 🎮 재미있는 예시: 게임 아이템

```typescript
// 게임에서 여러 종류의 ID들
type PlayerId = string & { __brand: unique symbol }
type ItemId = string & { __brand: unique symbol }
type GuildId = string & { __brand: unique symbol }

// 안전한 생성 함수들
function createPlayerId(name: string): PlayerId {
  return `player_${name}` as PlayerId
}

function createItemId(name: string): ItemId {
  return `item_${name}` as ItemId
}

// 게임 함수들
function giveItemToPlayer(playerId: PlayerId, itemId: ItemId) {
  console.log(`${playerId}에게 ${itemId} 아이템 지급`)
}

function kickPlayerFromGuild(guildId: GuildId, playerId: PlayerId) {
  console.log(`${guildId}에서 ${playerId} 추방`)
}

// 사용
const 철수 = createPlayerId("철수")
const 검 = createItemId("검")

giveItemToPlayer(철수, 검)  // ✅ 정상
// giveItemToPlayer(검, 철수)  // ❌ 에러! 순서 바뀜
```

## ✨ 정리: 브랜드 타입은 실수 방지 도구

**브랜드 타입 = 같은 타입에 보이지 않는 특별한 스티커 붙여서 구분하는 기술**

**핵심 원리:**

- 🎭 **TypeScript 시간**: 특별한 스티커로 구분 (실수 방지)
- 🏃 **실행 시간**: 스티커 사라짐, 원래 값만 남음 (빠른 속도)
- 🔧 **`unique symbol`**: 절대 겹치지 않는 특별한 스티커 번호

**장점:**

- 🛡️ 실수 방지 (잘못된 값 전달 차단)
- 📝 코드 의미 명확화 (이게 뭘 위한 문자열인지 알 수 있음)
- 🔍 IDE가 도움 (자동완성과 에러 표시)
- ⚡ 빠른 속도 (실행시 오버헤드 없음)

**언제 사용하면 좋을까?**

- ID들이 많을 때 (사용자ID, 상품ID, 주문ID...)
- 단위가 중요할 때 (원화, 달러, 킬로미터, 마일...)
- 실수하면 큰일날 때 (이메일, 전화번호, 비밀번호...)

브랜드 타입은 TypeScript의 **"보이지 않는 실수 방지 마법"** 이라고 생각하면 됩니다! ✨
