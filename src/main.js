import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from './http/index'
import 'babel-polyfill'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import md5 from 'js-md5';

Vue.prototype.axios = axios;
Vue.prototype.md5 = md5;
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
