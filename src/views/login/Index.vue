<template>
  <div class="login-box">
<!--    <div class="login-box-img"></div>-->
    <div class="login-main">
      <div class="login-min">
        <div class="login-left">
          <div class="login-left-logo"></div>
          <div class="login-left-lfbt" style="margin-bottom:82px;width: 220px">欢迎登录</div>
          <input v-model="user.account"  type="text" class="login-input-lg" placeholder="请输入用户名">
          <input  v-model="user.pwd" type="password" class="login-input-lg" autocomplete="off" placeholder="请输入密码">
          <p class="error-txt" style="height: 20px; color: red" >{{message}}</p>
          <button type="button" class="login-btn-lg" @click="submit" >登录</button>
        </div>
        <div class="login-right">
          <div class="login-right-font">
            <div class="login-left-tig"></div>
            <div class="login-left-SHL">算法小生云平台</div>
            <div class="login-left-ssm"></div>
          </div>
          <div class="login-right-img"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Lock, User} from "@element-plus/icons-vue";
import '@/styles/login.css'
import {hex_md5} from '@/util/md5'

export default {
  name: 'login',
  components: {Lock, User},
  data() {
    return {
      user: {
        account: '',
        pwd: '',
        password: '',
      },
      message: '',
    }
  },
  methods: {
    submit() {
      const self = this
      if (self.user.account.trim() === '') {
        self.message = '请输入用户名!'
        return
      }
      if (self.user.pwd.trim() === '') {
        self.message = '请输入密码!'
        return
      }
      self.user.password = hex_md5(self.user.pwd)
      self.message = ''
      self.$http.post('/login', self.user, 'apiUrl', { body: 'json' })
          .then((res) => {
            if (res) {
              self.$store.dispatch('user/setToken', res.token)
              self.$store.dispatch('user/setAccount', res.account)
              self.$store.dispatch('user/setUsername', res.username)
              self.$store.dispatch('user/setPermissions', res.permissions)
              self.$router.push('/index')
            }
          })
    }
  },
}
</script>

<style scoped>
</style>
