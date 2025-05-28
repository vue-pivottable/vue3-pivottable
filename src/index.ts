import { VuePivottable, VuePivottableUi } from './components'
import TableRenderer from './components/pivottable/renderer'
import * as PivotUtilities from './helper'
export * from './composables/index.js'
import type { Component } from 'vue'

const Renderer: Record<string, Component> = {
  ...TableRenderer
}

export { VuePivottable, VuePivottableUi, PivotUtilities, Renderer }
export default { VuePivottable, VuePivottableUi, PivotUtilities, Renderer }
