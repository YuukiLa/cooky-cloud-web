<template>
    <div>
      <Modal v-model="showModal" :closeOnMask="false">
        <header class="h-modal-header">用户信息</header>
        <div class="h-panel" v-width="1200">
          <div class="h-panel-body">
            <user-info :user="user"></user-info>
          </div>
        </div>
        <div slot="footer">
          <Button @click="$emit('closeModal')">关闭</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
    import userInfo from 'components/common/user-info'
    export default {
        name: "userInfoModal",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                user: {}
            }
        },
        components: {
            userInfo
        },
        methods: {
            setUser(user) {
                this.user = user
            }
        }
    }
</script>

<style scoped>

</style>
