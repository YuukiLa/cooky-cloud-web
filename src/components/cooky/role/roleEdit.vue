<template>
  <div>
    <Modal v-model="showModal" :closeOnMask="false">
      <div slot="header">{{titleStr}}角色</div>
      <div v-width="825" style="padding: 30px 100px 0 100px">
        <Form
          ref="roleForm"
          :validOnChange="true"
          :showErrorTip="true"
          labelPosition="left"
          :labelWidth="80"
          :rules="requireFiled"
          :model="role"
        >
          <FormItem label="角色名" prop="roleName">
            <!--              <template v-slot:label>用户名</template>-->
            <input type="text" v-model="role.roleName">
          </FormItem>

          <FormItem label="菜单">
            <TreePicker :option="param" :useConfirm="false" multiple ref="menuTreepicker" v-model="role.menuIds"
                        choose-mode="independent"></TreePicker>
          </FormItem>
          <FormItem label="描述" prop="describe">
            <!--              <template v-slot:label>用户名</template>-->
            <textarea v-model="role.describe"></textarea>
          </FormItem>
        </Form>

      </div>
      <div slot="footer">
        <Button color="green" @click="editRole" v-if="role.id">修改</Button>
        <Button color="green" @click="addRole" v-else>新增</Button>
        <Button @click="closeModal(false)">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "roleEdit",
    props: {
      showModal: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        role: {
          id: '',
          roleName: '',
          describe: '',
          menuIds: []
        },
        param: {
          keyName: 'id',
          parentName: 'parentId',
          titleName: 'menuTitle',
          dataMode: 'list',
          datas: []
        },
        requireFiled: {
          required: ['roleName']
        },
      }
    },
    computed: {
      titleStr() {
        return this.role.id ? '编辑' : '新增'
      }
    },
    methods: {
      addRole() {
        let valid = this.$refs['roleForm'].valid()
        if (valid.result) {
          this.role.menuIds = this.role.menuIds.join(",")
          this.$axios.postJson('/rbac/role', this.role).then(res => {
            this.closeModal(true)
            this.$Message.success('新增角色成功')
          }).catch(e => {
            this.$Message.error('新增角色失败')
          })
        }

      },
      editRole() {
        let valid = this.$refs['roleForm'].valid()
        if (valid.result) {
          this.role.menuIds = this.role.menuIds.join(",")
          this.$axios.putJson('/rbac/role', this.role).then(res => {
            this.closeModal(true)
            this.$Message.success('修改角色成功')
          }).catch(e => {
            this.$Message.error('修改角色失败')
          })
        }

      },
      setRole(role) {
        Object.keys(this.role).forEach(key => {
          this.role[key] = role[key]
        })
      },
      closeModal(flag = false) {
        this.$emit('closeModal', flag)
        this.resetRole()
      },
      resetRole() {
        this.role = {
          id: '',
          roleName: '',
          describe: '',
          menuIds: []
        }
      },
      initMenu() {
        this.$axios.get("/rbac/menu/bulk").then(res => {
          this.param.datas = res
        }).catch(e => {
          this.$Message.error("您没有获取菜单树的权限或者后台异常，请联系管理员")
        })
      },
    },
    mounted() {
      this.initMenu()
    }
  }
</script>

<style scoped>

</style>
