import httpServer from '@/plugins/axios.js'

const requestObj = {
  login: {
    url: '/v1/login',
    method: 'post'
  },
  logout: {
    url: '/v1/logout',
    method: 'post'
  },
  refreshToken: {
    url: '/auth/refresh',
    method: 'post'
  },
  getPageGoodsList: {
    url: '/v1/goods/page',
    method: 'get'
  },
  reqAddGoods: {
    url: '/v1/goods/create',
    method: 'post'
  },
  reqUpdateGoods: {
    url: '/v1/goods/update',
    method: 'put'
  },
  deleteGoods: {
    url: '/v1/goods/delete',
    method: 'delete'
  }
}

export const httpRequestServer = (name, requestParams) => {
  const requestUrl = Reflect.get(requestObj, name)
  return httpServer(requestUrl, requestParams)
}
