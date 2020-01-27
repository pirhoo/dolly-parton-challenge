import './main.scss'

import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

const render = h => h(App)
new Vue({ render }).$mount('#app')
