<style lang="less">

  .app-menu {
    .h-menu {
      font-size: 14px;

      .h-menu-li-selected {
        .h-menu-show:after {
          width: 4px;
        }
      }

      > li > .h-menu-show {
        font-size: 15px;

        .h-menu-show-icon {
          font-size: 20px;
        }

        .h-menu-show-desc {
          transition: opacity 0.1s cubic-bezier(0.645, 0.045, 0.355, 1), width 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
    }

    .h-menu.h-menu-size-collapse > .h-menu-li > .h-menu-show {
      padding-left: 24px;

      .h-menu-show-icon {
        font-size: 20px;
      }
    }

    .h-menu.h-menu-white {
      color: rgb(49, 58, 70);
    }

  }

</style>
<template>
  <div class="app-menu">
    <appLogo></appLogo>
    <Menu :datas="routers" :inlineCollapsed="siderCollapsed" @click="trigger" ref='menu'
          :option="{titleName:'title',keyName:'name'}"
          :className="`h-menu-${theme}`"></Menu>
    <div class="app-menu-mask" @click="hideMenu"></div>
  </div>
</template>
<script>

    import {mapState} from 'vuex'
    import appLogo from './app-logo'
    import staticRoutes from 'js/common/router'
    export default {
        props: {
            theme: String
        },
        data() {
            return {
                menus: []
            };
        },
        watch: {
            $route() {
                this.menuSelect();
            }
        },
        mounted() {
            this.init();
            const listener = G.addlistener('SYS_MENU_UPDATE', () => {
                this.init();
            });
            this.$once('hook:beforeDestroy', function () {
                G.removelistener(listener);
            });
        },
        computed: {
            ...mapState(['siderCollapsed']),
            routers() {
                return this.buildMenu()
            }
        },
        methods: {
            init() {
                this.$nextTick(() => {
                    this.menuSelect();
                });
            },
            menuSelect() {
                if (this.$route.name) {
                    this.$refs.menu.select(this.$route.name);
                }
            },
            trigger(data) {
                if (data.children.length > 0) return;
                this.$router.push({name: data.key});
            },
            hideMenu() {
                this.$store.commit('updateSiderCollapse', true);
            },
            buildMenu() {
                let routers = Utils.copy([].concat(staticRoutes,this.$store.getters.routers))
                let menus = []
                let genMenu = (routes) => {
                    let configMenu = []
                    for (let menu of routes) {
                        let m = Utils.copy(menu)
                        Object.assign(m,m.meta)
                        if (!m.hidden) {
                            configMenu.push(m);
                            if (menu.children && menu.children.length) {
                                m.children = genMenu(menu.children);
                            }
                        }

                    }
                    return menus.concat(configMenu)
                }
                return genMenu(routers)
            }
        },
        components: {
            appLogo
        }
    };
</script>
