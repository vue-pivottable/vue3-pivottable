import { defineComponent, h, markRaw } from 'vue'
import LazyPivottableRenderer from './LazyPivottableRenderer.vue'
import { PivotUtilities } from 'vue-pivottable'

export default markRaw({
  'Lazy Table': defineComponent({
    name: 'vue-lazy-table',
    props: { ...PivotUtilities.defaultProps },
    setup(props) {
      return () =>
        h(LazyPivottableRenderer, {
          ...props,
          chunkSize: 50,
          bufferSize: 1
        })
    }
  })
})
