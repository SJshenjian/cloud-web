<!--
 * 配置列表
 * @author shenjian
 * @since 2023/08/22
 -->
<template>
  <div class="config">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="14">
            <el-form :inline="true" style="height: 20px; margin: 20px 20px 20px 20px">
              <el-form-item label="配置编号:">
                <el-input v-model="query.code" placeholder="请输入配置编号" clearable></el-input>
              </el-form-item>
              <el-form-item label="参数名称:">
                <el-input v-model="query.name" placeholder="请输入参数名称" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" style="margin-left: 20px;" @click="listData">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 20px 20px 20px">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-row>
              <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <span style="font-weight: bolder">系统配置管理</span>
              </el-col>
              <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" style="float: right;">
                <el-button type="primary" size="small" :icon="Delete" style="margin-left: 20px; float: right" @click="handleDelete">删除</el-button>
                <el-button type="primary" size="small" :icon="Edit" style="margin-left: 20px; float: right" @click="handleEdit">编辑</el-button>
                <el-button type="primary" size="small" :icon="Plus" style="margin-left: 20px; float: right" @click="handleAdd">增加</el-button>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <el-table :data="dataList" @current-change="handleCurrentChange" border highlight-current-row :header-cell-style="setRowClass" :cell-style="{ textAlign: 'center' }" stripe>
                <el-table-column prop="code" label="配置编号"> </el-table-column>
                <el-table-column prop="orgName" label="机构名称"></el-table-column>
                <el-table-column prop="name" label="参数名称"></el-table-column>
                <el-table-column prop="value" label="参数值"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="sortCode" label="排序"></el-table-column>
                <el-table-column prop="updateTime" label="修改日期">
                  <template v-slot="scope">{{ $formatDate(scope.row.updateTime, 'yyyy-MM-dd') }}</template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row style="float:right; margin-top: 15px;">
              <pagination
                  background
                  @pagination="updatePageInfo"
                  :page-size="page.pageSize"
                  v-model:current-page="page.pageNumber"
                  :total="page.total"
              ></pagination>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
  <div>
    <add-config v-if="visible.add" :addFlag="visible.add" @updateAddFlag="updateAddFlag" @listData="listData"></add-config>
    <edit-config v-if="visible.edit" :editFlag="visible.edit" :currentRow="currentRow" @updateEditFlag="updateEditFlag" @listData="listData"></edit-config>
  </div>
</template>
<script>
import {Delete, Edit, Plus, Search} from "@element-plus/icons-vue";
import Pagination from "@/components/pagination/Index.vue";
import {ElMessageBox} from "element-plus";
import AddConfig from "@/views/system/config/Add.vue";
import EditConfig from "@/views/system/config/Edit.vue";

export default {
  name: 'config',
  computed: {
    Delete() {
      return Delete
    },
    Edit() {
      return Edit
    },
    Plus() {
      return Plus
    },
    Search() {
      return Search
    }
  },
  components: {EditConfig, AddConfig, Pagination},
  data() {
    return {
      tree: [],
      dataList: [],
      // 查询条件
      query: {
        name: '',
      },
      // 表格选中行信息
      currentRow: '',
      visible: {
        add: false,
        edit: false
      },
      page: {
        pageNumber: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  created() {
    this.listData()
  },
  methods: {
    listData() {
      const self = this
      self.query['pageNumber'] = self.page.pageNumber
      self.query['pageSize'] = self.page.pageSize
      self.$http.post('/config/list', self.query, 'apiUrl').then(res => {
        self.dataList = res.records
        self.page.total = res.total
      })
    },
    handleCurrentChange (val) {
      if (val) {
        this.currentRow = val
      }
    },
    setRowClass () {
     return {background: '#F3F3F3', textAlign: 'center', color: 'black'}
    },
    updatePageInfo (data) {
      const self = this
      self.page.pageNumber = data.pageNumber
      self.page.pageSize = data.pageSize
      self.listData()
    },
    // 更新新建对话框展示
    updateAddFlag() {
      this.visible.add = false
    },
    updateEditFlag() {
      this.visible.edit = false
    },
    handleAdd() {
      const self = this
      self.visible.add = true
    },
    handleEdit() {
      const self = this
      if (self.currentRow === '') {
        self.$message.warning('请选择一条需要编辑的数据!')
        return
      }
      self.visible.edit = true
    },
    handleDelete() {
      const self = this
      if (self.currentRow === '') {
        self.$message.warning('请选择需要删除的数据!')
        return
      }
      let deleteFlag = true
      if (deleteFlag) {
        ElMessageBox.confirm(
            '确定要删除[' + self.currentRow.code + ']吗?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
        ).then(() => {
          self.$http.get('/config/delete', {'id': self.currentRow.id}, 'apiUrl', {body: 'json'}).then((res) => {
            if (res === false || res === undefined) {
              return false
            }
            self.$message({
              message: '删除成功!',
              type: 'success'
            })
            this.listData()
          })
        }).catch(() => {
          console.log("")
        })
      }
    }
  }
}
</script>