/**
 * 성능 최적화를 위한 유틸리티 함수들
 */

/**
 * 함수 호출을 지연시키는 debounce 함수
 * @param func 실행할 함수
 * @param delay 지연 시간 (밀리초)
 * @returns debounced 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = function (this: any, ...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
      timeoutId = null
    }, delay)
  } as T

  // cancel 메서드 추가
  ;(debounced as any).cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced as T & { cancel: () => void }
}

/**
 * 두 배열이 동일한지 비교 (shallow)
 */
export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/**
 * 두 객체가 동일한지 비교 (deep)
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  
  if (a == null || b == null) return false
  
  if (typeof a !== 'object' || typeof b !== 'object') return false
  
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  
  if (keysA.length !== keysB.length) return false
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!isEqual(a[key], b[key])) return false
  }
  
  return true
}