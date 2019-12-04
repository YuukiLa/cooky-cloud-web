<template>
    <div>
      <i-frame url="http://localhost:10000/swagger-ui.html" title="Swagger"></i-frame>
    </div>
</template>

<script>
   import iFrame from 'components/common/i-frame'
    export default {
        name: "index",
        components: {
            iFrame
        }
    }
</script>

<style scoped>

</style>
