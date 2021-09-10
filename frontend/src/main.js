import Vue from 'vue'
import Element from 'element-ui'
import App from './App.vue'
import router from './router'
import './assets/theme/index.css'
Vue.config.productionTip = false;
Vue.use(Element);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
