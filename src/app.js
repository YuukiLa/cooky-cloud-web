// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import '@babel/polyfill';
import Vue from 'vue';
import App from 'components/App';

import heyuiConfig from 'js/config/heyui-config';
import router from 'js/config/router-config';
import store from 'js/vuex/store';
import 'js/vue/components';
import 'js/vue/filters';
import axios from 'js/common/ajax'

require('./css/app.less');


// 开发环境判断
// process.env.NODE_ENV == 'development'

// 使用mock文件， 自己开发的时候请删除
// require('./mock/index');

// HeyUI已经设定为全局变量，无需引用
// 设定全局变量请参考根目录下的hey.conf.js文件

heyuiConfig();
Vue.use(HeyUI);
Vue.prototype.$axios = axios
Vue.directive('hasPerms', {
  bind(el, binding, vnode) {
    let perms = store.getters.perms
    if (!perms.includes(binding.value)) {
      if (!el.parentNode) {
        el.style.display = 'none'
      } else {
        el.parentNode.removeChild(el)
      }
    }
  }
})
export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
