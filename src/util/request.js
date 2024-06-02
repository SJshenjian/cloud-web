/**
 * @author shenjian
 * @since 2023/6/30
 */
import axios from 'axios'
import baseUrl from '@/util/baseUrl'
import { ElMessage, ElNotification } from 'element-plus'
import store from "../store";

const service = axios.create({
    timeout: 600000,
})

/**
 * 全局请求处理
 */
service.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = store.getters.token
        return config
    },
    (error) => {
        console.log(error)
        return Promise.reject(error)
    }
)

/**
 * 全局异常响应处理
 */
service.interceptors.response.use((res) => {
    if (res.status && res.status === 200) {
        // 判断是否为Blob类型，如果是则为下载
        if (res.data instanceof Blob) {
            res.data.headers = res.headers
            return res.data
        }
        if (res.data === '') {
            return res.data
        }
        if (res.data.code !== 200) {
            ElMessage.error(res.data.message)
            return false
        }
    }
    return res.data.data
}, error => {
    if(error.message.lastIndexOf("timeout of") > -1){
        ElNotification.error({
            message : "网络异常",
            title : "提示",
            duration: 3000,
            showClose: false
        })
    } else {
        ElMessage.error("系统开小差了，请联系管理员")
    }
})

const $http = {}
$http.get = function (url, data, urlType, config) {
    config = config || {}
    config.url = baseUrl[urlType] + url
    config.method = 'get'
    config.params = data
    config.urlType = urlType
    return service.request(config)
}

$http.post = function (url, data, urlType, config) {
    config = config || {}
    config.url = baseUrl[urlType] + url
    config.method = 'post'
    config.data = data
    config.urlType = urlType
    return service.request(config)
}

export { service, $http }