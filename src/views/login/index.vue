<template>
  <div class="login-wrap" @keyup.enter="login">
    <div class="login-content-wrap">
      <div class="login-content-title">
        <p>登录页面</p>
      </div>
      <div class="login-content">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm" @submit.native.prevent>
          <el-form-item
            style="width: 320px; margin: auto;height: 48px;"
            prop="username">
          <el-input
            placeholder="请输入账号"
            maxlength="32"
            clearable
            show-word-limit
            v-model="loginForm.username">
            <i slot="prefix" class="el-icon-user"/>
          </el-input>
          </el-form-item>

          <el-form-item
            style="width: 320px; margin: auto;height: 48px;"
            prop="password">
            <el-input
              placeholder="请输入密码"
              show-password
              v-model="loginForm.password">
              <i slot="prefix" class="el-icon-key"/>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="login-footer">
        <el-button type="info"
                   round
                   :disabled="isDisabledLogin"
                   :loading="loading"
                   @click.native="login"
                   @keyup.enter.native="login">
          进入
        </el-button>
      </div>
      <div class="jump-footer">
        <router-link to='/register' class="clear-float">
          <el-button type="text">
            <i class="el-icon-mouse" style="font-size:15px;padding-right: 10px"></i>点击注册
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
import Vue from 'vue'

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      isDisabledLogin: true,
      loading: false,
      rules: {
        username: [
          { request: true, message: '请输入账号', trigger: 'blur'},
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    "loginForm.password"() {
      this.loginForm.password !== '' ? this.isDisabledLogin = false : this.isDisabledLogin = true
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.loading)
            return
          this.loading = true

          httpRequestServer('login',  {
            username: this.loginForm.username,
            password: md5(this.loginForm.password + "erp123")
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('登录成功')
              /* 设置token一小时后过期 */
              let tokenExpireMonitor = (new Date()).getTime() + (3600 * 1000)
              localStorage.setItem('tokenExpireMonitor', tokenExpireMonitor.toString())
              localStorage.setItem('userToken', res.data.token.toString())
              Vue.prototype.$host = 'http://' + res.data.ip_address
              localStorage.setItem('ip_address', res.data.token.toString())
              this.$router.push('/data')
            } else {
              this.$message.error(res.msg)
            }
            this.loading = false
          }).catch(res => {
            this.$message.error(res.msg + '创建失败')
          })
        } else {
          return false
        }
      })
    },
    toRegister() {
      this.$router.push('/register')
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrap {
  min-width: 1440px;
  height: 100%;
  background: #0178C6;
  position: relative;

  .login-content-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 416px;
    height: 400px;
    background: rgba(255, 255, 255, 1);
    border-radius: 30px;
    .el-form-item {
      padding-top: 20px;
    }
    .login-content-title {
      padding-top: 39px;
      font-size: 20px;
      font-weight: bold;
      color: rgba(0, 121, 196, 1);
      text-align: center;
    }
    .login-content {
      ::v-deep .el-input {
        line-height: 48px;
        //padding-top: 10px;
        .el-input__inner {
          height: 48px;
          line-height: 48px;
        }
      }
    }

    .login-footer {
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
      width: 100px;
      height: 40px;
      padding: 20px;
    }


  }
}

::v-deep .el-form-item__content {
  margin: 0 !important;
}

</style>
