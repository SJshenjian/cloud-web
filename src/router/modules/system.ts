import org from "@/views/system/org/Index.vue";
import module from "@/views/system/module/Index.vue";
import role from "@/views/system/role/Index.vue";
import config from "@/views/system/config/Index.vue";

/**
 * @author shenjian
 * @since 2023/8/7
 */
const systemRouter = [
    {
        path: '/org',
        meta: { title: '机构列表' },
        name: 'org',
        component: org,
    },
    {
        path: '/module',
        meta: { title: '菜单列表' },
        name: 'module',
        component: module,
    },
    {
        path: '/role',
        meta: { title: '角色列表' },
        name: 'role',
        component: role,
    },
    {
        path: '/config',
        meta: { title: '配置列表' },
        name: 'config',
        component: config,
    },
]
export default systemRouter
