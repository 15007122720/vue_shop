//路由页面
import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'  //登录组件

Vue.use(Router)

//路由规则         
export default new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login }
  ]
})
