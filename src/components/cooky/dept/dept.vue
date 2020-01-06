<template>
  <div class="frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">部门管理</span>
    </div>
    <div class="h-panel-body">
      <Row>
        <Cell :width="12">
          <DropdownMenu button class="h-btn-primary" @click="trigger" :datas="drowList" v-has-perms="'dept:add'">新增
          </DropdownMenu>
          <Button color="red" @click="handleDel" v-has-perms="'dept:del'">{{isDeleteMode?'删除选中的节点':'删除'}}</Button>
          <Button color="green" v-if="isDeleteMode"
                  @click="isDeleteMode = false && this.$refs.deptTree.updateChoose([])">取消选择
          </Button>
          <Skeleton active loading v-if="!param.datas"></Skeleton>
          <Tree :option="param" ref="deptTree" :toggleOnSelect="false" @select="onDeptTreeSelect"
                :multiple="isDeleteMode" choose-mode="independent" v-else style="margin-top: 8px;"></Tree>
        </Cell>
        <Cell :width="12">
          <Form
            ref="deptForm"
            labelPosition="left"
            :validOnChange="true"
            :showErrorTip="true"
            :rules="requireFiled"
            :labelWidth="100"
            :model="dept"
          >
            <FormItem label="部门名" prop="deptName">
              <input type="text" v-model="dept.deptName"/>
            </FormItem>
            <FormItem label="部门描述" prop="describe">
              <input type="text" v-model="dept.describe"/>
            </FormItem>
          </Form>
          <Row type="flex" justify="center">
            <Button color="green" @click="editDept" v-if="dept.id" v-has-perms="'dept:edit'">修改</Button>
            <Button color="green" @click="addDept" v-else v-has-perms="'dept:add'">新增</Button>
          </Row>
        </Cell>
      </Row>


    </div>
  </div>
</template>

<script>
  export default {
    name: "dept",
    data() {
      return {
        isDeleteMode: false,
        requireFiled: {
          required: ['deptName']
        },
        dept: {
          id: '',
          parentId: 0,
          deptName: '',
          describe: ''
        },
        param: {
          keyName: 'id',
          parentName: 'parentId',
          titleName: 'deptName',
          dataMode: 'list',
          datas: null
        },
        drowList: [
          {title: '新增根节点', key: 'root'}, {title: '新增子节点', key: 'child'}
        ]
      }
    },
    methods: {
      initDepts() {
        this.$axios.get("/rbac/dept/bulk").then(res => {
          this.param.datas = res
          let ids = res.filter(dept => dept.parentId === 0).map(dept => dept.id)
          this.$nextTick(() => {
            this.$refs['deptTree'].expand(ids)
          })
        })
      },
      handleDel() {
        if (this.isDeleteMode) {
          let depts = this.$refs['deptTree'].getChoose()
          if (depts.length > 0) {
            let ids = depts.map(item => item.id).join(",")
            this.$Confirm('确定删除？', '确认').then(() => {
              this.$axios.delete(`/rbac/dept/${ids}`).then(res => {
                this.isDeleteMode = false
                this.resetDept()
                this.initDepts()
                this.$Message.success("删除成功")
              }).catch(e => {
                this.$Message.error("删除失败")
              })
            }).catch(() => {

            })

          } else {
            this.$Message.warn("未选择任何部门")
          }
        } else {
          this.isDeleteMode = true
        }
      },
      editDept() {
        let valid = this.$refs['deptForm'].valid()
        if(valid.result){
          let oldDept = this.$refs['deptTree'].getSelect()
          if (Object.keys(this.dept).filter(key => this.dept[key] !== oldDept[key]).length) {
            this.$axios.putJson("/rbac/dept", this.dept).then(res => {
              this.initDepts()
              this.resetDept()
              this.$Message.success("修改成功")
            }).catch(e => {
              this.$Message.fail("修改失败")
            })
          } else {
            this.$Message.warn("未检测到修改")
          }
        }
      },
      addDept() {
        let valid = this.$refs['deptForm'].valid()
        if(valid.result){
          this.$axios.postJson("/rbac/dept", this.dept).then(res => {
            this.initDepts()
            this.$Message.success("新增成功")
          }).catch(e => {
            this.$Message.error("新增失败")
          })
        }
      },
      trigger(code) {
        switch (code) {
          case 'root':
            this.resetDept()
            break
          case 'child':
            let parent = this.$refs['deptTree'].getSelect()
            if (!parent) {
              this.$Message.warn('请先选择父节点')
              return
            }
            this.resetDept()
            this.dept.parentId = parent.id
            break
        }
      },
      resetDept() {
        this.dept = {
          id: '',
          parentId: 0,
          deptName: '',
          describe: ''
        }
      },
      onDeptTreeSelect(data) {
        Object.keys(this.dept).forEach(key => {
          this.dept[key] = data[key]
        })
      }
    },
    mounted() {
      this.initDepts()
    }
  }
</script>

<style>
</style>
