import { defineComponent, h, markRaw } from 'vue'
import LazePivottableRenderer from './LazePivottableRenderer.vue'
import { PivotUtilities } from 'vue-pivottable'

export default markRaw({
  'Lazy Table': defineComponent({
    name: 'vue-laze-table',
    setup(props) {
      return () =>
        h(LazePivottableRenderer, {
          ...PivotUtilities.defaultProps,
          ...props,
          chunkSize: 50,
          bufferSize: 1
        })
    }
  })
})
