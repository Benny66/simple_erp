<template>
  <div id="category">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/data' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="title-wrap">
      <div class="title-icon">
        <img src="../../assets/liebiao.png">
      </div>
      <div class="title-wrap-project">
        <el-input
          v-model="searchValue"
          placeholder="搜索商品编号、名称"
          class="search-wrap"
          @keyup.enter.native="queryGoodsData"
        >
          <i slot="suffix" class="el-input__icon icon iconfont iconsearch"
             @click="queryGoodsData">
          </i>
        </el-input>
        <el-select v-model="statusSelect" placeholder="请选择" class="select-wrap" @change="queryGoodsData">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="info"
                   class="four-reset"
                   @click="resetGoodsData">
          重置
        </el-button>
      </div>
      <div class="undistributed-wrap-title-icon">
        <el-button type="info" @click.stop="resetGoodsData()">刷新</el-button>
        <el-button type="primary" @click.stop="showAddGoodsDialog = true">添加</el-button>
      </div>
    </div>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>

  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    }
  }
};
</script>

<style scoped>

</style>
