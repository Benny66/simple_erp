<template>
  <div>
    <el-dialog
      :title="returnGoodsRow ? '编辑退货商品' :'新增退货商品'"
      :visible.sync="visible"
      :close-on-click-modal="false"
      class="default-dialog"
      @close="close"
    >
      <el-form ref="returnGoodsForm" :rules="rules" :model="returnGoodsForm" label-width="30px" class="clear-float">
        <el-form-item prop="order_no">
          <label class="">订单号：</label>
          <el-input
            v-model="returnGoodsForm.order_no"
            maxlength="50"
            placeholder="请输入订单号"
            ref="ruleFormGoodsNo"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item prop="express_no">
          <label class="">快递单号：</label>
          <el-input
            v-model="returnGoodsForm.express_no"
            maxlength="50"
            placeholder="请输入快递单号"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item prop="goods_id">
          <label class="">退货商品：</label>
          <el-select v-model="returnGoodsForm.goods_id" placeholder="请选择">
            <el-option
              v-for="item in goodsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="status" class="single-cline-item">
          <label>退货状态：</label>
          <el-radio-group v-model="returnGoodsForm.status">
<!--      下拉状态筛选,状态:1=仓库中,2=可退货,3=不可退货,4=退货成功,5=已与档口换货,6=已换货发出-->
            <el-radio  :label=1>仓库中</el-radio>
            <el-radio  :label=2>可退货</el-radio>
            <el-radio  :label=3>不可退货</el-radio>
            <el-radio  :label=4>退货成功</el-radio>
            <el-radio  :label=5>已与档口换货</el-radio>
            <el-radio  :label=6>已换货发出</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="remark" class="single-cline-item">
          <label class="">备注：</label>
          <el-input
            type="textarea"
            :rows="2"
            v-model="returnGoodsForm.remark"
            placeholder="备注信息"
            maxlength="255"
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
import {
  httpRequestServer
} from '@/api/equipmentManage.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    returnGoodsRow: Object
  },
  data () {
    return {
      goodsList: [],

      returnGoodsForm: {
        id: 0,
        order_no: '',
        express_no: '',
        goods_id: '',
        status: 1,
        remark: '',
      },
      visible: this.show,
      rules: {
        // order_no: [{required: false, validator: null, trigger: 'blur'}],
        // express_no: [{required: true, validator: this.validateName, trigger: 'blur'}],
        // return_goods_url: [{required: false, validator: null, trigger: 'blur'}],
      }
    }
  },
  watch: {
    show () {
      this.visible = this.show
    }
  },
  created () {
    this.getAllGoodsList()
    if (this.returnGoodsRow) {
      this.returnGoodsForm.id = this.returnGoodsRow.id
      this.returnGoodsForm.order_no = this.returnGoodsRow.order_no
      this.returnGoodsForm.express_no = this.returnGoodsRow.express_no
      this.returnGoodsForm.goods_id = this.returnGoodsRow.goods_id
      this.returnGoodsForm.remark = this.returnGoodsRow.remark
      this.returnGoodsForm.status = this.returnGoodsRow.status
    }
  },
  methods: {
    getAllGoodsList() {
      httpRequestServer('getAllGoodsList', {}).then(res => {
          if (res.code === 200) {
            // this.goodsList.getPageGoodsData()
            for (let i = 0; i< res.data.length; i++) {
              this.goodsList.push({
                value: res.data[i].id,
                label: res.data[i].goods_name
              })
            }
          } else {
            this.$message.error(res.msg)
          }
        }).catch(res => {
          console.log(res)
          this.$message.error('查询商品失败')
        })
    },
    save () {
      this.$refs.returnGoodsForm.validate(valid => {
        if (valid) {
          if (this.returnGoodsRow) {
            httpRequestServer('updateReturnGoods',  { ...this.returnGoodsForm }).then(res => {
              if (res.code === 200) {
                this.$message.success('修改成功')
                this.close()
                this.$parent.getPageReturnGoodsData()
              } else {
                this.$message.error(res.msg)
              }
            }).catch(res => {
              this.$message.error('修改失败')
            })
          } else {
            httpRequestServer('addReturnGoods', { ...this.returnGoodsForm }).then(res => {
              if (res.code === 200) {
                this.$message.success('创建成功')
                this.close()
                this.$parent.getPageReturnGoodsData()
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
      this.$emit('update:returnReturnGoodsRow', null)
    },
    // 名称效验
    validateName(rule, value, callback) {
      this.returnGoodsForm.express_no = value = value.replace(/\s+/g,"")

      if (!isEmpty(value))
        return callback(new Error('请输入1～50位非空字符'))

      if (!validateName(value))
        return callback(new Error('该名称不符合规则'))

      callback()
    },
    // 清除输入框触发focus事件
    clearInFocus(row) {
      this.$refs[row].focus()
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
