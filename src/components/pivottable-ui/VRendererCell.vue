<template>
  <td
    class="pvtRenderers"
    :class="{ 'pvtVals pvtText': slots.rendererCell }"
  >
    <slot
      v-if="slots.rendererCell"
      name="rendererCell"
    >
    </slot>
    <VDropdown
      v-else
      :options="rendererOptions"
      :value="rendererName"
      @update:value="updateRendererName"
    >
    </VDropdown>
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
