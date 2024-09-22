// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from './App.vue'
import router from './router'
import store from './store'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {$http} from './util/request'

import 'element-plus/theme-chalk/index.css'
import ElementPlus, {ElMessage} from 'element-plus'
import 'element-plus/dist/index.css'

import '@/assets/icon/iconfont.css'

import * as Vue from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import $ from 'jquery'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { formatDate } from '@/util/index'
import './styles/index.css'
import { isEmpty, isNumber } from 'lodash'
import VueSSE from 'vue-sse'

const app = Vue.createApp(App)

// Use VueSSE, including a polyfill for older browsers
// @ts-ignore
app.use($).use(ElementPlus).use(store).use(router).use(VueSSE, {
    polyfill: true
})
app.config.globalProperties.$http = $http
app.config.globalProperties.$isMobileDevice = navigator.userAgent.match(
    /(phone|Pad|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
) !== null
app.config.globalProperties.$formatDate = formatDate
app.config.globalProperties.$isEmpty = function(value: any) {
    // 修复数字判断为空问题
    if (isNumber(value)) {
        return !isNumber(value);
    } else {
        return isEmpty(value);
    }
};
app.config.errorHandler = function(err) {
    console.log("global", err);
    ElMessage.error("系统开小差了，请联系管理员")
};
app.mount('#app')
