import { ref, watch } from 'vue'
import { PivotData } from '@/helper/utilities.js'

export function useMaterializeInput(dataSource, options) {
  const rawData = ref(null)
  const allFilters = ref({})
  const materializedInput = ref([])

  function processData(data) {
    if (!data || rawData.value === data) return

    rawData.value = data
    const newAllFilters = {}
    const newMaterializedInput = []

    let recordsProcessed = 0

    PivotData.forEachRecord(
      data,
      options.derivedAttributes.value,
      function (record) {
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

  return {
    rawData,
    allFilters,
    materializedInput,
    processData
  }
}
