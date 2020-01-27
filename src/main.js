import './main.scss'

import Vue from 'vue'
import Murmur from '@icij/murmur'
import App from './App.vue'

Vue.config.productionTip = false

Murmur.config.set('sharing-options.title', "It's time you take part in the #dollypartonchallenge")

const render = h => h(App)
new Vue({ render }).$mount('#app')
