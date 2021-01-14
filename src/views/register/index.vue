<template>
  <div class="register-wrap" @keyup.enter="register">
    <div class="register-content-wrap">
      <div class="register-content-title">
        <p>注册页面</p>
      </div>
      <div class="register-content">
        <el-form :model="registerForm" ref="registerForm" class="demo-ruleForm" @submit.native.prevent>
          <el-form-item
            style="width: 320px; margin: auto;height: 48px;"
            prop="username">
            <el-input
              placeholder="请输入账号"
              v-model="registerForm.username">
              <i slot="prefix" class="el-icon-user"/>
            </el-input>
          </el-form-item>
          <el-form-item
            style="width: 320px; margin: auto;height: 48px;"
            prop="password">
            <el-input
              placeholder="请输入密码"
              show-password
              v-model="registerForm.password">
              <i slot="prefix" class="el-icon-key"/>
            </el-input>
          </el-form-item>
          <el-form-item
            style="width: 320px; margin: auto;height: 48px;"
            prop="confirmPassword">
            <el-input
              placeholder="请确认密码"
              show-password
              v-model="registerForm.confirmPassword">
              <i slot="prefix" class="el-icon-key"/>
            </el-input>
          </el-form-item>
          <el-form-item
            style="width: 320px; margin: auto;height: 48px;"
            prop="passCode">
            <el-input
              placeholder="请输入认证码"
              v-model="registerForm.passCode">
              <i slot="prefix" class="el-icon-key"/>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="register-footer">
        <el-button type="info"
                   round
                   :disabled="isDisabledRegister"
                   :loading="loading"
                   @click.native="register"
                   @keyup.enter.native="register">
          注册
        </el-button>
      </div>
      <div class="jump-footer">
        <router-link to='/login' class="clear-float">
          <el-button type="text">
            <i class="el-icon-mouse" style="font-size:15px;padding-right: 10px"></i>已有账号，返回登录
          </el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {
  httpRequestServer
} from '@/api/equipmentManage.js'
import md5 from 'md5'

export default {
  data () {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        passCode: ''
      },
      isDisabledRegister: true,
      loading: false,
    }
  },
  watch: {
    'registerForm.passCode' () {
      this.isDisabledRegister = this.registerForm.username === '' || this.registerForm.password === '' ||
        this.registerForm.confirmPassword === '' || this.registerForm.passCode === ''
    }
  },
  methods: {
    register () {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          if (this.loading) {
            return
          }
          this.loading = true
          httpRequestServer('register', {
            username: this.registerForm.username,
            password: md5(this.registerForm.password + "erp123"),
            confirm_password: md5(this.registerForm.confirmPassword + "erp123"),
            pass_code: this.registerForm.passCode
            // password: md5(this.registerForm.password + "erp")
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('注册成功')
              this.$router.push('/login')
            } else {
              this.$message.error(res.msg)
            }
            this.loading = false
          }).catch(res => {
            this.$message.error(res.msg + '注册失败')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register-wrap {
  min-width: 1440px;
  height: 100%;
  background: #0178C6;
  position: relative;

  .register-content-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 416px;
    height: 550px;
    background: rgba(255, 255, 255, 1);
    border-radius: 30px;

    .el-form-item {
      padding-top: 15px;
    }

    .register-content-title {
      padding-top: 39px;
      font-size: 20px;
      font-weight: bold;
      color: rgba(0, 121, 196, 1);
      text-align: center;
    }

    .register-content {
      ::v-deep .el-input {
        line-height: 48px;
        //padding-top: 10px;
        .el-input__inner {
          height: 48px;
          line-height: 48px;
        }
      }
    }

    .register-footer {
      text-align: center;
      padding-top: 48px;

      .el-button {
        width: 320px;
        border-radius: 24px;
        height: 48px;
        background-color: #0079C4;
        border-color: #0079C4;
      }

      ::v-deep .el-button--info.is-disabled {
        background: #AFBEC9;
        border-color: #AFBEC9;
      }
    }

    .jump-footer {
      float: right;
      width: 150px;
      height: 40px;
      padding: 20px;
    }
  }
}

::v-deep .el-form-item__content {
  margin: 0 !important;
}

</style>
