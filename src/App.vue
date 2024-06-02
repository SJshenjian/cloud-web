<template>
  <el-config-provider :locale="locale">
    <div id="app">
      <!-- 解决相同路由走缓存，不更新问题 -->
      <router-view :key="$route.fullPath" />
    </div>
  </el-config-provider>
</template>

<script>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

// 修复ResizeObserver loop limit exceeded异常
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}


export default {
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  data() {
    return {
      locale: zhCn
    }
  },
  methods: {
  },
}
</script>

<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
