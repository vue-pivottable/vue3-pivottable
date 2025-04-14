// composables/useTableRenderer.js
import { ref, computed } from 'vue'
import { redColorScaleGenerator } from '../helper/utilities.js'

export function useTableRenderer (options) {
  // 기존 redColorScaleGenerator 및 관련 함수 래핑

  // 히트맵 로직
  const getColorScaleGenerator = (values) => {
    return options.tableColorScaleGenerator || redColorScaleGenerator(values)
  }

  // 기타 렌더러 관련 함수

  return {
    getColorScaleGenerator
    // 기타 필요한 함수 및 상태
  }
}
