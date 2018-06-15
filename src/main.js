import Vue from 'vue'
import 'semantic-ui-css/semantic.min.css'
import SuiVue from 'semantic-ui-vue'
import App from './App.vue'

Vue.use(SuiVue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
