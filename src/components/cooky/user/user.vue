<template>
  <div class="users-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">用户管理</span>
    </div>
    <div class="h-panel-body">
      <div class="authorization-frame">
        <div class="users-container">
          <div style="margin-bottom: 10px;">
            <Button color="green" @click="showModal=true" v-has-perms="'user:add'">新增</Button>
            <Button :color="batchDelete?'red':'primary'" @click="handleDel" v-has-perms="'user:del'">{{batchDelete?'删除选中的数据':'批量删除'}}</Button>
            <Button @click="batchDelete = false" v-if="batchDelete">取消选择</Button>
          </div>
          <!-- <Tree :option="userOption" multiple ref="user" v-model="users"></Tree> -->
        </div>
        <div>
          <Table ref="userTable" :datas="users" :border="true" :stripe="true" :checkbox="batchDelete" :loading="loading">
            <TableItem title="id" prop="id"></TableItem>
            <TableItem title="用户名" prop="username"></TableItem>
            <TableItem title="部门" prop="deptName"></TableItem>
            <TableItem title="性别" align="center">
              <template slot-scope="{data}">
                <span class="h-tag h-tag-green" v-if="data.sex==='0'">男</span>
                <span class="h-tag h-tag-red" v-if="data.sex==='1'">女</span>
                <span class="h-tag h-tag-blue" v-if="data.sex==='2'">保密</span>
              </template>
            </TableItem>
            <TableItem title="状态" align="center">
              <template slot-scope="{data}">
                <span class="h-tag h-tag-bg-gray" v-if="data.status===0">锁定</span>
                <span class="h-tag h-tag-bg-primary" v-if="data.status===1">启用</span>
              </template>
            </TableItem>
            <TableItem title="操作" align="center">
              <template slot-scope="{data}">
                <i class="icon-eye green-color" v-tooltip="true" content="查看更多"></i>&nbsp;
                <i class="icon-cog yellow-color" v-tooltip="true" content="修改用户"  @click="editUser(data)" v-has-perms="'user:edit'"></i>&nbsp;
                <Poptip content="是否删除？" @confirm="deleteUser(data.id)">
                  <i class="h-icon-trash red-color" v-tooltip="true" content="删除用户" v-has-perms="'user:del'"></i>
                </Poptip>
              </template>
            </TableItem>
          </Table>
          <Pagination v-model="page" align="center" @change="pageChange" style="margin-top: 10px;"></Pagination>
        </div>
      </div>
    </div>
    <user-edit ref="userEdit" :show-modal="showModal" @closeModal="closeModal"></user-edit>
  </div>
</template>

<script>
    import userEdit from "./userEdit";

    export default {
        name: "user",
        components: {
            userEdit
        },
        data() {
            return {
                loading: false,
                batchDelete: false,
                total: 0,
                users: [],
                page: {
                    cur: 1,
                    size: 10,
                    total: 0
                },
                showModal: false
            }
        },
        watch: {
            batchDelete: function () {
                this.$refs['userTable'].clearSelection()
            }
        },
        methods: {
            pageChange(value) {
              this.page = value
              this.initUsers()
            },
            editUser(user) {
                this.$refs['userEdit'].setUser(user)
                this.showModal = true
            },
            handleDel() {
                if (this.batchDelete) {
                    let data = this.$refs['userTable'].getSelection()
                    if(data.length > 0) {
                        this.$Confirm('确定删除？', '确认').then(() => {
                            this.deleteUser(data.map(user => user.id).join(','))
                        }).catch(e => {

                        })

                    }else {
                        this.$Message.warn('未选择任何数据')
                    }
                } else {
                    this.batchDelete = true
                }
            },
            deleteUser(userIds) {
                this.$axios.delete(`/rbac/user/${userIds}`).then(res => {
                    this.$Message.success('删除成功')
                    this.batchDelete = false
                    this.initUsers()
                }).catch(e => {
                    this.$Message.error('删除失败')
                })
            },
            closeModal(flag) {
                this.showModal = false
                if (flag) {
                    this.initUsers()
                }
            },
            initUsers() {
                this.loading = true
                this.$axios.get("/rbac/user/bulk", {...this.page}).then(res => {
                    this.users = res.records
                    this.page.total = res.total
                    this.loading = false
                })
            }
        },
        mounted() {
            this.initUsers()
        }
    }
</script>

<style scoped>

</style>
