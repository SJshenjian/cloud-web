<!--
 * 登录后主页面
 * @author shenjian
 * @since 2023/07/26
 -->
<template>
  <div class="index">
    <sys-header :menuName="menuName" @updateRouter="updateRouter" ></sys-header>
    <el-main style="padding: 0; flex: 0">
      <user v-if="current === 'user'"></user>
      <role v-else-if="current === 'role'"></role>
      <org v-else-if="current === 'org'"></org>
      <module v-else-if="current === 'module'"></module>
      <config v-else-if="current === 'config'"></config>
      <chat v-else-if="current === 'chat'"></chat>/
    </el-main>
    <sys-footer :current="current" @updateRouter="updateRouter"></sys-footer>
  </div>
</template>
<script>
import SysHeader from "@/components/menu/SysHeader.vue";
import SysFooter from "@/components/menu/SysFooter.vue";
import Role from "@/views/system/role/Index.vue";
import Org from "@/views/system/org/Index.vue";
import Module from "@/views/system/module/Index.vue";
import User from "@/views/system/user/Index.vue";
import Config from "@/views/system/config/Index.vue";
import Chat from "@/views/ai/Chat.vue";

export default {
  name: 'index',
  components: {Chat, Config, User, Module, Org, Role, SysFooter, SysHeader},
  data() {
    return {
      current: 'chat',
      menuName: 'AI聊天',
    }
  },
  methods: {
    updateRouter(val) {
      this.current = val
      if (val === 'user') {
        this.menuName = '用户管理'
      } else  if (val === 'role') {
        this.menuName = '角色管理'
      } else  if (val === 'org') {
        this.menuName = '机构管理'
      } else  if (val === 'module') {
        this.menuName = '菜单管理'
      } else  if (val === 'config') {
        this.menuName = '配置管理'
      } else  if (val === 'chat') {
        this.menuName = 'AI聊天'
      }
    }
  },
}
</script>
<style>

</style>
