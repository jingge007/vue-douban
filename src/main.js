// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'         // 引入vuex
import 'common/stylus/index.styl'  // 引入样式表
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  error: require('./common/image/loading.gif'),                  // 这个是请求失败后显示的图片
  loading: require('./common/image/loading.gif')               // 这个是加载的loading过渡效果
  // try: 2                                       // 这个是加载图片数量
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
})
