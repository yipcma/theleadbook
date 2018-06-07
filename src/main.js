import Vue from 'vue'
import { Row, Col, Input, Select, Option } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
