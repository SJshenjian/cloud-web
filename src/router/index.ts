import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import login from "@/views/login/Index.vue";
import index from "@/views/Index.vue"
import systemRouter from "@/router/modules/system"
import userRouter from "@/router/modules/user"
import aiRouter from "@/router/modules/ai"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    meta: { title: '登录' },
    name: 'login',
    component: login,
  },
  {
    path: '/index',
    meta: { title: '用户首页' },
    name: 'index',
    component: index,

  },
]

const router = createRouter({
  // 修复打包后首页不显示问题，更改为该模式
  history: createWebHashHistory(),
  routes: routes.concat(userRouter, systemRouter, aiRouter)
})

export default router
