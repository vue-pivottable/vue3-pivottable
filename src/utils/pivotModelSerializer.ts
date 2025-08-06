import { PivotModelInterface } from '@/types'
import { createPivotModel } from './pivotModel'

/**
 * PivotModel 직렬화/역직렬화 유틸리티 클래스
 */
export class PivotModelSerializer {
  /**
   * PivotModel을 JSON 문자열로 직렬화
   */
  static serialize(model: PivotModelInterface): string {
    return JSON.stringify(model)
  }

  /**
   * JSON 문자열을 PivotModel로 역직렬화
   */
  static deserialize(json: string): PivotModelInterface {
    try {
      const parsed = JSON.parse(json)
      return createPivotModel(parsed)
    } catch (error) {
      console.error('Failed to deserialize PivotModel:', error)
      return createPivotModel()
    }
  }

  /**
   * PivotModel을 URL 파라미터로 변환
   */
  static toUrlParams(model: PivotModelInterface): URLSearchParams {
    const params = new URLSearchParams()
    
    // 배열 필드들
    if (model.rows.length > 0) {
      params.set('rows', model.rows.join(','))
    }
    if (model.cols.length > 0) {
      params.set('cols', model.cols.join(','))
    }
    if (model.vals.length > 0) {
      params.set('vals', model.vals.join(','))
    }
    
    // 문자열 필드들
    params.set('aggregatorName', model.aggregatorName)
    params.set('rendererName', model.rendererName)
    params.set('rowOrder', model.rowOrder)
    params.set('colOrder', model.colOrder)
    
    if (model.heatmapMode) {
      params.set('heatmapMode', model.heatmapMode)
    }
    
    // valueFilter는 JSON으로 인코딩
    if (Object.keys(model.valueFilter).length > 0) {
      params.set('valueFilter', JSON.stringify(model.valueFilter))
    }
    
    return params
  }

  /**
   * URL 파라미터에서 PivotModel로 변환
   */
  static fromUrlParams(params: URLSearchParams): Partial<PivotModelInterface> {
    const model: Partial<PivotModelInterface> = {}
    
    // 배열 필드들
    const rows = params.get('rows')
    if (rows) {
      model.rows = rows.split(',').filter(Boolean)
    }
    
    const cols = params.get('cols')
    if (cols) {
      model.cols = cols.split(',').filter(Boolean)
    }
    
    const vals = params.get('vals')
    if (vals) {
      model.vals = vals.split(',').filter(Boolean)
    }
    
    // 문자열 필드들
    const aggregatorName = params.get('aggregatorName')
    if (aggregatorName) {
      model.aggregatorName = aggregatorName
    }
    
    const rendererName = params.get('rendererName')
    if (rendererName) {
      model.rendererName = rendererName
    }
    
    const rowOrder = params.get('rowOrder')
    if (rowOrder) {
      model.rowOrder = rowOrder as PivotModelInterface['rowOrder']
    }
    
    const colOrder = params.get('colOrder')
    if (colOrder) {
      model.colOrder = colOrder as PivotModelInterface['colOrder']
    }
    
    const heatmapMode = params.get('heatmapMode')
    if (heatmapMode) {
      model.heatmapMode = heatmapMode as PivotModelInterface['heatmapMode']
    }
    
    // valueFilter 파싱
    const valueFilter = params.get('valueFilter')
    if (valueFilter) {
      try {
        model.valueFilter = JSON.parse(valueFilter)
      } catch (error) {
        console.error('Failed to parse valueFilter:', error)
      }
    }
    
    return model
  }

  /**
   * PivotModel을 로컬스토리지에 저장
   */
  static saveToLocalStorage(key: string, model: PivotModelInterface): void {
    try {
      localStorage.setItem(key, this.serialize(model))
    } catch (error) {
      console.error('Failed to save PivotModel to localStorage:', error)
    }
  }

  /**
   * 로컬스토리지에서 PivotModel 로드
   */
  static loadFromLocalStorage(key: string): PivotModelInterface | null {
    try {
      const json = localStorage.getItem(key)
      if (json) {
        return this.deserialize(json)
      }
    } catch (error) {
      console.error('Failed to load PivotModel from localStorage:', error)
    }
    return null
  }

  /**
   * PivotModel을 Base64로 인코딩
   */
  static toBase64(model: PivotModelInterface): string {
    const json = this.serialize(model)
    return btoa(encodeURIComponent(json))
  }

  /**
   * Base64에서 PivotModel로 디코딩
   */
  static fromBase64(base64: string): PivotModelInterface {
    try {
      const json = decodeURIComponent(atob(base64))
      return this.deserialize(json)
    } catch (error) {
      console.error('Failed to decode PivotModel from Base64:', error)
      return createPivotModel()
    }
  }
}