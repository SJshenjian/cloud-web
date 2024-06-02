import user from "@/views/system/user/Index.vue";

/**
 * @author shenjian
 * @since 2024/01/16
 */
const userRouter = [
    {
        path: '/user',
        meta: { title: '用户列表' },
        name: 'user',
        component: user,
    }
]
export default userRouter
