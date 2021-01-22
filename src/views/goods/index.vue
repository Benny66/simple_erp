<template>
  <div id="Data">
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
        <el-button type="info" @click.stop="refreshGoodsData()">刷新</el-button>
        <el-button type="primary" @click.stop="showAddGoodsDialog = true">添加</el-button>
      </div>
    </div>
    <el-row :gutter="10">
      <el-col :xs="8" :sm="12" :md="8" :lg="6" :xl="4" class="category-wrap">
        <div>
          <div class="category-wrap-title">
            <span style="padding: 10px;">分类</span>
            <el-input
              placeholder="输入分类名称搜索"
              v-model="searchCategory"
              @keyup.enter.native="getTreeCategory"
            >
            </el-input>
            <el-button slot="reference" type="text" class="el-icon-refresh-right"
                       @click.stop="refreshTreeCategory"></el-button>
          </div>
          <div class="category-wrap-content">
            <el-tree
              highlight-current
              default-expand-all
              node-key="id"
              :expand-on-click-node="false"
              :props="treeProps"
              :data="categoryData"
              :current-node-key="currentNode"
              @node-click="queryGoodsData">
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :xs="16" :sm="12" :md="16" :lg="18" :xl="20" class="goods-list-wrap">
        <div>
          <el-table
            :data="goodsData"
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
                <el-tag type="primary" v-if=" scope.row.status === 1 ">上架</el-tag>
                <el-tag type="info" v-else>下架</el-tag>
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
                <el-button type="info" icon="el-icon-edit" circle @click.stop="editGoodsInfo(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle
                           @click="deleteGoodsInfo(scope.row.id)"></el-button>
              </template>
              <template>

              </template>
            </el-table-column>
          </el-table>
          <div class="page-wrap">
            <el-pagination
              v-if="goodsData.length > 0"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10, 30, 40, 50, 100, 200]"
              :page-size="limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>


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
  components: { addGoods },
  name: 'Goods',
  data () {
    return {
      // 弹窗等待状态
      showAddGoodsDialog: false,
      showDeleteGoodsDialog: false,
      //下拉状态筛选
      options: [
        {
          value: -1,
          label: '全部'
        }, {
          value: 1,
          label: '上架'
        }, {
          value: 0,
          label: '下架'
        }],
      statusSelect: '全部',
      categoryId: 0,
      goodsData: [],
      total: 0,
      limit: 10,
      page: 1,
      searchValue: '',
      status: -1,
      // 单个商品数据
      goodsRow: null,
      imageHost: this.$host,

      categoryData: [],
      treeProps: {
        value: 'id',
        children: 'child',
        label: 'name'
      },
      searchCategory: '',
      currentNode: ''
    }
  },
  created () {
    this.getPageGoodsData()
    this.getTreeCategory()
  },
  methods: {
    handleClick (row) {
      // console.log(row)
    },
    // 获取项目一页商品数据
    getPageGoodsData () {
      httpRequestServer('getPageGoodsList', {
        page: this.page, // 页码-1页
        limit: this.limit, // 页数-10条/页
        search: this.searchValue,
        status: this.status,
        category_id: this.categoryId
      })
        .then((res) => {
          if (res.code === 200) {
            this.goodsData = res.data.data
            this.total = res.data.total
          }
        })
        .catch((err) => {
          this.$message.error(err.message, '请求失败')
        })
    },
    //分页
    handleSizeChange (size) {
      this.limit = size
      this.page = 1
      this.getPageGoodsData()
      this.$refs.ScrollTable.bodyWrapper.scrollTop = 0
    },
    handleCurrentChange (currentPage) {
      this.page = currentPage
      this.getPageGoodsData()
      this.$refs.ScrollTable.bodyWrapper.scrollTop = 0
    },
    // 重置商品数据
    resetGoodsData () {
      if (this.searchValue !== '') {
        this.searchValue = ''
      }
      if (this.statusSelect !== -1) {
        this.statusSelect = '全部'
        this.status = -1
      }
      this.getPageGoodsData()
    },
    // 重置商品数据
    refreshGoodsData () {
      if (this.searchValue !== '') {
        this.searchValue = ''
      }
      if (this.statusSelect !== -1) {
        this.statusSelect = '全部'
        this.status = -1
      }
      if (this.categoryId !== 0) {
        this.categoryId = 0
      }
      this.getPageGoodsData()
    },
    // 查询商品数据
    queryGoodsData (params) {
      if (this.searchValue !== '') {
        this.page = 1
      }
      if (this.statusSelect !== '全部') {
        this.status = this.statusSelect
      }
      if (params['id'] !== 0) {
        this.categoryId = params['id']
      }
      this.getPageGoodsData()
    },
    refreshTreeCategory() {
      if (this.searchCategory !== '') {
        this.searchCategory = ''
      }
      this.getTreeCategory()
    },
    editGoodsInfo (row) {
      this.goodsRow = row
      this.showAddGoodsDialog = true
    },
    deleteGoodsInfo (id) {
      if (id !== 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          httpRequestServer('deleteGoods', {
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      }
      this.showDeleteGoodsDialog = false
    },
    getTreeCategory () {
      httpRequestServer('getTreeCategory', {
        search: this.searchCategory
      })
        .then((res) => {
          if (res.code === 200) {
            this.categoryData = res.data
          }
        })
        .catch((err) => {
          this.$message.error(err.message, '请求失败')
        })
    }
  },
  pushDataToCategoryTree () {

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

.category-wrap {
  background: #ffffff;
  padding-bottom: 20px;

  .category-wrap-title {
    display: inline;
    height: 60px;
    font-size: 14px;
    //padding: 10px;
    color: #333333;

    span {
      border-radius: 3px;
      background: #0178C6;
      color: #ffffff;
    }

    .el-input {
      padding-left: 5px;
      width: 64%;
    }

    .el-icon-refresh-right {
      padding: 10px;
      font-size: 21px;
      color: #0178C6;
    }
  }

  .category-wrap-content {
    .el-tree {
      .el-tree-node__content {
        padding: 10px;
        font-size: 18px;
      }
    }
  }

}

.goods-list-wrap {
}

.page-wrap {
  padding-top: 10px;
}


</style>
