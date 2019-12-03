import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'js/common/ajax'
import routerParam from "js/common/router";
import Utils from "../common/utils"
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    User: Utils.getLocal2Json('USER'),
    siderCollapsed: false,
    routers: [],
    perms: [],
    hasRouters: false
  },
  mutations: {
    updateAccount(state, data) {
      state.User = data;
    },
    updateSiderCollapse(state, isShow) {
      setTimeout(() => {
        G.trigger('page_resize');
      }, 600);
      state.siderCollapsed = isShow;
    },
    setHasRouters(state, data) {
      state.hasRouters = data
    },
    setRouters(state, data) {
      state.routers = data
    },
    setPerms(state,data) {
      state.perms = data
    }
  },
  actions: {
    updateAccount(context, data) {
      Utils.saveLocal("USER", data)
      context.commit('updateAccount', data);
    },
    updateSiderCollapse(context, data) {
      context.commit('updateSiderCollapse', data);
    },
    setHasRouters(context, data) {
      context.commit("setHasRouters", data)
    },

  },
  getters: {
    account: state => {
      return state.User
    },
    siderCollapsed: state => {
      return state.siderCollapsed
    },
    hasRouters: state => {
      return state.hasRouters
    },
    routers: state => {
      return state.routers
    },
    perms: state => {
      return state.perms
    }
  }
});



