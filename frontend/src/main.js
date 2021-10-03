import Vue from 'vue'
import Element from 'element-ui'
import locale from "element-ui/lib/locale/lang/es"
import App from './App.vue'
import router from './router'
import './assets/theme/index.css'
Vue.config.productionTip = false;
Vue.use(Element, {locale});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
