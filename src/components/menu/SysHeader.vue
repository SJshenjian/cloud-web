<!--
 * 菜单头
 * @author shenjian
 * @since 2023/07/31
 -->
<template>
  <div class="header">
    <div class="nav">
      <div class="rg-login"></div>
      <el-menu
          mode="horizontal"
          background-color="#132EBE"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="width: 800px;"
          default-active="1"
          @select="handleSelect"
      >
        <el-menu-item v-if="permissions.indexOf('chat') > -1" index="chat">AI聊天</el-menu-item>
        <el-menu-item v-if="permissions.indexOf('org') > -1" index="org">机构管理</el-menu-item>
        <el-menu-item v-if="permissions.indexOf('user') > -1" index="user">用户管理</el-menu-item>
        <el-sub-menu v-if="permissions.indexOf('module') > -1 || permissions.indexOf('role') > -1" index="6">
          <template #title>系统管理</template>
          <el-menu-item v-if="permissions.indexOf('module') > -1" index="module">菜单管理</el-menu-item>
          <el-menu-item v-if="permissions.indexOf('role') > -1" index="role">角色管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
      <div class="rg-infor">
        <div class="rg-infor-li" style="margin-right: 50px">
          <i class="ico1"></i>欢迎您：{{username}}
        </div>
        <div class="rg-infor-li">
          <a href="JavaScript:;" @click="handleUpdatePassword"><i class="ico3 set"></i>修改密码</a>
        </div>
<!--        <div class="rg-infor-li">-->
<!--          <a href="JavaScript:;" onclick="openAboutPage()"><i class="ico4 " ></i>关于</a>-->
<!--        </div>-->
        <div class="rg-infor-li">
          <a href="JavaScript:;" @click="handleLogout"><i class="ico2 out" ></i>退出</a>
        </div>
      </div>
    </div>
  </div>
  <div>
    <UpdatePassword v-if="visible.updatePassword" :updatePasswordFlag="visible.updatePassword" @updatePasswordFlag="updatePasswordFlag"></UpdatePassword>
  </div>
</template>
<script>
import {Plus, Right, Search, Setting, SwitchButton} from "@element-plus/icons-vue";
import {ElMessageBox} from "element-plus";
import '@/styles/header.css'
import store from "@/store";
import UpdatePassword from "@/views/system/UpdatePassword.vue";

export default {
  name: 'sysHeader',
  components: {UpdatePassword},
  props: {
    menuName: {
      type: String,
      default: ""
    },
  },
  computed: {
    Right() {
      return Right
    },
    Search() {
      return Search
    },
    Plus() {
      return Plus
    },
    SwitchButton() {
      return SwitchButton
    },
    Setting() {
      return Setting
    }
  },
  data() {
    return {
      visible: {
        systemManager: false,
        updatePassword: false
      },
      username: store.getters.username,
      permissions: store.getters.permissions
    }
  },
  methods: {
    updatePasswordFlag() {
      this.visible.updatePassword = false
    },
    handleUpdatePassword() {
      this.visible.updatePassword = true
    },
    handleSelect(val) {
      this.$emit('updateRouter', val)
    },
    // 退出
    handleLogout() {
      const self = this
      ElMessageBox.confirm(
          '确认要退出吗?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        localStorage.removeItem('token')
        self.$store.dispatch('user/setToken', null)
        self.$store.dispatch('user/setAccount', null)
        self.$store.dispatch('user/setUsername', null)
        self.$store.dispatch('user/setPermissions', null)
        self.$router.push('/')
      }).catch(() => {
        console.log("")
      })
    }
  }
}
</script>
<style scoped>
.el-menu--horizontal {
  border-bottom: solid 0px var(--el-menu-border-color);
}
</style>
