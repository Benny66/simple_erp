<template>
  <div id="Data">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/data' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>退货管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="title-wrap">
      <div class="title-icon">
        <img src="../../assets/liebiao.png">
      </div>
      <div class="title-wrap-project">
        <el-input
          v-model="searchValue"
          placeholder="搜索订单号、快递单号"
          class="search-wrap"
          @keyup.enter.native="queryReturnGoodsData"
        >
          <i slot="suffix" class="el-input__icon icon iconfont iconsearch"
             @click="queryReturnGoodsData">
          </i>
        </el-input>
        <el-select v-model="statusSelect" placeholder="请选择" class="select-wrap" @change="queryReturnGoodsData">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="info"
                   class="four-reset"
                   @click="resetReturnGoodsData">
          重置
        </el-button>
      </div>
      <div class="undistributed-wrap-title-icon">
        <el-button type="info" @click.stop="resetReturnGoodsData()">刷新</el-button>
        <el-button type="primary" @click.stop="showAddReturnGoodsDialog = true">添加</el-button>
      </div>
    </div>
    <div>
      <el-table
        :data="returnGoodsData"
        ref="ScrollTable"
        stripe
        highlight-current-row
        show-overflow-tooltip
        style="width: 100%">
        <el-table-column
          fixed
          prop="id"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          fixed
          prop="order_no"
          label="订单号">
        </el-table-column>
        <el-table-column
          fixed
          prop="express_no"
          label="快递单号">
        </el-table-column>
        <el-table-column
          label="商品名称">
          <template slot-scope="scope">
            <el-link :href="scope.row.goods && scope.row.goods.goods_url" type="primary">{{ scope.row.goods && scope.row.goods.goods_name }}</el-link>
          </template>
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100">
          <template slot-scope="scope">
            <el-tag type="info" v-if=" scope.row.status === 6 ">已换货发出</el-tag>
            <el-tag type="info" v-else-if=" scope.row.status ===  2">可退货</el-tag>
            <el-tag type="danger" v-else-if=" scope.row.status === 3 ">不可退货</el-tag>
            <el-tag type="success" v-else-if=" scope.row.status === 4 ">退货成功</el-tag>
            <el-tag type="warning" v-else-if=" scope.row.status === 5 ">已与档口换货</el-tag>
            <el-tag type="primary" v-else>仓库中</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建用户"
          width="100">
          <template slot-scope="scope">
            {{ scope.row.user && scope.row.user.username }}
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
            <el-button type="info" icon="el-icon-edit" circle @click.stop="editReturnGoodsInfo(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click.stop="deleteReturnGoodsInfo(scope.row.id)"></el-button>
          </template>
          <template>
          </template>
        </el-table-column>
      </el-table>
    </div>
   <div class="page-wrap">
     <el-pagination
       v-if="returnGoodsData.length > 0"
       background
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :current-page="page"
       :page-sizes="[10, 20, 30, 40, 50, 100, 200]"
       :page-size="limit"
       layout="total, sizes, prev, pager, next, jumper"
       :total="total">
     </el-pagination>
   </div>

    <add-return-goods
      v-if="showAddReturnGoodsDialog"
      :show.sync="showAddReturnGoodsDialog"
      :returnGoodsRow.sync="returnGoodsRow"
    />
  </div>
</template>

<script>
const addReturnGoods = () => import('./components/add-return-goods')
import {
  httpRequestServer
} from '@/api/equipmentManage.js'
export default {
  components: {addReturnGoods},
  name: 'ReturnGoods',
  data () {
    return {
      // 弹窗等待状态
      showAddReturnGoodsDialog: false,
      showDeleteReturnGoodsDialog: false,
      //下拉状态筛选,状态:1=仓库中,2=可退货,3=不可退货,4=退货成功,5=已与档口换货,6=已换货发出
      options: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 1,
          label: '仓库中'
        }, {
          value: 2,
          label: '可退货'
        }, {
          value: 3,
          label: '不可退货'
        }, {
          value: 4,
          label: '退货成功'
        }, {
          value: 5,
          label: '已与档口换货'
        }, {
          value: 6,
          label: '已换货发出'
        }
      ],
      statusSelect: '全部',

      returnGoodsData: [],
      total: 0,
      limit: 10,
      page: 1,
      searchValue: '',
      status: -1,
      // 单个商品数据
      returnGoodsRow: null,
      imageHost: this.$host

    }
  },
  created () {
    this.getPageReturnGoodsData()
  },
  methods: {
    handleClick (row) {
      // console.log(row)
    },
    // 获取项目一页退货数据
    getPageReturnGoodsData () {
      httpRequestServer('getPageReturnGoodsList', {
        page: this.page, // 页码-1页
        limit: this.limit, // 页数-10条/页
        search: this.searchValue,
        status: this.status,
      })
        .then((res) => {
          if (res.code === 200) {
            this.returnGoodsData = res.data.data
            this.total = res.data.total
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
      this.getPageReturnGoodsData()
      this.$refs.ScrollTable.bodyWrapper.scrollTop = 0
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.getPageReturnGoodsData()
      this.$refs.ScrollTable.bodyWrapper.scrollTop = 0
    },
    // 重置退货数据
    resetReturnGoodsData() {
      if (this.searchValue !== '') {
        this.searchValue = ''
        this.getPageReturnGoodsData()
      }
      if (this.statusSelect !== -1) {
        this.statusSelect = '全部'
        this.status = -1
        this.getPageReturnGoodsData()
      }
    },
    // 查询退货数据
    queryReturnGoodsData() {
      if (this.searchValue !== '') {
        this.page = 1
        this.getPageReturnGoodsData()
      }
      this.status = this.statusSelect
      this.getPageReturnGoodsData()
    },
    editReturnGoodsInfo(row) {
      this.returnGoodsRow = row
      this.showAddReturnGoodsDialog = true
    },
    deleteReturnGoodsInfo(id) {
      if (id !== 0) {
        httpRequestServer('deleteReturnGoods',  {
          id: id
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getPageReturnGoodsData()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(res => {
          this.$message.error('删除失败')
        })
      }
      this.showDeleteReturnGoodsDialog = false
    }
  }
}
</script>

<style lang="scss">

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
      background: #0178C6;
      border-color: #0079C4;
    }
  }
  .undistributed-wrap-title-icon {
    position: absolute;
    right: 30px;
    i {
      font-size: 21px;
      margin-right: 30px;
      cursor: pointer;
      color: #0079C4;
    }
  }
}

.page-wrap {
  padding-top: 10px;
}
</style>
