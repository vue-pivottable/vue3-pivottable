<template>
  <tr>
    <th
      v-for="(r, i) in rowAttrs"
      :key="`rowAttr${i}`"
      class="pvtAxisLabel"
    >
      {{ r }}
    </th>
    <th
      class="pvtTotalLabel"
      v-if="showRowTotal || colAttrsLength !== 0"
    >
      {{ colAttrsLength === 0 && showRowTotal ? languagePack.totals : null }}
    </th>
  </tr>
</template>

<script setup lang="ts">
import { DefaultPropsType } from '@/types'

type VPivottableHeaderRowsProps = Pick<
  DefaultPropsType,
  'showRowTotal' | 'languagePack'
> & {
  rowAttrs: any[]
  colAttrsLength: number
}

defineProps<VPivottableHeaderRowsProps>()
</script>
