import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* -- Socket -- */
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';
Vue.use(VueSocketio, io('http://localhost:3001'));
/* -- ********** -- */

/* -- Element UI -- */
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
/* -- ********** -- */

Vue.config.productionTip = false
Vue.use(Element)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
