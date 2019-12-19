<template>
  <div>
    <div class="frame-page h-panel" :style="'height:'+ height">
      <div class="h-panel-bar">
        <span class="h-panel-title">{{title}}</span>
      </div>
      <div class="h-panel-body" style="height: 100%">
        <Button @click="openWindows" style="margin-bottom: 8px" color="green">新窗口打开</Button>
        <iframe :src="url" frameborder="no" style="width: 100%;height: 91%" scrolling="auto"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "i-frame",
    props: {
      title: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: ''
      }
    },
    computed: {
      height() {
        return document.documentElement.clientHeight - 87.7 + 'px'
      }
    },
    methods: {
      openWindows() {
        window.open(this.url,'_blank')
      }
    }
  }
</script>

<style scoped>

</style>
