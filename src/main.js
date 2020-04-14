import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'// 按需导入ui组件

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'

import Mbx from './components/Mbx.vue'/* 面包屑 */
import TreeTable from 'vue-table-with-tree-grid'/* 商品分类组件 */

/* 富文本编辑器 */
import VueQuillEditor from 'vue-quill-editor'
/* require styles富文本编辑对应的样式 */
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

/* 富文本注册为全局组件 */
Vue.use(VueQuillEditor)
/* mbx注册为全局组件 */
Vue.component('Mbx', Mbx)


/* 配置请求的根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* axios拦截器 */
axios.interceptors.request.use(config => {
  /* console.log(config) *//* 获得一个包含地址的对象 */
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)/* 导入商品分类 组件 */

/* 全局过滤器 */
Vue.filter('dateFormat', function (originVal) {
  const time = new Date(originVal)

  const y = time.getFullYear()
  const m = (time.getMonth() + 1 + '').padStart(2, '0')
  const d = (time.getDate() + '').padStart(2, '0')

  const hh = (time.getHours() + '').padStart(2, '0')
  const mm = (time.getMinutes() + '').padStart(2, '0')
  const ss = (time.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* 注册router到vue实例中，App是根组件内部会有路由功能 */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
