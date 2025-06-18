<template>
  <textarea
    :style="styles"
    :value="textareaValue"
    readonly
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePivotData } from '@/composables'
import { DefaultPropsType } from '@/types'

const props = defineProps<DefaultPropsType>()
const { pivotData, error } = usePivotData(props)

const rowKeys = computed(() => pivotData.value?.getRowKeys() || [])
const colKeys = computed(() => pivotData.value?.getColKeys() || [])

const styles = {
  width: '100%',
  height: `${window.innerHeight / 2}px`
}

const headerRow = computed(() => {
  if (error.value || !pivotData.value) return []
  const header = [...pivotData.value.props.rows]

  if (colKeys.value.length === 1 && colKeys.value[0].length === 0) {
    header.push(props.aggregatorName)
  } else {
    colKeys.value.forEach((c: any[]) => header.push(c.join('-')))
  }

  return header
})

const result = computed(() => {
  if (error.value || !pivotData.value) return []

  const data = rowKeys.value.reduce((acc: any[], r: any[]) => {
    const row = [...r]
    colKeys.value.forEach((c: any[]) =>
      row.push(pivotData.value?.getAggregator(r, c).value() || '')
    )
    return [...acc, row]
  }, [])
  return [headerRow.value, ...data]
})

const textareaValue = computed(() =>
  result.value.map((r) => r.join('\t')).join('\n')
)
</script>
