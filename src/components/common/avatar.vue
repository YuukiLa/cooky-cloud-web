<template>
    <Modal v-model="showModal" :closeOnMask="false">
      <header class="h-modal-header">选择头像</header>
      <div v-width="1175">
        <img v-for="a in a1" :key="a" :src="avatar(a)" width="235" height="235" @click="changeAvatar(a)"/>
        <Loading text="更新中..." :loading="loading"></Loading>
      </div>
      <div slot="footer">
        <Button @click="$emit('closeModal')">关闭</Button>
      </div>
    </Modal>
</template>

<script>
    const a1 = ['d60ff04f2e477456bbfc27cd4fd7e079.jpeg','7fdc30d775ba418cdf42f4bab88f01c2.jpeg','cae7dee8e340cde65a3b38f968427cac.jpeg','810a41796dd87264931d3fe3ea0f8bf2.jpeg'
    ,'71d8949d34d4f25a9aade243e1e58751.jpg','55ea16db571d626b4cc2f4e58839a7ec.jpeg','1c1d71f17b6014814657af375075a93e.jpg','6bd38a269babdf1f62733e8ba7af407d.jpg','c95c557db95c24849475ee26c1b9b5c6.jpeg'
    ,'06d0090a90fd7ab8b6b57f529993f088.jpg']
    export default {
        name: "avatar",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
         return {
            a1:a1,
             loading: false
         }
        },
        methods: {
            avatar(avatar) {
                return require(`@/images/avatar/${avatar}`)
            },
            changeAvatar(pic) {
                this.loading = true
                this.$axios.putJson(`/rbac/user/avatar/${pic}`).then(res => {
                    this.$Message.success("修改成功")
                    this.$emit('success',pic)
                    this.loading = false
                }).catch(e => {
                    log(e)
                    this.$Message.error("修改失败")
                    this.loading = false
                })

            }
        }
    }
</script>

<style scoped>

</style>
