<template>
  <div id="category">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/data' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="title-wrap">
      <div class="title-icon">
        <img src="../../assets/liebiao.png">
      </div>
      <div class="title-wrap-project">
        <el-input
          placeholder="搜索分类名称"
          class="search-wrap"
          v-model="searchCategory"
          @keyup.enter.native="queryCategoryData"
        >
        </el-input>
        <!--        <el-select v-model="statusSelect" placeholder="请选择" class="select-wrap" @change="getTreeCategory">-->
        <!--          <el-option-->
        <!--            v-for="item in options"-->
        <!--            :key="item.value"-->
        <!--            :label="item.label"-->
        <!--            :value="item.value">-->
        <!--          </el-option>-->
        <!--        </el-select>-->
        <el-button type="info"
                   class="four-reset"
                   @click="refreshCategory">
          重置
        </el-button>
      </div>
      <div class="undistributed-wrap-title-icon">
        <el-button type="info" @click.stop="refreshCategory()">刷新</el-button>
      </div>
    </div>
    <div class="category-warp">
      <el-table
        :data="categoryData"
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
          prop="name"
          label="分类名称">
          <template slot-scope="scope">
            <i class="el-icon-minus" v-if="scope.row.pid !== 0"></i>
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
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
          width="200">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-plus" circle @click.stop="addCategoryInfo(scope.row)"></el-button>
            <el-button type="info" icon="el-icon-edit" circle @click.stop="editCategoryInfo(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle
                       @click="deleteCategoryInfo(scope.row.id)"></el-button>
          </template>
          <template>

          </template>
        </el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination
          v-if="categoryData.length > 0"
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
    <add-category
      v-if="showAddCategoryDialog"
      :show.sync="showAddCategoryDialog"
      :categoryRow.sync="categoryRow"
    />
  </div>
</template>

<script>
import { httpRequestServer } from '@/api/equipmentManage'
import AddCategory from '@/views/category/components/add-category'

export default {
  name: 'index',
  components: { AddCategory },
  data () {
    return {
      categoryData: [],
      total: 0,
      limit: 10,
      page: 1,
      treeProps: {
        value: 'id',
        children: 'child',
        label: 'name',
        type: 'type'
      },
      categoryRow: null,
      searchCategory: '',
      showAddCategoryDialog: false
    }
  },
  created () {
    this.getPageCategory()
  },
  methods: {
    getPageCategory () {
      httpRequestServer('getPageCategory', {
        search: this.searchCategory
      })
        .then((res) => {
          if (res.code === 200) {
            this.categoryData = res.data.data
            this.total = res.data.total
          }
        })
        .catch((err) => {
          this.$message.error(err.message, '请求失败')
        })
    },
    // 查询分类数据
    queryCategoryData (params) {
      if (this.searchCategory !== '') {
        this.page = 1
      }
      this.getPageCategory()
    },
    // 重置分类数据
    refreshCategory () {
      if (this.searchCategory !== '') {
        this.searchCategory = ''
      }
      this.page = 1
      this.getPageCategory()
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

    editCategoryInfo (row) {
      this.categoryRow = row
      this.categoryRow.handle = 'edit'
      this.showAddCategoryDialog = true
    },
    addCategoryInfo (row) {
      this.categoryRow = row
      this.categoryRow.handle = 'add'
      this.showAddCategoryDialog = true
    },
    deleteCategoryInfo (id) {
      if (id !== 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          httpRequestServer('deleteCategory', {
            id: id
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getPageCategory()
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
      this.showDeleteCategoryDialog = false
    },
  }
}
</script>

<style scoped>
.category-warp {

}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
