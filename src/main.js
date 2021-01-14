import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
Vue.config.productionTip = false

import api from "./api/interface"
import './regex/regex.function.js'
import {Notification} from 'element-ui'

Vue.prototype.$host = api.host
Vue.prototype.$imagesHost = api.imagesHostUrl

function isRefreshToken() {
  let time = Number.parseInt(localStorage.getItem('tokenExpireMonitor'))
  return time < 1 || time <= (new Date().getTime())
}

const message = msg => {
  Notification({
    title: '提示信息',
    message: msg,
    type: 'error',
    duration: 3000
  })
}

router.beforeEach((to, from, next) => {
  const userToken = localStorage.getItem('userToken')
  if (to.path === '/login' || to.path === '/register') {
    if (userToken) {
      next('/data')
    } else {
      next()
    }
  } else {
    let refresh = isRefreshToken()
    let hasToken = userToken && userToken.toString().length > 0
    /* 检查你的token是否过期了 */
    if (refresh) {
      localStorage.removeItem('tokenExpireMonitor')
      localStorage.removeItem('userToken')
      message('token信息过期，请重新登录')
      next('/login')
    }
    /* 检查是否含有token */
    if (hasToken) {
      next()
    } else {
      next('/login')
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
