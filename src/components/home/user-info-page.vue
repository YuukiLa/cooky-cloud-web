<template>
  <div>
    <div class="h-panel frame-page">
      <div class="h-panel-bar">
        <span class="h-panel-title">个人中心</span>
      </div>
      <div class="h-panel-body">
        <Button color="green" @click="showAvatar = true">修改头像</Button>
        <user-info :user="user"></user-info>
      </div>
    </div>
    <avatar :showModal="showAvatar" @success="success" @closeModal="showAvatar=false"></avatar>
  </div>
</template>

<script>
    import userInfo from 'components/common/user-info'
    import avatar from 'components/common/avatar'

    export default {
        name: "user-info-page",
        components: {
            userInfo, avatar
        },
        data() {
            return {
                showAvatar: false,
                user: this.$store.getters.account
            }
        },
        methods: {
            success(pic) {
                this.showAvatar = false
                this.user.avatar = pic
                this.$store.dispatch('updateAccount',this.user)
            }
        }
    }
</script>

<style scoped>

</style>
