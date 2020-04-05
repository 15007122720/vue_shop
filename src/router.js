// 路由页面
import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue' // 登录组件
import Home from './components/Home.vue' // home组件
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'/* 用户列表 */

Vue.use(Router)

// 路由规则
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users }]
    }
  ]
})

/* 挂载路由导航守卫 */
router.beforeEach((to, from, next) => {
  /* to将要访问的路径  from 从哪个路径跳转来  next是个函数 表示放行  next('/login)强制跳转 */
  if (to.path === '/login') return next()
  /* 获取token */
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router