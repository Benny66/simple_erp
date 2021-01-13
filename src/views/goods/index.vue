<template>
  <div id="Data">
    <div class="title-wrap">
      <div class="title-icon">
        <img src="../../assets/logo.png">
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
                   round
                   class="four-reset"
                   @click="resetGoodsData">
          重置
        </el-button>
      </div>
      <div class="undistributed-wrap-title-icon">
        <i class="el-icon-refresh"
           title="刷新"
           @click.stop="resetGoodsData()"></i>
        <i class="el-icon-plus" title="添加" @click.stop="showAddGoodsDialog = true"></i>
      </div>
    </div>
    <el-table
      :data="goodsData"
      ref="ScrollTable"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="id"
        label="序号"
      width="50">
      </el-table-column>
      <el-table-column
        fixed
        prop="goods_no"
        label="商品编号">
      </el-table-column>
      <el-table-column
        prop="goods_url"
        label="商品名称">
        <template slot-scope="scope">
          <el-link :href="scope.row.goods_url" type="primary">{{ scope.row.goods_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="goods_cover"
        label="商品封面图"
        width="100">
        <template slot-scope="scope">
          <el-image
            :src="imageHost + scope.row.goods_cover"
            fit="fill">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存"
      width="80">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="80">
        <template slot-scope="scope">
          <el-tag type="success" v-if=" scope.row.status === 1 ">上架</el-tag>
          <el-tag type="danger" v-else>下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="editGoodsInfo(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click.stop="deleteGoodsInfo(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="goodsData.length > 0"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 30, 40, 50, 100, 200]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <add-goods
      v-if="showAddGoodsDialog"
      :show.sync="showAddGoodsDialog"
      :goodsRow.sync="goodsRow"
    />
  </div>
</template>

<script>
const addGoods = () => import('./components/add-goods')
import {
  httpRequestServer
} from '@/api/equipmentManage.js'
export default {
  components: {addGoods},
  name: 'Goods',
  data () {
    return {
      // 弹窗等待状态
      showAddGoodsDialog: false,

      //下拉状态筛选
      options: [{
        value: 1,
        label: '上架'
      }, {
        value: 0,
        label: '下架'
      }],
      statusSelect: '全部',

      goodsData: [],
      total: 0,
      limit: 5,
      page: 1,
      searchValue: '',
      status: -1,
      // 单个商品数据
      goodsRow: null,
      imageHost: this.$imagesHost
    }
  },
  created () {
    this.getPageGoodsData()
  },
  methods: {
    handleClick (row) {
      // console.log(row)
    },
    // 获取项目一页终端数据
    getPageGoodsData () {
      httpRequestServer('getPageGoodsList', {
        page: this.page, // 页码-1页
        limit: this.limit, // 页数-10条/页
        search: this.searchValue,
        status: this.status,
      })
        .then((res) => {
          if (res.code === 200) {
            this.goodsData = res.data.data
            this.total = res.data.total
            this.limit = res.data.limit
            this.page = res.data.page_count
          }
        })
        .catch((err) => {
          this.$message.error(err.message, '请求失败')
        })
    },
    //分页
    handleSizeChange(size) {
      this.limit = size
      this.page = 1
      this.getPageGoodsData()
      this.$refs.ScrollTable.bodyWrapper.scrollTop = 0
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.getPageGoodsData()
      this.$refs.ScrollTable.bodyWrapper.scrollTop = 0
    },
    // 重置终端数据
    resetGoodsData() {
      if (this.searchValue !== '') {
        this.searchValue = ''
        this.getPageGoodsData()
      }
      if (this.statusSelect !== -1) {
        this.statusSelect = '全部'
        this.status = -1
        this.getPageGoodsData()
      }
    },
    // 查询终端数据
    queryGoodsData() {
      if (this.searchValue !== '') {
        this.page = 1
        this.getPageGoodsData()
      }
      if (this.statusSelect !== -1) {
        this.status = this.statusSelect
        this.getPageGoodsData()
      }
    },
    editGoodsInfo(row) {
      this.goodsRow = row
      this.showAddGoodsDialog = true
    },
    deleteGoodsInfo(id) {
      if (id !== 0) {
        httpRequestServer('deleteGoods',  {
          id: id
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getPageGoodsData()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(res => {
          this.$message.error('删除失败')
        })
      }
    }
  }
}
</script>

<style lang="scss">
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 40px;
}

.el-aside {
  color: #333;
}
.title-wrap {
  display: flex;
  justify-content: flex-start;
  .title-icon {
    width: 30px;
    height: 30px;
    padding: 10px;
    text-align: center;
    img {
      width: 30px;
      height: 30px;
      text-align: center;
    }
  }
  .title-wrap-project {
    flex: 0 0 600px;
  }

  .title-wrap-terminals {
    margin: 0 1%;
  }

  .search-wrap {
    width: 300px;
    ::v-deep .el-input__inner {
      background: #f6f8fe !important;
      border-radius: 20px;
    }

    ::v-deep .el-input__icon {
      cursor: pointer;
      &:hover {
        color: #077dc5;
      }
    }
  }
  .select-wrap {
    width: 100px;
    padding-left: 20px;
  }

  .four-reset {
    margin-left: 20px;
    &:hover, &:focus {
      background: #0079C4;
      border-color: #0079C4;
    }
  }
  .undistributed-wrap-title-icon {
    position: absolute;
    right: 0px;
    i {
      font-size: 21px;
      margin-right: 30px;
      cursor: pointer;
      color: #0079C4;
    }
  }
}
.el-image {
  width: 60px;
}
</style>
