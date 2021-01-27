<template>
  <div id="category">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/data' }">仓库系统</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
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
        <el-button type="info"
                   class="four-reset"
                   @click="refreshCategory">
          重置
        </el-button>
      </div>
      <div class="undistributed-wrap-title-icon">
        <el-button type="info" @click.stop="refreshCategory()">刷新</el-button>
        <el-button type="primary" @click.stop="showAddCategoryDialog = true">添加顶级分类</el-button>

      </div>
    </div>
    <tree-table
      :data="categoryData"
      :columns="columns"
      :handleFunc="handleFunc"
      @addCategory="addCategoryInfo"
      @editCategory="editCategoryInfo"
      @deleteCategory="deleteCategoryInfo"
    ></tree-table>
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
import TreeTable from '@/components/tree-table'

export default {
  name: 'index',
  components: {
    AddCategory,
    TreeTable
  },
  data () {
    return {
      columns: [
        {
          text: '分类名称',
          value: 'name',
          width: 300
        },
        {
          text: '序号',
          value: 'id'
        },
        {
          text: '创建时间',
          value: 'create_time'
        },
        {
          text: '更新时间',
          value: 'update_time'
        }
      ],
      handleFunc: {
        add: 'addCategory',
        edit: 'editCategory',
        delete: 'deleteCategory'
      },
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
      showAddCategoryDialog: false,
      showDeleteCategoryDialog: false,

    }
  },
  created () {
    this.getTreeCategory()
  },
  methods: {
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
    },
    // 查询分类数据
    queryCategoryData (params) {
      this.getTreeCategory()
    },
    // 重置分类数据
    refreshCategory () {
      if (this.searchCategory !== '') {
        this.searchCategory = ''
      }
      this.getTreeCategory()
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
              this.refreshCategory()
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
