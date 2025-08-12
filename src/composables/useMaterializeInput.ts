import { Ref, ref, watch, shallowRef, ShallowRef, onUnmounted } from 'vue'
import { PivotData } from '@/helper'

export interface UseMaterializeInputOptions {
  derivedAttributes: Ref<Record<string, (record: Record<string, any>) => any>>
}

export interface UseMaterializeInputReturn {
  rawData: Ref<any>
  allFilters: ShallowRef<Record<string, Record<string, number>>>
  materializedInput: ShallowRef<any[]>
  processData: (data: any) => { AllFilters: Record<string, Record<string, number>>; materializedInput: any[] } | void
}

export function useMaterializeInput (
  dataSource: Ref<any>,
  options: UseMaterializeInputOptions
): UseMaterializeInputReturn {
  const rawData = ref<any>(null)
  // Use shallowRef to prevent deep reactivity on large objects
  const allFilters = shallowRef<Record<string, Record<string, number>>>({})
  const materializedInput = shallowRef<any[]>([])

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
    materializedInput.value = newMaterializedInput

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

  onUnmounted(() => {
    allFilters.value = {}
    materializedInput.value = []
    rawData.value = null
  })

  return {
    rawData,
    allFilters,
    materializedInput,
    processData
  }
} 