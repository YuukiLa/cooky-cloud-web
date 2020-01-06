<template>
  <div>
    <Modal v-model="showModal" :closeOnMask="false">
      <div slot="header">{{titleStr}}用户</div>
      <div v-width="825" style="padding: 30px 100px 0 100px">
        <Form
          ref="userForm"
          :validOnChange="true"
          :showErrorTip="true"
          labelPosition="left"
          :labelWidth="80"
          :rules="requireFiled"
          :model="user"
        >
          <FormItem label="用户名" prop="username">
            <input type="text" v-model="user.username">
          </FormItem>
          <FormItem label="密码" prop="password" v-if="!user.id">
            <input type="password" v-model="user.password">
          </FormItem>
          <FormItem label="手机" prop="phone">
            <input type="text" v-model="user.phone">
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <input type="text" v-model="user.email">
          </FormItem>
          <FormItem label="性别" prop="sex">
            <Select v-model="user.sex" :datas="sexData"></Select>
          </FormItem>
          <FormItem label="部门" prop="deptId">
            <TreePicker :option="param" :useConfirm="false" ref="deotTreepicker" v-model="user.deptId"
                        choose-mode="independent"></TreePicker>
          </FormItem>
          <FormItem label="角色" prop="roleIds">
            <Select multiple v-model="user.roleIds" :datas="roles" keyName="id" titleName="roleName"></Select>
          </FormItem>
          <FormItem label="状态" prop="status">
            <h-switch v-model="user.status" :trueValue="1" :falseValue="0">
              <span slot="open">启用</span>
              <span slot="close">锁定</span>
            </h-switch>
          </FormItem>
          <FormItem label="描述" prop="describe">
            <textarea v-model="user.describe"></textarea>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button color="green" @click="editUser" v-if="user.id">修改</Button>
        <Button color="green" @click="addUser" v-else>新增</Button>
        <Button @click="closeModal(false)">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "userEdit",
    props: {
      showModal: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        sexData: [
          {title: '男', key: '0'},
          {title: '女', key: '1'},
          {title: '保密', key: '2'},
        ],
        param: {
          keyName: 'id',
          parentName: 'parentId',
          titleName: 'deptName',
          dataMode: 'list',
          datas: []
        },
        roles: [],
        user: {
          id: '',
          username: '',
          password: '',
          sex: '',
          email: '',
          phone: '',
          roleIds: [],
          deptId: '',
          status: 1,
          describe: '',
        }
      }
    },
    computed: {
      titleStr() {
        return this.user.id ? '编辑' : '新增'
      },
      requireFiled() {
        const requireFiled = {required: ['username']}
        if(!this.user.id) requireFiled.required.push('password')
          return requireFiled

      }
    },
    methods: {
      editUser() {
        let valid = this.$refs['userForm'].valid()
        if (valid.result) {
          this.user.roleId = this.user.roleIds.join(',')
          this.$axios.putJson('/rbac/user', this.user).then(res => {
            this.$Message.success("修改用户成功")
            this.closeModal(true)
          }).catch(e => {
            this.$Message.error('修改用户失败')
          })
        }
      },
      addUser() {
        let valid = this.$refs['userForm'].valid()
        if (valid.result) {
          this.user.roleId = this.user.roleIds.join(',')
          this.$axios.postJson('/rbac/user', this.user).then(res => {
            this.$Message.success("新增用户成功")
            this.closeModal(true)
          }).catch(e => {
            this.$Message.error('新增用户失败')
          })
        }
      },
      setUser(user) {
        Object.keys(this.user).forEach(key => {
          this.user[key] = user[key]
        })
      },
      closeModal(flag = false) {
        this.$emit('closeModal', flag)
        this.resetUser()
      },
      resetUser() {
        this.user = {
          id: '',
          username: '',
          password: '',
          sex: '',
          email: '',
          phone: '',
          roleIds: [],
          deptId: '',
          status: 1,
          describe: '',
        }
      },
      initRoles() {
        this.$axios.get("/rbac/role").then(res => {
          this.roles = res
        }).catch(e => {
          this.$Message.error('您没有获取角色的权限，请联系管理员开通')
        })
      },
      initMenu() {
        this.$axios.get("/rbac/dept/bulk").then(res => {
          this.param.datas = res
        }).catch(e => {
          this.$Message.error("您没有获取部门树的权限或者后台异常，请联系管理员")
        })
      },
    },
    mounted() {
      this.initRoles()
      this.initMenu()
    }
  }
</script>

<style scoped>

</style>
