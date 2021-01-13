/*
 * @Author: your name
 * @Date: 2020-06-28 09:06:48
 * @LastEditTime: 2020-07-27 18:44:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \4g-emergency-radio-full-version\vue.config.js
 */
module.exports = {
    // webpack 配置进行更细粒度的修改  https://cli.vuejs.org/zh/config/#chainwebpack
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
        config.plugin('html')
            .tap(args => {
                args[0].title = "ERP管理系统";
                return args;
            })
        // 或者修改它的选项：
        // config.plugin('prefetch').tap(options => {
        //     options[0].fileBlacklist = options[0].fileBlacklist || []
        //     options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
        //     return options
        // })
    },
    //关闭eslint检测
    lintOnSave: false,
    configureWebpack: {
        resolve: {
            alias: {
                vue$: "vue/dist/vue.esm.js",
                'assets': '@/assets',
                'views': '@/views',
                'components': '@/components',
            }
        }
    },
    /**
     * 部署生产环境和开发环境下的URL
     * 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
     * 例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。
     * 例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
     */
    // publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    publicPath: '/',
    /**
     * 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。
     * 注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
     */
    outputDir: 'dist',
    /**
     * 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
     * 从生成的资源覆写 filename 或 chunkFilename 时，assetsDir 会被忽略。
     */
    assetsDir: 'static',
    /**
     * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
     * 打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
     * map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
     * 有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
     */
    // productionSourceMap: false,
    // 支持webPack-dev-server的所有选项
    devServer: {
        host: "172.16.90.108",
        port: 8080,
        open: true, //配置自动启动浏览器
        // 配置多个代理
        proxy: {
            '/api' : {
                target : 'http://172.16.90.108:8001',
                changeOrigin : true,
                // 如果接口中是没有api的，那就直接置空.如果接口中有api，那就得写成{‘^/api’:‘/api’}
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        }
    }
}
