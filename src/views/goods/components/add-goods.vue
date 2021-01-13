<template>
  <div>
    <el-dialog
      :title="goodsRow ? '编辑商品' :'新增商品'"
      :visible.sync="visible"
      :close-on-click-modal="false"
      class="default-dialog"
      @close="close"
    >
      <el-form ref="goodsForm" :rules="rules" :model="goodsForm" label-width="30px" class="clear-float">
        <el-form-item prop="goods_no">
          <label class="">商品编号：</label>
          <el-input
            v-model="goodsForm.goods_no"
            maxlength="50"
            placeholder="请输入商品编号"
            ref="ruleFormGoodsNo"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item prop="goods_name">
          <label class="">商品名称：</label>
          <el-input
            v-model="goodsForm.goods_name"
            maxlength="50"
            placeholder="请输入商品名称"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item prop="goods_url">
          <label>商品链接：</label>
          <el-input v-model="goodsForm.goods_url" placeholder="请粘贴商品链接"></el-input>
        </el-form-item>
        <el-form-item>
          <label>是否上架：</label>
          <el-switch
            :active-value=1
            :inactive-value=0
            v-model="goodsForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item class="single-cline-item" prop="stock">
          <label>库存(个)：</label>
          <el-input
            v-model="goodsForm.stock"
            maxlength="5"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <label>商品封面图：</label>
          <el-upload
            class="upload-demo"
            :action="uploadImageUrl"
            :on-preview="handleCoverPreview"
            :on-remove="handleCoverRemove"
            :on-success="handleCoverSuccess"
            :on-exceed="handleOverImages"
            :file-list="goodsCoverList"
            list-type="picture"
            :limit=1>
            <el-button size="small" type="primary" :disabled="disableUploadCover">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传一张jpg/png文件，且不超过5M</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <label>商品图片：</label>
          <el-upload
            class="upload-demo"
            :action="uploadImageUrl"
            :on-preview="handleImagesPreview"
            :on-remove="handleImagesRemove"
            :on-success="handleImagesSuccess"
            :on-exceed="handleOverImages"
            :file-list="goodsImagesList"
            list-type="picture"
            :limit=3>
            <el-button size="small" type="primary" :disabled="disableUploadImages">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传三张jpg/png文件，且不超过5M</div>
          </el-upload>
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
import {
  httpRequestServer
} from '@/api/equipmentManage.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    goodsRow: Object
  },
  data () {
    return {
      disableUploadCover: false,
      disableUploadImages: false,

      uploadImageUrl: this.$host + '/api/v1/upload',
      goodsCoverList: [],
      goodsImagesList: [],

      goodsForm: {
        id: 0,
        goods_no: '',
        goods_name: '',
        goods_url: '',
        goods_cover: '',
        goods_images: '',
        stock: 1000,
        status: 1,
      },
      visible: this.show,
      rules: {
        goods_no: [{required: false, validator: null, trigger: 'blur'}],
        goods_name: [{required: true, validator: this.validateName, trigger: 'blur'}],
        goods_url: [{required: false, validator: null, trigger: 'blur'}],
      }
    }
  },
  watch: {
    show () {
      this.visible = this.show
    }
  },
  created () {
    if (this.goodsRow) {
      this.goodsForm.id = this.goodsRow.id
      this.goodsForm.goods_no = this.goodsRow.goods_no
      this.goodsForm.goods_name = this.goodsRow.goods_name
      this.goodsForm.goods_url = this.goodsRow.goods_url
      this.goodsForm.goods_cover = this.goodsRow.goods_cover
      this.goodsForm.goods_images= this.goodsRow.goods_images
      this.goodsForm.stock = this.goodsRow.stock
      this.goodsForm.status = this.goodsRow.status
      this.goodsCoverList = [
        {
          name: this.goodsRow.goods_name,
          url: this.$imagesHost + this.goodsRow.goods_cover
        }
      ]
      this.disableUploadCover = this.goodsRow.goods_cover !== ''
      if (this.goodsRow.goods_images !== '') {
        let goods_images_arr = this.goodsRow.goods_images.split(',')
        for (let i = 0; i < goods_images_arr.length; i++) {
          this.goodsImagesList.push({
            name: this.goodsRow.goods_name + '-' + i,
            url: this.$imagesHost + goods_images_arr[i]
          })
        }
      }
    }
  },
  methods: {
    save () {
      this.$refs.goodsForm.validate(valid => {
        if (valid) {
          if (this.goodsRow) {
            httpRequestServer('reqUpdateGoods',  { ...this.goodsForm }).then(res => {
              if (res.code === 200) {
                this.$message.success('修改成功')
                this.close()
                this.$parent.getPageGoodsData()
              } else {
                this.$message.error(res.msg)
              }
            }).catch(res => {
              this.$message.error('修改失败')
            })
          } else {
            httpRequestServer('reqAddGoods', { ...this.goodsForm }).then(res => {
              if (res.code === 200) {
                this.$message.success('创建成功')
                this.close()
                this.$parent.getPageGoodsData()
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
      this.$emit('update:goodsRow', null)
    },
    // 名称效验
    validateName(rule, value, callback) {
      this.goodsForm.goods_name = value = value.replace(/\s+/g,"")

      if (!isEmpty(value))
        return callback(new Error('请输入1～50位非空字符'))

      if (!validateName(value))
        return callback(new Error('该名称不符合规则'))

      callback()
    },
    // 清除输入框触发focus事件
    clearInFocus(row) {
      this.$refs[row].focus()
    },
    handleCoverRemove () {
      this.disableUploadCover = false
      this.goodsForm.goods_cover = ''
    },
    handleCoverPreview (file) {
      // console.log(file);
    },
    handleCoverSuccess (file) {
      this.disableUploadCover = true
      this.goodsForm.goods_cover = file.data
    },
    handleImagesRemove (file) {
      let file_name = file.response.data
      let data = this.goodsForm.goods_images.split(',')
      Array.prototype.remove = function (val) {
        let index = this.indexOf(val)
        if (index > -1) {
          this.splice(index, 1)
        }
      }
      data.remove(file_name);
      if (data.length < 3) {
        this.disableUploadImages = false
      }
      this.goodsForm.goods_images = data.join(",")
    },
    handleImagesPreview (file) {
      // console.log(file);
    },
    handleImagesSuccess (file) {
      if (this.goodsForm.goods_images === '') {
        this.goodsForm.goods_images = file.data
      } else {
        this.goodsForm.goods_images += ',' + file.data
      }
      let data = this.goodsForm.goods_images.split(',')
      if (data.length >= 3) {
        this.disableUploadImages = true
      }
    },
    handleOverImages () {
      console.log('文件数量超出限制')
    }
  }
}
</script>

<style lang="scss">
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
</style>
