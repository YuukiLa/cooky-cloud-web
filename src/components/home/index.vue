<style lang='less'>
.app-home-vue {
  .home-part-body {
    height: 350px;
    .echarts-vue {
      height: 350px;
    }
  }

  .home-part-body2 {
    height: 420px;
    .echarts-vue {
      height: 420px;
    }
  }

  .progress-div {
    >p {
      padding: 8px 0;
    }
    .h-progress {
      &-title {
        color: @dark2-color;
        font-size: 15px;
      }
      &-text {
        width: 40px;
      }
    }
  }
}
</style>
<template>
  <div class="app-home-vue frame-page">
    <div class="frame-page h-panel">
<!--      <div class="h-panel-bar">-->
<!--        <span class="h-panel-title">部门管理</span>-->
<!--      </div>-->
      <div class="h-panel-body">
        {{user.username}},欢迎~
      </div>
    </div>
  </div>
</template>
<script>


export default {
  data() {
    return {
      user: this.$store.getters.account
    };
  },
  methods: {
    openMore() {

    }
  }
};
</script>
