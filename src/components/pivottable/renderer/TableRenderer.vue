<template>
  <table class="pvtTable">
    <VPivottableHeader
      :show-row-total="props.showRowTotal"
      :language-pack="props.languagePack"
    />
    <VPivottableBody
      :show-row-total="props.showRowTotal"
      :show-col-total="props.showColTotal"
      :language-pack="props.languagePack"
      :table-options="props.tableOptions"
    />
  </table>
</template>

<script setup lang="ts">
import { providePivotData } from '@/composables'
import VPivottableHeader from '../VPivottableHeader.vue'
import VPivottableBody from '../VPivottableBody.vue'
import { DefaultPropsType } from '@/types'
import { redColorScaleGenerator } from '@/helper'

const props = withDefaults(defineProps<DefaultPropsType>(), {
  tableColorScaleGenerator: (value: number[]) => redColorScaleGenerator(value)
})

providePivotData(props)
</script>
