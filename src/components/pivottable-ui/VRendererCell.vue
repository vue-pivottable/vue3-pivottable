<template>
    <template>
        <td
            v-if="this.$slots.rendererCell"
            class="pvtRenderers pvtVals pvtText"
        >
            <slot name="rendererCell"></slot>
        </td>
        <td
            v-else
            class="pvtRenderers"
        >
            <VDropdown
                :values="Object.keys(rendererItems)"
                :value="rendererName"
                @input="emitPropUpdater($event)"
            >
            </VDropdown>
        </td>
    </template>
    <td>

    </td>
</template>

<script setup>
import { computed } from 'vue'
import TableRenderer from './TableRenderer'
import VDropdown from './VDropdown'
import defaultProps from '../../helper/defaultProps'

const props = defineProps({
  rendererName: {
    type: String,
    default: ''
  }
})
const emitPropUpdater = (e) => {
  // this.propUpdater('rendererName')(value)
  // this.propUpdater('renderer')(rendererItems[props.rendererName])
  this.$emit('propUpdater', { key: 'rendererName', value: e.target.value })
  this.$emit('propUpdater', { key: 'renderer', value: rendererItems[props.rendererName] })
}
const rendererItems = computed(() => (defaultProps.renderers) || Object.assign({}, TableRenderer))
</script>

// props: rendererName
// emit : propUpdater
// TableRenderer 호출 파일 확인
// defaultProps 경로 확인
// slot 방식 확인