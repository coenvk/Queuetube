import '@babel/polyfill'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import './plugins/vue-awesome'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import './registerServiceWorker'
import VueYoutube from 'vue-youtube'
import axios from 'axios'

import ApiService from '@/common/api.service'

import ErrorFilter from '@/common/error.filter'

Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueYoutube)

Vue.filter('error', ErrorFilter)

ApiService.init()

new Vue({
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')
