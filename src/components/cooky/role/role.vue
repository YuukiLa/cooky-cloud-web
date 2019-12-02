<template>
  <div class="frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">角色管理</span>
    </div>
    <div class="h-panel-body">
      <div class="authorization-frame">
        <div style="margin-bottom: 10px;">
          <Button color="green" @click="showModal = true" v-has-perms="'role:add'">新增</Button>
          <Button :color="batchDelete?'red':'primary'" @click="handleDel" v-has-perms="'role:del'">{{batchDelete?'删除选中的数据':'批量删除'}}</Button>
          <Button @click="batchDelete = false" v-if="batchDelete">取消选择</Button>
        </div>
      </div>
      <div>
        <Table ref="roleTable" :datas="roles" :border="true" :stripe="true" :checkbox="batchDelete" :loading="loading">
          <TableItem title="id" prop="id"></TableItem>
          <TableItem title="角色名" prop="roleName"></TableItem>
          <TableItem title="描述" prop="describe"></TableItem>
          <TableItem title="创建时间" prop="ct"></TableItem>
          <TableItem title="修改时间" prop="mt"></TableItem>
          <TableItem title="操作">
            <template slot-scope="{data}">
              <Button size="s" color="yellow" @click="editRole(data)" v-margin="4" v-has-perms="'role:edit'">编辑</Button>
              <Poptip content="是否删除？" @confirm="deleteRole(data.id)">
                <Button size="s" color="red" v-margin="4" v-has-perms="'role:del'">删除</Button>
              </Poptip>
            </template>
          </TableItem>
        </Table>
      </div>
      <Pagination v-model="page" align="center"  @change="pageChange" style="margin-top: 10px;"></Pagination>
    </div>
    <role-edit ref="roleEdit" :showModal="showModal" @closeModal="closeModal"></role-edit>
  </div>
</template>

<script>
    import roleEdit from "./roleEdit";

    export default {
        name: "role",
        components: {
            roleEdit
        },
        data() {
            return {
                loading: false,
                batchDelete: false,
                roles: [],
                page: {
                    cur: 1,
                    size: 10,
                    total: 0,
                },
                showModal: false
            }
        },
        watch: {
          batchDelete: function () {
              this.$refs['roleTable'].clearSelection()
          }
        },
        methods: {
            editRole(role) {
                this.$refs['roleEdit'].setRole(role)
                this.showModal = true
            },
            pageChange(value) {
                // this.page.cur = value.cur
                // this.page.size = value.size
                this.page = value
                this.initRoles()
            },
            handleDel() {
                if (this.batchDelete) {
                    let data = this.$refs['roleTable'].getSelection()
                    if(data.length > 0) {
                        this.$Confirm('确定删除？', '确认').then(() => {
                            this.deleteRole(data.map(role => role.id).join(','))
                        }).catch(e => {

                        })

                    }else {
                        this.$Message.warn('未选择任何数据')
                    }
                } else {
                    this.batchDelete = true
                }
            },
            deleteRole(roleIds) {
                this.$axios.delete(`/rbac/role/${roleIds}`).then(res => {
                    this.$Message.success('删除成功')
                    this.batchDelete = false
                    this.initRoles()
                }).catch(e => {
                    this.$Message.error('删除失败')
                })
            },
            closeModal(flag) {
                this.showModal = false
                if (flag) {
                    this.initRoles()
                }
            },
            initRoles() {
                this.loading = true
                this.$axios.get("/rbac/role/bulk", {...this.page}).then(res => {
                    this.roles = res.records
                    this.page.total = res.total
                    this.loading = false
                })
            }
        },
        mounted() {
            this.initRoles()
        }
    }
</script>

<style scoped>

</style>
