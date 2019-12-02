import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../vuex/store"
import routes from "../common/router"
import Layout from "components/app/app-frame"
import axios from '../common/ajax'

Vue.use(VueRouter)
let asyncRouter


const routerParam = {
  mode: 'history',
  routes: routes
}
let router = new VueRouter(routerParam)


const ignorePath = ['CommonNotfoundError', 'NotfoundError', 'PermissionError', 'SystemError', 'Login', 'AccountBasic']
router.beforeEach((to, from, next) => {
  let token = Utils.getLocal("USER_TOKEN")
  let hasRouters = store.getters.hasRouters
  HeyUI.$LoadingBar.start();
  // if (to.title) {
  //   document.title = to.title + ' - 管理应用'
  // } else {
  //   document.title = '管理系统'
  // }

  if (token) {

    if (!hasRouters) {
      axios.get(`/rbac/menu/userRouter/${store.state.User.username}`).then(res => {
        store.commit('setPerms', res.data.perms)
        store.commit('setRouters', res.data.menus)
        store.commit('setHasRouters', true)
        asyncRouter = store.state.routers
        Utils.saveLocal("USER_ROUTER", asyncRouter)
        G.trigger('SYS_MENU_UPDATE')
        go(to, next)
      }).catch(e => {
        log(e)
        HeyUI.$Message.error(e.data.msg)
        localStorage.clear()
        store.commit('setHasRouters', false)
        next({name: "Login"})
      })
      // let menus =  fullMenuKeys
    } else {
      next()
    }
    if (to.name === "Login") {
      next("/")
      return
    }
  } else {
    if (to.name === "Login") {
      next()
      return
    }
    next({name: "Login"})
    return
  }
  next()
});
router.afterEach(() => {
  HeyUI.$LoadingBar.success()
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  let layoutContent = document.querySelector('.h-layout-content')
  if (layoutContent) {
    layoutContent.scrollTop = 0
  }
})


function go(to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)
  router.addRoutes(asyncRouter)
  next({...to, replace: true})
}

function filterAsyncRouter(routes) {
  return routes.filter((route) => {
    const component = route.component
    if (component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = view(component)

      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
  })
}

function view(path) {
  return function (resolve) {
    import(`src/${path}.vue`).then(mod => {
      resolve(mod)
    })
  }
}

export default router
