<template>
  <tbody
    v-if="pivotData"
    ref="tableBody"
  >
    <tr
      v-if="topPaddingHeight > 0"
      class="chunk-padding-row"
    >
      <td
        :colspan="totalColumns"
        :style="`height: ${topPaddingHeight}px;`"
      >
        Loading...
      </td>
    </tr>

    <template
      v-for="chunk in visibleChunks"
      :key="`chunk-${chunk.index}`"
    >
      <tr
        v-for="(rowKey, rowIndex) in chunk.data"
        :key="`row-${chunk.index}-${rowIndex}`"
        :ref="(el) => registerRowRef(`${chunk.index}-${rowIndex}`, el)"
      >
        <template
          v-for="(text, j) in rowKey"
          :key="`label-${j}`"
        >
          <th
            v-if="
              shouldRenderCell(
                rowKeys,
                getGlobalRowIndex(chunk.index, rowIndex),
                j
              )
            "
            class="pvtRowLabel"
            :rowSpan="
              calculateRowSpan(
                rowKeys,
                getGlobalRowIndex(chunk.index, rowIndex),
                j
              )
            "
            :colSpan="
              j === rowAttrs.length - 1 && colAttrs.length !== 0 ? 2 : 1
            "
          >
            {{ text }}
          </th>
        </template>
        <td
          v-for="(colKey, j) in colKeys"
          :key="`val-${j}`"
          class="pvVal"
          :style="getValueCellStyle(rowKey, colKey)"
          @click="
            handleCellClick(
              getAggregator(rowKey, colKey).value(),
              rowKey,
              colKey
            )
          "
        >
          {{
            getAggregator(rowKey, colKey).format(
              getAggregator(rowKey, colKey).value()
            )
          }}
        </td>
        <td
          v-if="rowTotal"
          class="pvtTotal"
          :style="getRowTotalStyle(rowKey)"
          @click="
            handleCellClick(getAggregator(rowKey, []).value(), rowKey, [])
          "
        >
          {{
            getAggregator(rowKey, []).format(getAggregator(rowKey, []).value())
          }}
        </td>
      </tr>
    </template>

    <tr
      v-if="bottomPaddingHeight > 0"
      class="chunk-padding-row"
    >
      <td
        :colspan="totalColumns"
        :style="`height: ${bottomPaddingHeight}px; position:relative`"
      >
        <slot name="lazy-loader">
          <div style="position: absolute; top: 0; left: 0">Loading...</div>
        </slot>
      </td>
    </tr>

    <VPivottableBodyRowsTotalRow
      v-if="colTotal"
      :col-total="colTotal"
      :row-total="rowTotal"
      :locale-strings="localeStrings"
      :table-options="tableOptions"
    />
  </tbody>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useProvidePivotData } from 'vue-pivottable'
import VPivottableBodyRowsTotalRow from './VPivottableBodyRowsTotalRow.vue'

const props = defineProps({
  rowTotal: {
    type: Boolean,
    required: true
  },
  colTotal: {
    type: Boolean,
    required: true
  },
  tableOptions: {
    type: Object,
    required: true
  },
  chunkSize: {
    type: Number,
    default: 20
  },
  localeStrings: {
    type: Object,
    default: () => ({
      totals: 'Totals'
    })
  },
  bufferSize: {
    type: Number,
    default: 1
  }
})

const {
  pivotData,
  rowKeys,
  colKeys,
  valueCellColors,
  colTotalColors,
  rowAttrs,
  colAttrs,
  getAggregator,
  spanSize
} = useProvidePivotData()

const tableBody = ref(null)
const rowRefs = ref({})
const visibleChunkIndices = ref([])
const topPaddingHeight = ref(0)
const bottomPaddingHeight = ref(0)
const averageRowHeight = ref(30)
let observer = null

const registerRowRef = (key, el) => {
  if (el) rowRefs.value[key] = el
}

const allChunks = computed(() => {
  if (!rowKeys.value || rowKeys.value.length === 0) return []

  const result = []
  for (let i = 0; i < rowKeys.value.length; i += props.chunkSize) {
    result.push({
      index: Math.floor(i / props.chunkSize),
      start: i,
      end: Math.min(i + props.chunkSize - 1, rowKeys.value.length - 1),
      data: rowKeys.value.slice(i, i + props.chunkSize)
    })
  }
  return result
})

const visibleChunks = computed(() => {
  return visibleChunkIndices.value
    .map((index) => allChunks.value.find((chunk) => chunk.index === index))
    .filter((chunk) => chunk)
})

const totalColumns = computed(() => {
  return (
    (rowAttrs.value?.length || 0) +
    (colKeys.value?.length || 0) +
    (props.rowTotal ? 1 : 0)
  )
})

const getGlobalRowIndex = (chunkIndex, rowIndex) => {
  return chunkIndex * props.chunkSize + rowIndex
}

const shouldRenderCell = (arr, i, j) => {
  if (i === 0) return true

  for (let x = 0; x <= j; x++) {
    if (arr[i - 1][x] !== arr[i][x]) {
      return true
    }
  }

  return false
}

const calculateRowSpan = (arr, i, j) => {
  const originalSpan = spanSize(arr, i, j)
  if (originalSpan === -1) return -1

  return originalSpan
}

const getValueCellStyle = (rowKey, colKey) => {
  const value = getAggregator(rowKey, colKey).value()
  return valueCellColors(rowKey, colKey, value)
}

const getRowTotalStyle = (rowKey) => {
  const value = getAggregator(rowKey, []).value()
  return colTotalColors(value)
}

