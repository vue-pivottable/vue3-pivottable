<template>
  <thead>
    <tr
      v-for="(c, j) in colAttrs"
      :key="`colAttrs${j}`"
    >
      <th
        v-if="j === 0 && rowAttrs.length !== 0"
        :colSpan="rowAttrs.length"
        :rowSpan="colAttrs.length"
      />
      <th class="pvtAxisLabel">
        {{ c }}
      </th>
      <VPivottableHeaderColumns
        :col-keys="colKeys"
        :col-index="j"
        :col-attrs-length="colAttrs.length"
        :row-attrs-length="rowAttrs.length"
      />
      <VPivottableHeaderRowsTotal
        v-if="j === 0 && showRowTotal"
        :col-attrs-length="colAttrs.length"
        :row-attrs-length="rowAttrs.length"
        :language-pack="languagePack"
      />
    </tr>
    <VPivottableHeaderRows
      v-if="rowAttrs.length !== 0"
      :row-attrs="rowAttrs"
      :show-row-total="showRowTotal"
      :col-attrs-length="colAttrs.length"
      :language-pack="languagePack"
    />
  </thead>
</template>

<script setup lang="ts">
import { useProvidePivotData } from '@/composables'
import VPivottableHeaderColumns from './VPivottableHeaderColumns.vue'
import VPivottableHeaderRows from './VPivottableHeaderRows.vue'
import VPivottableHeaderRowsTotal from './VPivottableHeaderRowsTotal.vue'
import type { DefaultPropsType } from '@/types'

type Props = Pick<DefaultPropsType, 'showRowTotal' | 'languagePack'>

defineProps<Props>()

const { colAttrs, rowAttrs, colKeys } = useProvidePivotData()
</script>
