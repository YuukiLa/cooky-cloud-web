<template>
    <div>
      <i-frame url="http://localhost:8063/applications" title="Spring Boot Admin"></i-frame>
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
