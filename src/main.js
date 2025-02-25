import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'
import VuePivottable from './index.js'

const app = createApp(App)

app.use(VuePivottable)
app.mount('#app')
