import { defineComponent, h, markRaw } from 'vue'
import TableRenderer from './TableRenderer.vue'
import { defaultProps } from '@/helper'

export default markRaw({
  'Table': defineComponent({
    name: 'vue-table',
    setup(props) {
      return () =>
        h(TableRenderer, {
          ...defaultProps,
          ...props
        })
    }
  }),
  'Table Heatmap': defineComponent({
    name: 'vue-table-heatmap',
    setup(props) {
      return () =>
        h(TableRenderer, {
          ...defaultProps,
          ...props,
          heatmapMode: 'full'
        })
    }
  }),
  'Table Col Heatmap': defineComponent({
    name: 'vue-table-col-heatmap',
    setup(props) {
      return () =>
        h(TableRenderer, {
          ...defaultProps,
          ...props,
          heatmapMode: 'col'
        })
    }
  }),
  'Table Row Heatmap': defineComponent({
    name: 'vue-table-row-heatmap',
    setup(props) {
      return () =>
        h(TableRenderer, {
          ...defaultProps,
          ...props,
          heatmapMode: 'row'
        })
    }
  })
})
