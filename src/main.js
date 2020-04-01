import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 按需导入ui组件
/* import './plugins/element.js' */


 import ElementUI from "element-ui";  //导入ui  手动配置
import "element-ui/lib/theme-chalk/index.css";  //导入ui样式
Vue.use(ElementUI) //插件 

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