const handleCellClick = (value, rowValues, colValues) => {
  if (props.tableOptions?.clickCallback) {
    const filters = {}

    colAttrs.value.forEach((attr, i) => {
      if (colValues[i] !== undefined && colValues[i] !== null) {
        filters[attr] = colValues[i]
      }
    })

    rowAttrs.value.forEach((attr, i) => {
      if (rowValues[i] !== undefined && rowValues[i] !== null) {
        filters[attr] = rowValues[i]
      }
    })

    props.tableOptions.clickCallback(event, value, filters, pivotData.value)
  }
}

const updatePaddingHeights = () => {
  if (visibleChunkIndices.value.length === 0) return

  const firstVisibleChunkIndex = Math.min(...visibleChunkIndices.value)
  const lastVisibleChunkIndex = Math.max(...visibleChunkIndices.value)

  topPaddingHeight.value =
    firstVisibleChunkIndex * props.chunkSize * averageRowHeight.value

  const remainingChunks = allChunks.value.length - lastVisibleChunkIndex - 1
  bottomPaddingHeight.value = Math.max(
    0,
    remainingChunks * props.chunkSize * averageRowHeight.value
  )
}

const createObserverTargets = () => {
  if (!tableBody.value) return

  const existingSentinels = tableBody.value.querySelectorAll(
    '[id^="chunk-sentinel-"]'
  )
  existingSentinels.forEach((el) => el.remove())

  allChunks.value.forEach((chunk) => {
    const sentinel = document.createElement('div')
    sentinel.id = `chunk-sentinel-${chunk.index}`
    sentinel.dataset.chunkIndex = chunk.index.toString()
    sentinel.style.position = 'absolute'
    sentinel.style.left = '0'
    sentinel.style.height = '20px'
    sentinel.style.width = '100%'
    sentinel.style.pointerEvents = 'none'
    sentinel.style.zIndex = '-1'

    sentinel.style.top = `${
      chunk.index * props.chunkSize * averageRowHeight.value
    }px`

    tableBody.value.appendChild(sentinel)

    if (observer) {
      observer.observe(sentinel)
    }
  })
}

const updateVisibleChunks = (entries) => {
  let hasChanges = false

  entries.forEach((entry) => {
    const chunkIndex = parseInt(entry.target.dataset.chunkIndex)

    if (entry.isIntersecting) {
      if (!visibleChunkIndices.value.includes(chunkIndex)) {
        hasChanges = true

        for (let i = -props.bufferSize; i <= props.bufferSize; i++) {
          const bufferChunkIndex = chunkIndex + i
          if (
            bufferChunkIndex >= 0 &&
            bufferChunkIndex < allChunks.value.length &&
            !visibleChunkIndices.value.includes(bufferChunkIndex)
          ) {
            visibleChunkIndices.value.push(bufferChunkIndex)
          }
        }
      }
    } else {
      let shouldKeep = false
      for (const visibleIndex of visibleChunkIndices.value) {
        if (Math.abs(visibleIndex - chunkIndex) <= props.bufferSize) {
          shouldKeep = true
          break
        }
      }

      if (!shouldKeep && visibleChunkIndices.value.includes(chunkIndex)) {
        hasChanges = true
        visibleChunkIndices.value = visibleChunkIndices.value.filter(
          (index) => index !== chunkIndex
        )
      }
    }
  })

  if (hasChanges) {
    visibleChunkIndices.value.sort((a, b) => a - b)
    updatePaddingHeights()
  }
}

const updateAverageRowHeight = () => {
  if (Object.keys(rowRefs.value).length === 0) return

  let totalHeight = 0
  let count = 0

  for (const key in rowRefs.value) {
    const el = rowRefs.value[key]
    if (el && el.offsetHeight) {
      totalHeight += el.offsetHeight
      count++
    }
  }

  if (count > 0) {
    averageRowHeight.value = totalHeight / count

    const sentinels = tableBody.value?.querySelectorAll(
      '[id^="chunk-sentinel-"]'
    )
    if (sentinels && sentinels.length) {
      sentinels.forEach((sentinel) => {
        const chunkIdx = parseInt(sentinel.dataset.chunkIndex)
        sentinel.style.top = `${
          chunkIdx * props.chunkSize * averageRowHeight.value
        }px`
      })
    }

    updatePaddingHeights()
  }
}

onMounted(() => {
  for (let i = 0; i < Math.min(2, allChunks.value.length); i++) {
    visibleChunkIndices.value.push(i)
  }

  updatePaddingHeights()

  nextTick(() => {
    const options = {
      root: null,
      rootMargin: '200px 0px',
      threshold: 0.1
    }

    observer = new IntersectionObserver(updateVisibleChunks, options)
    createObserverTargets()

    setTimeout(updateAverageRowHeight, 300)
  })

  const updateInterval = setInterval(() => {
    updateAverageRowHeight()

    if (
      tableBody.value &&
      allChunks.value.length > 0 &&
      tableBody.value.querySelectorAll('[id^="chunk-sentinel-"]').length !==
        allChunks.value.length
    ) {
      createObserverTargets()
    }
  }, 1000)

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    clearInterval(updateInterval)
  })
})

watch(
  () => allChunks.value.length,
  (newLength, oldLength) => {
    if (newLength !== oldLength && observer && tableBody.value) {
      nextTick(() => {
        createObserverTargets()

        if (visibleChunkIndices.value.length === 0) {
          for (let i = 0; i < Math.min(2, newLength); i++) {
            visibleChunkIndices.value.push(i)
          }
          updatePaddingHeights()
        }
      })
    }
  }
)

watch(visibleChunkIndices, () => {
  updatePaddingHeights()
})
</script>

<style scoped>
.chunk-padding-row {
  border: none;
  padding: 0;
}

.chunk-padding-row td {
  border: none;
  padding: 0;
  background-color: transparent !important;
}
</style>
