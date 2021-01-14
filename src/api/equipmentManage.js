import httpServer from '@/plugins/axios.js'

const requestObj = {
  login: {
    url: '/v1/login',
    method: 'post'
  },
  logout: {
    url: '/v1/user/logout',
    method: 'post'
  },
  refreshToken: {
    url: '/auth/user/refresh',
    method: 'post'
  },
  getUserInfo: {
    url: '/v1/user/get',
    method: 'get'
  },
  //商品管理
  getPageGoodsList: {
    url: '/v1/goods/page',
    method: 'get'
  },
  getAllGoodsList: {
    url: '/v1/goods/all',
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
  },

  //退货管理
  getPageReturnGoodsList: {
    url: '/v1/return_goods/page',
    method: 'get'
  },
  addReturnGoods: {
    url: '/v1/return_goods/create',
    method: 'post'
  },
  updateReturnGoods: {
    url: '/v1/return_goods/update',
    method: 'put'
  },
  deleteReturnGoods: {
    url: '/v1/return_goods/delete',
    method: 'delete'
  }
}

export const httpRequestServer = (name, requestParams) => {
  const requestUrl = Reflect.get(requestObj, name)
  return httpServer(requestUrl, requestParams)
}
