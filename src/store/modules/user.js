/**
 * 用户相关信息
 *
 * @author shenjian
 * @since 2023/07/25
 */
const getDefaultState = () => {
    return {
        token: localStorage.getItem('token'),
        account: localStorage.getItem('account'),
        username: localStorage.getItem('username'),
        permissions: localStorage.getItem('permissions'),

    }
}

const state = getDefaultState()

// 把处理数据逻辑方法全部放在mutations里面，使得数据和视图分离
const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_ACCOUNT: (state, account) => {
        state.account = account
    },
    SET_USERNAME: (state, username) => {
        state.username = username
    },
    SET_PERMISSIONS: (state, permissions) => {
        state.permissions = permissions
    },
}

const actions = {
    setToken({ commit }, token) {
        commit('SET_TOKEN', token)
        localStorage.token = token
    },
    setAccount({ commit }, account) {
        commit('SET_ACCOUNT', account)
        localStorage.account = account
    },
    setUsername({ commit }, username) {
        commit('SET_USERNAME', username)
        localStorage.username = username
    },
    setPermissions({ commit }, permissions) {
        commit('SET_PERMISSIONS', permissions)
        localStorage.permissions = permissions
    },
}

export default {
    // vuex中的store分模块管理，需要在store的index.js中引入各个模块，为了解决不同模块命名冲突的问题，将不同模块的namespaced:true
    namespaced: true,
    state,
    mutations,
    actions,
}
