<template>
  <div id="home">
    <el-container>
      <el-header>
        <div class="left">
          <img src="../../assets/logo.png" alt="" class="logo" />
          <span>ERP管理系统</span>
        </div>
        <el-button type="info" @click="signOut">退出</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-container style="height: 100%; border: 1px solid #eee">
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
              <el-menu :default-openeds="defaultOpeners">
                <router-link to="/data">
                  <el-menu-item index="1" class="four-side-router-title">
                    <i class="el-icon-s-home"></i>首页
                  </el-menu-item>
                </router-link>
                <el-submenu v-for="(item, index) in menuItems" :key="index" :index="item.id" class="four-side-router-title">
                  <template slot="title">
                    <i :class=item.icon></i>{{item.name}}
                  </template>
                    <el-menu-item v-for="(childItem, childIndex) in item.child" :key="childIndex" :index="childItem.id">
                      <router-link :to="childItem.path">
                      {{childItem.name}}
                      </router-link>
                    </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-aside>
          </el-container>
        </el-aside>
        <el-container>
          <el-main>
            <router-view />
          </el-main>
          <el-footer>
              @2021.1.11 by 沙蒿同学
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>

</template>

<style lang="scss">

#home{
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    .logo {
      width: 30px;
      height: 30px;
      margin-right: 20px;
    }
  }
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  //text-align: center;
  line-height: 60px;
}

.el-container {
  height: 100%;
  //margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.el-footer {
  background-color: #E9EEF3;
  color: #999;
  text-align: center;
  line-height: 60px;

}

</style>

<script>
import {
  httpRequestServer
} from '@/api/equipmentManage.js'

export default {
  name: 'Home',
  data () {
    return {
      defaultOpeners: [
        '2', '3'
      ],
      menuItems: [
        {
          id: '2',
          name: '退货管理',
          icon: 'el-icon-truck',
          child: [
            {
              id: '2-1',
              name: '退货管理',
              path: '/return_goods'
            }
          ]
        },
        {
          id: '3',
          name: '商品管理',
          icon: 'el-icon-s-goods',
          child: [
            {
              id: '3-1',
              name: '商品管理',
              path: '/goods'
            }
          ]
        }
      ]
    }
  },
  methods: {
    signOut() {
      httpRequestServer('logout').then(res => {
        if (res.code === 200) {
          localStorage.removeItem('userToken')
          localStorage.removeItem('tokenExpireMonitor')
          this.$router.push('/login')
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
