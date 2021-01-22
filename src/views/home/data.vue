<template>
  <div id="data">
    <div class="title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/data' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>更多功能，敬请期待....</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-divider style="background: #ffffff"></el-divider>
    <div class="content">
      <span>系统数据统计</span>
      <div class="data-display">
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="8" :lg="9" :xl="6">
              <div class="icon-css">
                <i class="el-icon-s-goods" style="color: #42b983"></i>
              </div>
              <div class="item-css">
                商品总数：
                <span>8000</span>
              </div>
          </el-col>
          <el-col :xs="8" :sm="6" :md="8" :lg="9" :xl="6">
            <div class="icon-css">
              <i class="el-icon-truck" style="color: darkred"></i>
            </div>
            <div class="item-css">
              退货总数：
              <span>8000</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Data'
}
</script>

<style lang="scss">
#data {

  .title {

  }
  .content {
    padding-left: 20px;
    padding-right: 20px;
    background: #ffffff;
    width: auto;
    height: 760px;
    .data-display {
      height: 80px;
      .el-col {
        border-radius: 4px;
        box-shadow:5px 5px 10px #99a9bf;
        .icon-css {
          float: left;
          i {
            font-size: 36px;
            padding: 11px;
            margin:0 auto;
            color: #42b983;
          }
        }
        .item-css {
          padding-left: 10px;
          //padding-bottom: 20px;
          float: left;
          span {
            color: #077dc5;
            font-size: 16px;
            height: 30px;
            margin: 0 auto;
          }
        }

      }

      .bg-purple-dark {
        //background: #99a9bf;
        background: #ffffff;
      }

      .bg-purple {
        background: #ffffff;

        //background: #d3dce6;
      }

      .bg-purple-light {
        //background: #e5e9f2;
        background: #ffffff;

      }

      .grid-content {
        border-radius: 4px;
        min-height: 36px;
        width: 20%;
      }
    }

  }

}
</style>
