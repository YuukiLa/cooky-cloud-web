<style lang='less'>
</style>
<template>
  <div>
    <Layout class="app-frame" v-if="!loading" :siderCollapsed="siderCollapsed" :siderFixed="layoutConfig.siderFixed">
      <Sider :theme="layoutConfig.siderTheme">
        <appMenu :theme="layoutConfig.siderTheme"></appMenu>
      </Sider>
      <Layout :headerFixed="layoutConfig.headerFixed">
        <HHeader theme="white">
          <appHead @openSetting="openSetting=true" :layoutConfig="layoutConfig"></appHead>
        </HHeader>
        <SysTabs v-if="layoutConfig.showSystab" homePage="Home"></SysTabs>
        <Content>
          <div class="app-frame-content">
             <keep-alive>
               <router-view></router-view>
             </keep-alive>
          </div>
<!--          <HFooter>-->
<!--            <appFooter></appFooter>-->
<!--          </HFooter>-->
        </Content>
      </Layout>
    </Layout>
    <Modal v-model="openSetting" type="drawer-right">
      <appLayoutSetting :layoutConfig="layoutConfig"></appLayoutSetting>
    </Modal>
  </div>
</template>
<script>
    import appLayoutSetting from './modules/app-layout-setting';
    import appHead from './app-header';
    import appMenu from './app-menu';
    import appFooter from './app-footer';
    import SysTabs from '../common/sys-tabs';
    import {mapState} from 'vuex';

    export default {
        data() {
            return {
                loading: false,
                openSetting: false,
                layoutConfig: {
                    siderTheme: 'white',
                    showSystab: true,
                    headerFixed: true,
                    siderFixed: true
                }
            };
        },
        mounted() {
            // 如果无后台数据，将此处屏蔽
            // this.$Loading('加载中');

            // 如果无后台数据，将此处打开
            // const listener = G.addlistener('SYS_MENU_REFRESH', () => {
            //   this.initMenu();
            // });
            // this.$once('hook:beforeDestroy', function () {
            //   G.removelistener(listener);
            // });
        },
        methods: {


        },
        computed: {
            ...mapState(['siderCollapsed'])
        },
        components: {
            appHead,
            appMenu,
            SysTabs,
            appFooter,
            appLayoutSetting
        }
    };
</script>
