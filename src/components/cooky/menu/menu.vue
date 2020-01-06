<template>
  <div class="users-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">菜单管理</span>
    </div>
    <div class="h-panel-body">
      <Row>
        <Cell :width="12">
          <DropdownMenu button class="h-btn-primary" @click="trigger" :datas="drowList" v-has-perms="'menu:add'">新增
          </DropdownMenu>
          <Button color="red" @click="handleDel" v-has-perms="'dept:del'">{{isDeleteMode?'删除选中的节点':'删除'}}</Button>
          <Button color="green" v-if="isDeleteMode" @click="isDeleteMode = false">取消选择</Button>
          <Skeleton active loading v-if="!param.datas"></Skeleton>
          <Tree :option="param" ref="menuTree" :toggleOnSelect="false" @select="onMenuTreeSelect" v-else
                style="margin-top: 8px;" :multiple="isDeleteMode" choose-mode="independent"></Tree>
        </Cell>
        <Cell :width="12">
          <Form
            ref="menuForm"
            :validOnChange="true"
            :showErrorTip="true"
            :rules="requireFiled"
            labelPosition="left"
            :labelWidth="100"
            :model="menu"
          >
            <div class="menu-zone" v-if="menu.type==0">
              <FormItem label="菜单名" prop="menuName">
                <input type="text" v-model="menu.menuName"/>
              </FormItem>
              <FormItem label="菜单路径" prop="menuPath">
                <input type="text" v-model="menu.menuPath"/>
              </FormItem>
              <FormItem label="菜单标题" prop="menuTitle">
                <input type="text" v-model="menu.menuTitle"/>
              </FormItem>
              <FormItem label="菜单组件" prop="menuComponent">
                <input type="text" v-model="menu.menuComponent"/>
              </FormItem>
              <FormItem label="菜单图标" prop="icon">
                <input type="text" v-model="menu.icon"/>
              </FormItem>
            </div>
            <div class="button-zone" v-else>
              <FormItem label="按钮名称" prop="menuTitle">
                <input type="text" v-model="menu.menuTitle"/>
              </FormItem>
            </div>
            <FormItem label="菜单类型" prop="type">
              <Radio v-model="menu.type" :datas="menuType" color="green"></Radio>
            </FormItem>
            <FormItem label="权限标识" prop="perms">
              <input type="text" v-model="menu.perms"/>
            </FormItem>
          </Form>
          <Row type="flex" justify="center">
            <Button color="green" @click="editMenu" v-if="menu.id" v-has-perms="'dept:edit'">修改</Button>
            <Button color="green" @click="addMenu" v-else v-has-perms="'menu:add'">新增</Button>
          </Row>
        </Cell>
      </Row>


    </div>
  </div>
</template>

<script>
  export default {
    name: "sys-menu",
    data() {
      return {
        isDeleteMode: false,
        menu: {
          id: '',
          parentId: 0,
          menuName: '',
          menuPath: '',
          menuComponent: '',
          menuTitle: '',
          icon: '',
          type: 0,
          perms: ''
        },
        menuType: {
          0: '菜单',
          1: '按钮'
        },
        requireFiled: {
          required: ['menuName','menuPath','menuComponent','menuTitle']
        },
        param: {
          keyName: 'id',
          parentName: 'parentId',
          titleName: 'menuTitle',
          dataMode: 'list',
          datas: null
        },
        drowList: [
          {title: '新增根节点', key: 'root'}, {title: '新增子节点', key: 'child'}
        ]
      }
    },
    computed: {
      requireFiled() {
        if(this.menu.type===0){
          return {
            required: ['menuName','menuPath','menuComponent','menuTitle']
          }
        }else {
          return {
            required: ['menuTitle']
          }
        }
      }
    },
    methods: {
      handleDel() {
        if (this.isDeleteMode) {
          let menus = this.$refs['menuTree'].getChoose()
          if (menus.length > 0) {
            let ids = menus.map(item => item.id).join(",")
            this.$Confirm('确定删除？', '确认').then(() => {
              this.$axios.delete(`/rbac/menu/${ids}`).then(res => {
                this.isDeleteMode = false
                this.resetMenu()
                this.initMenu()
                this.$Message.success("删除成功")
              }).catch(e => {
                this.$Message.error("删除失败")
              })
            }).catch(() => {

            })

          } else {
            this.$Message.warn("未选择任何菜单")
          }
        } else {
          this.$refs['menuTree'].updateChoose([])
          this.isDeleteMode = true
        }
      },
      onMenuTreeSelect(data) {
        Object.keys(this.menu).forEach(key => {
          this.menu[key] = data[key]
        })
      },
      editMenu() {
        let valid = this.$refs['menuForm'].valid()
        if (valid.result) {
          let oldDept = this.$refs['menuTree'].getSelect()
          if (Object.keys(this.menu).filter(key => this.menu[key] !== oldDept[key]).length) {
            this.$axios.putJson("/rbac/menu", this.menu).then(res => {
              this.resetMenu()
              this.initMenu()
              this.$Message.success("修改成功")
            }).catch(e => {
              this.$Message.error("修改失败")
            })
          } else {
            this.$Message.warn("未检测到修改")
          }
        }
      },
      addMenu() {
        let valid = this.$refs['menuForm'].valid()
        if (valid.result) {
          this.$axios.postJson("/rbac/menu", this.menu).then(res => {
            this.initMenu()
            this.resetMenu()
            this.$Message.success("新增成功")
          }).catch(e => {
            this.$Message.error("新增失败")
          })
        }
      },
      initMenu() {
        this.$axios.get("/rbac/menu/bulk").then(res => {
          this.param.datas = res
          let ids = res.filter(menu => menu.parentId === 0).map(menu => menu.id)
          this.$nextTick(() => {
            this.$refs['menuTree'].expand(ids)
          })
        })
      },
      trigger(code) {
        switch (code) {
          case 'root':
            this.resetMenu()
            break
          case 'child':
            let parent = this.$refs['menuTree'].getSelect()
            if (!parent) {
              this.$Message.warn('请先选择父节点')
              return
            }
            this.resetMenu()
            this.menu.parentId = parent.id
            break
        }
      },
      resetMenu() {
        this.menu = {
          id: '',
          parentId: 0,
          menuName: '',
          menuPath: '',
          menuComponent: '',
          menuTitle: '',
          icon: '',
          type: 0,
          perms: ''
        }
      }
    },
    mounted() {
      this.initMenu()
    }
  }
</script>

<style scoped>

</style>
