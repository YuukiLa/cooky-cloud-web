<template>
  <div>
    <i-frame :url="url" title="Spring Boot Admin"></i-frame>
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
        return manageConfig.springBootAdminUrl
      }
    }
  }
</script>

<style scoped>

</style>
