<template>
  <div id="express-inquiry">
    <div class="title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/data' }">仓库系统</el-breadcrumb-item>
        <el-breadcrumb-item>退货管理</el-breadcrumb-item>
        <el-breadcrumb-item>快递查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-divider style="background: #ffffff"></el-divider>
    <iframe name="kuaidi100" src="https://www.kuaidi100.com/frame/index.html"
            width="960"
            height="660"
            marginwidth="0"
            marginheight="0"
            hspace="0"
            vspace="0"
            frameborder="0"
            scrolling="no"
    ></iframe>
  </div>
</template>

<script>
export default {
name: "ExpressInquiry"
}
</script>

<style scoped>

</style>
