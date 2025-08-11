import { Ref, ref, watch, markRaw } from 'vue'
import { PivotData } from '@/helper'

export interface UseMaterializeInputOptions {
  derivedAttributes: Ref<Record<string, (record: Record<string, any>) => any>>
}

export interface UseMaterializeInputReturn {
  rawData: Ref<any>
  allFilters: Ref<Record<string, Record<string, number>>>
  materializedInput: Ref<any[]>
  processData: (data: any) => { AllFilters: Record<string, Record<string, number>>; materializedInput: any[] } | void
}

export function useMaterializeInput (
  dataSource: Ref<any>,
  options: UseMaterializeInputOptions
): UseMaterializeInputReturn {
  const rawData = ref<any>(null)
  const allFilters = ref<Record<string, Record<string, number>>>({})
  const materializedInput = ref<any[]>([])

  function processData (data: any) {
    if (!data || rawData.value === data) return

    rawData.value = data
    const newAllFilters: Record<string, Record<string, number>> = {}
    const newMaterializedInput: any[] = []

    let recordsProcessed = 0

    PivotData.forEachRecord(
      data,
      options.derivedAttributes.value,
      function (record: Record<string, any>) {
        newMaterializedInput.push(record)

        for (const attr of Object.keys(record)) {
          if (!(attr in newAllFilters)) {
            newAllFilters[attr] = {}
            if (recordsProcessed > 0) {
              newAllFilters[attr].null = recordsProcessed
            }
          }
        }

        for (const attr in newAllFilters) {
          const value = attr in record ? record[attr] : 'null'
          if (!(value in newAllFilters[attr])) {
            newAllFilters[attr][value] = 0
          }
          newAllFilters[attr][value]++
        }

        recordsProcessed++
      }
    )

    allFilters.value = newAllFilters
    materializedInput.value = markRaw(newMaterializedInput) // Prevent reactivity on large arrays

    return {
      AllFilters: newAllFilters,
      materializedInput: newMaterializedInput
    }
  }

  watch(() => dataSource.value, processData, { immediate: true })

  watch(
    () => options.derivedAttributes.value,
    () => {
      processData(dataSource.value)
    }
  )

  return {
    rawData,
    allFilters,
    materializedInput,
    processData
  }
} 