import * as Vuex from 'vuex'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import getters from './getters.js'

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/user'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './user.js' => 'user'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  modules[moduleName] = value.default
  return modules
}, {})

const store = Vuex.createStore({
  modules,
  getters,
})

export default store
