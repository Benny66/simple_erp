import axios from 'axios'
import router from '../router'
import { Notification } from 'element-ui'

// 弹窗
const message = msg => {
  Notification({
    title: '提示信息',
    message: msg,
    type: 'error',
    duration: 3000
  })
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login'
  })
}

// 统一失败的错误处理
const errorHandleMap = [
  [
    401,
    () => {
      toLogin()
      message('用户没有权限（令牌、用户名、密码错误）')
    }
  ],
  [
    404,
    () => {
      router.replace({ path: '/equipmentManage' })
      message('请求的资源不存在')
    }
  ],
  [
    500,
    () => {
      router.replace({ path: '/equipmentManage' })
      message('服务器发生了错误')
    }
  ]
]
const errorHandle = status => {
  [...errorHandleMap].forEach(([key, fun]) => {
    if (key === status) {
      fun.call()
    }
  })
}

const httpServer = (opts, data) => {
  // 设置请求的配置
  const httpOptions = {
    method: opts.method.toLowerCase(),
    url: opts.url,
    timeout: 5000,
    baseURL: '/api',
    withCredentials: true
  }
  // 区分post或者get
  const paramsType = ['delete', 'post', 'put']
  if (paramsType.includes(httpOptions.method)) {
    httpOptions.data = data
  } else {
    httpOptions.params = data
  }
  return axios(httpOptions)
}
// 请求拦截
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('userToken')
    token && (config.headers.token = token)
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截
// 1003 token错误, 1004 token过期, 1005 token不存在
const tokenErrorCode = [1003, 1004, 1005]
axios.interceptors.response.use(
  response => {
    /* 后台返回的状态码都是200, 我们需要在这里进行判断 */
    if (response.status === 200) {
      if (tokenErrorCode.includes(response.data.result)) {
        this.toLogin()
        message('用户没有权限（令牌、用户名、密码错误）')
      }
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    const { response } = error
    if (response) {
      errorHandle(response.status)
    } else {
      // 断网
    }
    return Promise.reject(error)
  }
)
export default httpServer
