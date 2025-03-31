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
      :values="rendererItemKeys"
      :value="rendererName"
      @update:value="emitPropUpdater"
    >
    </VDropdown>
  </td>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import VDropdown from './VDropdown.vue'

const slots = useSlots()

const props = defineProps({
  rendererName: {
    type: String,
    default: ''
  },
  tableRenderer: {
    type: Object,
    default: () => {}
  },
  renderers: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['update:propUpdater'])
const emitPropUpdater = (e) => {
  emit('update:propUpdater', { key: 'rendererName', value: '' })
  emit('update:propUpdater', { key: 'renderer', value: rendererItems[props.rendererName] })
}
const rendererItems = computed(() => (props.renderers) || Object.assign({}, props.tableRenderer))
const rendererItemKeys = computed(() => Object.keys(rendererItems))
</script>

// TableRenderer 받아서 사용
// defaultProps.renderers 받아서 사용
// Object.keys(rendererItems) -> computed로 사용
// chat gpt -> class computed?, slots.rendererCell, Object.keys(rendererItems)
