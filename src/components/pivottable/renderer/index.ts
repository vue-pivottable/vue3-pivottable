import { h, markRaw } from 'vue'
import { RendererProps } from '@/types'
import TableRenderer from './TableRenderer.vue'
import TSVExportRenderers from './TSVExportRenderers.vue'

const tableComponents = markRaw({
  'Table': {
    name: 'VueTable',
    setup (props: RendererProps) {
      return () =>
        h(TableRenderer, props)
    }
  },
  'Table Heatmap': {
    name: 'VueTableHeatmap',
    setup (props: RendererProps) {
      return () =>
        h(TableRenderer, {
          ...props,
          heatmapMode: 'full'
        })
    }
  },
  'Table Col Heatmap': {
    name: 'VueTableColHeatmap',
    setup (props: RendererProps) {
      return () =>
        h(TableRenderer, {
          ...props,
          heatmapMode: 'col'
        })
    }
  },
  'Table Row Heatmap': {
    name: 'VueTableRowHeatmap',
    setup (props: RendererProps) {
      return () =>
        h(TableRenderer, {
          ...props,
          heatmapMode: 'row'
        })
    }
  },
  'Export Table TSV': {
    name: 'TsvExportRenderers',
    setup (props: RendererProps) {
      return () =>
        h(TSVExportRenderers, props)
    }
  }
})

export default tableComponents
