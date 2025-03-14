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
      :values="Object.keys(rendererItems)"
      :value="rendererName"
      @input="emitPropUpdater"
    >
    </VDropdown>
  </td>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import TableRenderer from './TableRenderer'
import VDropdown from './VDropdown'
import defaultProps from '../../helper/defaultProps'

const slots = useSlots()

const props = defineProps({
  rendererName: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:propUpdater'])
const emitPropUpdater = (e) => {
  emit('update:propUpdater', { key: 'rendererName', value: e.target.value })
  emit('update:propUpdater', { key: 'renderer', value: rendererItems[props.rendererName] })
}
const rendererItems = computed(() => (defaultProps.renderers) || Object.assign({}, TableRenderer))
</script>

// TableRenderer 받아서 사용
// defaultProps.renderers 받아서 사용
// Object.keys(rendererItems) -> computed로 사용
// chat gpt -> class computed?, slots.rendererCell, Object.keys(rendererItems)
