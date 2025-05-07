import { h, markRaw } from 'vue'
import TableRenderer from './TableRenderer.vue'
import TSVExportRenderers from './TSVExportRenderers.vue'
import { defaultProps } from '@/helper'

// 컴포넌트 팩토리 함수 생성 - defineComponent 사용하지 않음
const tableComponents = markRaw({
  'Table': {
    name: 'VueTable',
    setup(props) {
      return () =>
        h(TableRenderer, {
          ...defaultProps,
          ...props
        })
    }
  },
  'Table Heatmap': {
    name: 'VueTableHeatmap',
    setup(props) {
      return () =>
        h(TableRenderer, {
          ...defaultProps,
          ...props,
          heatmapMode: 'full'
        })
    }
  },
  'Table Col Heatmap': {
    name: 'VueTableColHeatmap',
    setup(props) {
      return () =>
        h(TableRenderer, {
          ...defaultProps,
          ...props,
          heatmapMode: 'col'
        })
    }
  },
  'Table Row Heatmap': {
    name: 'VueTableRowHeatmap',
    setup(props) {
      return () =>
        h(TableRenderer, {
          ...defaultProps,
          ...props,
          heatmapMode: 'row'
        })
    }
  },
  'Export Table TSV': {
    name: 'TsvExportRenderers',
    setup(props) {
      return () =>
        h(TSVExportRenderers, {
          ...defaultProps,
          ...props
        })
    }
  }
})

export default tableComponents
