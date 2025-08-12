import { VuePivottable, VuePivottableUi } from './components'
import * as PivotUtilities from './helper'
import TableRenderer from './components/pivottable/renderer'
import type { Component } from 'vue'

const Renderer: Record<string, Component> = {
  ...TableRenderer
}

export { VuePivottable, VuePivottableUi, PivotUtilities, Renderer }
export default { VuePivottable, VuePivottableUi, PivotUtilities, Renderer }
