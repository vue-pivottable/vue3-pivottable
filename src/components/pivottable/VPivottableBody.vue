<template>
  <tbody v-if="pivotData">
    <VPivottableBodyRows
      :row-keys="rowKeys"
      :col-keys="colKeys"
      :show-row-total="showRowTotal"
      :table-options="tableOptions"
    />
    <VPivottableBodyRowsTotalRow
      :show-col-total="showColTotal"
      :show-row-total="showRowTotal"
      :row-attrs="rowAttrs"
      :col-attrs="colAttrs"
      :col-keys="colKeys"
      :language-pack="languagePack"
      :table-options="tableOptions"
    />
  </tbody>
</template>

<script setup lang="ts">
import { useProvidePivotData } from '@/composables/useProvidePivotData'
import VPivottableBodyRows from './VPivottableBodyRows.vue'
import VPivottableBodyRowsTotalRow from './VPivottableBodyRowsTotalRow.vue'
import type { DefaultPropsType } from '@/types'

type Props = Pick<DefaultPropsType, 'showRowTotal' | 'showColTotal' | 'languagePack' | 'tableOptions'>

defineProps<Props>()

const { pivotData, rowKeys, colKeys, rowAttrs, colAttrs } =
  useProvidePivotData()
</script>
