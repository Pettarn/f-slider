import Vue from 'vue'
import App from './App.vue'

import FImageSlider from 'f-image-slider'
Vue.use(FImageSlider)

new Vue({
  el: '#app',
  render: h => h(App)
})
