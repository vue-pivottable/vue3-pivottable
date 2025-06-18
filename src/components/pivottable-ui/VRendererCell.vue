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

<script setup>
import { computed, useSlots } from 'vue'
import VDropdown from './VDropdown.vue'

const slots = useSlots()
const rendererOptions = computed(() => Object.keys(props.rendererItems))
const props = defineProps({
  rendererName: {
    type: String,
    default: ''
  },
  rendererItems: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:rendererName'])
const updateRendererName = (value) => emit('update:rendererName', value)
</script>
