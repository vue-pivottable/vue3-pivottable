import { defineComponent, h, markRaw } from 'vue'
import LazyPivottableRenderer from './LazyPivottableRenderer.vue'
import { PivotUtilities } from 'vue-pivottable'

export default markRaw({
  'Lazy Table': defineComponent({
    name: 'vue-lazy-table',
    setup(props) {
      return () =>
        h(LazyPivottableRenderer, {
          ...PivotUtilities.defaultProps,
          ...props,
          chunkSize: 50,
          bufferSize: 1
        })
    }
  })
})
