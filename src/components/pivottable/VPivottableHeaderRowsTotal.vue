<template>
  <th
    class="pvtTotalLabel"
    :rowSpan="colAttrsLength + (rowAttrsLength === 0 ? 0 : 1)"
  >
    {{ languagePack.totals }}
  </th>
</template>

<script setup lang="ts">
import { DefaultPropsType } from '@/types'

type VPivottableHeaderRowsTotalProps = Pick<
  DefaultPropsType,
  'languagePack'
> & {
  colAttrsLength: number
  rowAttrsLength: number
}

defineProps<VPivottableHeaderRowsTotalProps>()
</script>
