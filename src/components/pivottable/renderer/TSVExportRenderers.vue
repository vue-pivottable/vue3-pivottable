<template>
  <textarea
    :style="styles"
    :value="textareaValue"
    readonly
  ></textarea>
</template>

<script setup>
import { defaultProps, PivotData } from '@/helper'
import { computed } from 'vue'

const props = defineProps({
  ...defaultProps
})

const pivotData = computed(() => {
  try {
    return new PivotData(props)
  } catch (err) {
    console.error(err.stack)
    return null
  }
})

const rowKeys = computed(() => pivotData.value?.getRowKeys() || [])
const colKeys = computed(() => pivotData.value?.getColKeys() || [])

const styles = {
  width: '100%',
  height: `${window.innerHeight / 2}px`
}

const headerRow = computed(() => {
  const header = [...pivotData.value.props.rows]

  if (colKeys.value.length === 1 && colKeys.value[0].length === 0) {
    header.push(props.aggregatorName)
  } else {
    colKeys.value.forEach((c) => header.push(c.join('-')))
  }

  return header
})

const result = computed(() => {
  const data = rowKeys.value.reduce((acc, r) => {
    const row = [...r]
    colKeys.value.forEach((c) =>
      row.push(pivotData.value.getAggregator(r, c).value() || '')
    )
    return [...acc, row]
  }, [])
  return [headerRow.value, ...data]
})

const textareaValue = computed(() =>
  result.value.map((r) => r.join('\t')).join('\n')
)
</script>

<style lang="scss" scoped></style>
