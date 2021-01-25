<template>
  <div id="add-category">
    <el-dialog
      :title="categoryRow ? (categoryRow.handle === 'edit' ? '编辑分类' : '新增下级分类') :'新增顶级分类'"
      :visible.sync="visible"
      :close-on-click-modal="false"
      class="default-dialog"
      @close="close"
    >
      <el-form ref="categoryForm" :rules="rules" :model="categoryForm" label-width="30px" class="clear-float">
        <el-form-item prop="f_name" v-if="isTopCategory === false">
          <label class="">父级分类：</label>
          <el-input
            v-model="categoryForm.f_name"
            maxlength="50"
            placeholder="父级分类"
            ref="ruleFormCategoryName"
            clearable
            show-word-limit
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <label class="">分类名称：</label>
          <el-input
            v-model="categoryForm.name"
            maxlength="50"
            placeholder="分类名称"
            ref="ruleFormCategoryName"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item class="single-cline-item">
          <el-button type="info" round class="four-cancel" @click="close">取消</el-button>
          <el-button round class="four-save" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { httpRequestServer } from '@/api/equipmentManage.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    categoryRow: Object
  },
  data () {
    return {
      categoryData: [],
      isTopCategory: false,
      categoryForm: {
        id: 0,
        pid: 0,
        f_name: '',
        name: '',
        type: 'system',
      },
      visible: this.show,
      rules: {
        name: [{
          required: true,
          validator: this.validateName,
          trigger: 'blur'
        }]
      },
    }
  },
  watch: {
    show () {
      this.visible = this.show
    }
  },
  created () {
    if (this.categoryRow) {
      if (this.categoryRow.handle !== 'add') {
        this.getPCategory(this.categoryRow.pid)
        if (this.categoryRow.pid === 0) {
          this.isTopCategory = true
        }
        this.categoryForm.id = this.categoryRow.id
        this.categoryForm.pid = this.categoryRow.pid
        this.categoryForm.name = this.categoryRow.name
        this.categoryForm.type = this.categoryRow.type
      } else {
        this.isTopCategory = false
        this.categoryForm.id = this.categoryRow.id
        this.categoryForm.pid = this.categoryRow.pid
        this.categoryForm.f_name = this.categoryRow.name
        this.categoryForm.type = this.categoryRow.type
      }
    } else {
      this.isTopCategory = true
    }
    console.log(this.categoryRow)
  },
  methods: {
    save () {
      this.$refs.categoryForm.validate(valid => {
        if (valid) {
          if (this.categoryRow && this.categoryRow.handle === 'edit') {
            httpRequestServer('updateCategory', {
              id: this.categoryForm.id,
              pid: this.categoryForm.pid,
              name: this.categoryForm.name,
              type: this.categoryForm.type,
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('修改成功')
                this.close()
                this.$parent.refreshCategory()
              } else {
                this.$message.error(res.msg)
              }
            }).catch(res => {
              this.$message.error('修改失败')
            })
          } else {
            httpRequestServer('addCategory', {
              pid: this.categoryForm.id,
              name: this.categoryForm.name,
              type: this.categoryForm.type,
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('创建成功')
                this.close()
                this.$parent.refreshCategory()
              } else {
                this.$message.error(res.msg)
              }
            }).catch(res => {
              this.$message.error(res.msg + '创建失败')
            })

          }
        } else {
          return false
        }
      })
    },
    close () {
      this.$emit('update:show', false)
      this.$emit('update:categoryRow', null)
    },
    // 名称效验
    validateName (rule, value, callback) {
      this.categoryForm.category_name = value = value.replace(/\s+/g, '')

      if (!isEmpty(value)) {
        return callback(new Error('请输入1～50位非空字符'))
      }

      if (!validateName(value)) {
        return callback(new Error('该名称不符合规则'))
      }

      callback()
    },
    // 清除输入框触发focus事件
    clearInFocus (row) {
      this.$refs[row].focus()
    },
    getPCategory (id) {
      if (id !== 0) {
        httpRequestServer('getCategory', {
          id: id
        }).then(res => {
          if (res.code === 200) {
            this.categoryForm.f_name = res.data.name
          } else {
            this.$message.error(res.msg)
          }
        }).catch(res => {
          this.$message.error('查询父级分类失败')
        })
      }
    }
  }
}
</script>

<style lang="scss">
#add-category {
  .el-dialog {
    width: 800px;
  }

  .clear-float:after {
    content: '';
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }

  .el-form-item {
    float: left;
    width: 50%;

    .label {
      float: left;
      width: 80px;
    }

    .el-input {
      width: 200px;
    }

    .el-upload-list {
      max-height: 110px;
      overflow-y: auto;
    }
  }

  .single-cline-item {
    width: 100%;
  }
}

</style>
