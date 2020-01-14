<template>
    <div>
      <div class="frame-page h-panel">
        <div class="h-panel-bar">
          <span class="h-panel-title">excel导入导出测试</span>
        </div>
        <div class="h-panel-body">
          <div class="authorization-frame">
            <div style="margin-bottom: 10px;">
              <input type="file" @change="fileSelected" name="file" ref="file" v-show="false">
              <Button color="green" @click="importExcel">导入</Button>
              <Button color="blue" @click="exportExcel">导出</Button>
              <Button color="yellow" @click="downloadTemplate">下载模板</Button>
            </div>
          </div>
          <div>
            <Table ref="roleTable" :datas="excels" :border="true" :stripe="true" :loading="loading">
              <TableItem title="字符串字段" prop="stringFiled"></TableItem>
              <TableItem title="数字字段" prop="numberFiled"></TableItem>
              <TableItem title="时间字段" prop="dateFiled"></TableItem>
            </Table>
            <Pagination v-model="page" align="center"  @change="pageChange" style="margin-top: 10px;"></Pagination>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "excel",
      data() {
        return {
          loading: false,
          excels: [],
          file: null,
          page: {
            cur: 1,
            size: 10,
            total: 0,
          }
        }
      },
      methods: {
        initExcels() {
          this.loading = true
          this.$axios.get('/rbac/Excel/',{...this.page}).then(res => {
            this.excels = res.records
            this.page.total = res.total
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        },
        fileSelected(e) {
          this.file = e.target.files[0]
          let formData = new FormData()
          formData.append("file",this.file,this.file.name)
          this.$axios.upload("/rbac/Excel/import",formData).then(res => {
            if(res.code===200){
              this.$Message.success(`导入${res.data.data.length}条数据成功，用时${res.data.time}`)
              this.initExcels()
            }else {
              this.file = null
              this.$Message.error("导入失败")
            }
          }).catch(e => {
            this.file = null
            this.$Message.error("导入失败")
          })
        },
        exportExcel() {
          this.$axios.download("/rbac/Excel/excel",{...this.page},`导出-${new Date().getTime()}.xlsx`)
        },
        downloadTemplate() {
          this.$axios.download("/rbac/Excel/template",{},"模板.xlsx")
        },
        importExcel() {
          this.$refs['file'].click()
        },
        pageChange(page) {
          this.page = page
          this.initExcels()
        }
      },
      mounted() {
        this.initExcels()
      }
    }
</script>

<style scoped>

</style>
