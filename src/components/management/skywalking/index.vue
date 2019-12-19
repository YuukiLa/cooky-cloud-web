<template>
  <div>
    <i-frame :url="url" title="Swagger"></i-frame>
  </div>
</template>

<script>
  import iFrame from 'components/common/i-frame'
  import manageConfig from 'js/config/manage-config'
  export default {
    name: "index",
    components: {
      iFrame
    },
    computed: {
      url() {
        return manageConfig.skywalkingUrl
      }
    }
  }
</script>

<style scoped>

</style>
