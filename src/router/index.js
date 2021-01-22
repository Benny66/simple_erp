import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/home.vue'
import Data from '../views/home/data.vue'
import Goods from '../views/goods'
import Login from '../views/login'
import Register from '../views/register'
import ReturnGoods from '../views/retuen_goods'
import Category from '../views/category'

Vue.use(VueRouter)

const routes = [
  /* 登录 */
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/data',
    children: [
      {
        path: '/data',
        name: 'Data',
        component: Data
      },
      {
        path: '/goods',
        name: 'Goods',
        component: Goods
      },
      {
        path: '/return_goods',
        name: 'ReturnGoods',
        component: ReturnGoods
      },
      {
        path: '/category',
        name: 'Category',
        component: Category
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
