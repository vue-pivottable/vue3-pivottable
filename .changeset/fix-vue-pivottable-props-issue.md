---
"vue-pivottable": patch
---

Fix VuePivottable component props and type issues

- Fix "Cannot read properties of undefined" error when using VuePivottable without VuePivottableUi
- Remove unnecessary composables export from main index to prevent VuePivottableUi code execution
- Make aggregatorName, renderers, rendererName optional in DefaultPropsType with proper defaults  
- Add proper default values in VPivottable component
- Fix TSVExportRenderers to handle undefined aggregatorName
- Resolve Vue warning messages for missing required props

This ensures VuePivottable can be used independently without requiring VuePivottableUi-specific props.