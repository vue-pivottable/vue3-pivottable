<template>
  <td
    class="pvtRenderers"
    :class="{ pvtVals: slots.rendererCell, pvtText: slots.rendererCell }"
  >
    <slot name="rendererCell">
      <VDropdown
        :options="rendererOptions"
        :value="rendererName"
        @update:value="updateRendererName"
      />
    </slot>
  </td>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import VDropdown from './VDropdown.vue'
import type { VNode } from 'vue'

const slots = useSlots()
const rendererOptions = computed<string[]>(() =>
  Object.keys(props.rendererItems)
)

interface RendererDefinition {
  name: string
  props: Record<string, any>
  setup: (props: any) => () => VNode
}

interface RendererCellProps {
  rendererName: string
  rendererItems: Record<string, RendererDefinition>
}

const props = withDefaults(defineProps<RendererCellProps>(), {
  rendererName: '',
  rendererItems: () => ({})
})
const emit = defineEmits<{
  (event: 'update:rendererName', value: string): void
}>()

const updateRendererName = (value: string): void => {
  emit('update:rendererName', value)
}
</script>
