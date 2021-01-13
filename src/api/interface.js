//配置全局访问接口地址
const hostUrl = "http://172.16.90.108:8001"
const debugHostUrl = "http://172.16.90.108:8080"
const imagesHostUrl = "http://172.16.90.108:8001"

let host = (process.env.NODE_ENV === 'development' ? debugHostUrl : hostUrl)

export default {
  host, imagesHostUrl
}

