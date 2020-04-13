// 路由页面
import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue' // 登录组件
import Home from './components/Home.vue' // home组件
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'/* 用户列表 */
import Rights from './components/power/Rights.vue'/* 权限列表 */
import Roles from './components/power/Roles.vue'/* 角色列表 */
import Cate from './components/goods/Cate.vue'/* 商品分类 */
import Params from './components/goods/Params.vue'/* 参数分类 */
import GoodsList from './components/goods/List.vue' /* 商品列表 */
import Add from './components/goods/Add.vue' /* 商品列表 添加按钮里的 商品页面 */
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
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: Add }
      ]
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