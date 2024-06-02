<!--
 * 用户列表
 * @author shenjian
 * @since 2023/8/8
 -->
<template>
  <div class="user">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="14">
            <el-form :inline="true" style="height: 20px; margin: 20px 20px 20px 20px">
              <el-form-item label="用户姓名:">
                <el-input v-model="query.username" placeholder="请输入用户姓名" clearable></el-input>
              </el-form-item>
              <el-form-item label="登录账号:">
                <el-input v-model="query.account" placeholder="请输入登录账号" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" style="margin-left: 20px;" @click="listData">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 20px 20px 20px">
          <el-col :xs="5" :sm="5" :md="5" :lg="4" :xl="3">
            <el-row style="font-weight: bolder">组织树</el-row>
            <el-row style="margin-top: 10px"><Tree :tree="tree" @updateCurrentTreeNode="updateCurrentTreeNode"></Tree></el-row>
          </el-col>
          <el-col :xs="19" :sm="19" :md="19" :lg="20" :xl="21">
            <el-row>
              <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <span style="font-weight: bolder">用户信息</span>
              </el-col>
              <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" style="float: right;">
                <el-button type="primary" size="small" :icon="Delete" style="margin-left: 20px; float: right" @click="handleDelete">删除</el-button>
                <el-button type="primary" size="small" :icon="Edit" style="margin-left: 20px; float: right" @click="handleEdit">编辑</el-button>
                <el-button type="primary" size="small" :icon="Plus" style="margin-left: 20px; float: right" @click="handleAdd">增加</el-button>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <el-table :data="dataList" @current-change="handleCurrentChange" border highlight-current-row :header-cell-style="setRowClass" :cell-style="{ textAlign: 'center' }" stripe>
                <el-table-column prop="orgName" label="所属机构"> </el-table-column>
                <el-table-column prop="roleName" label="用户角色"></el-table-column>
                <el-table-column prop="username" label="用户姓名"></el-table-column>
                <el-table-column prop="account" label="登录账号"></el-table-column>
                <el-table-column prop="state" label="状态" width="80px">
                  <template v-slot="scope">{{ scope.row.state === '0' ? '启用' : '禁用' }}</template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建日期">
                  <template v-slot="scope">{{ $formatDate(scope.row.createTime, 'yyyy-MM-dd') }}</template>
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
    <add-user v-if="visible.add" :addFlag="visible.add" :currentTreeNode="currentTreeNode" @updateAddFlag="updateAddFlag" @listData="listData"></add-user>
    <edit-user v-if="visible.edit" :editFlag="visible.edit" :currentRow="currentRow" @updateEditFlag="updateEditFlag" @listData="listData"></edit-user>
  </div>
</template>
<script>
import {Delete, Edit, Plus, Search} from "@element-plus/icons-vue";
import Tree from "@/components/tree/Index.vue";
import Pagination from "@/components/pagination/Index.vue";
import AddUser from "@/views/system/user/Add.vue";
import {ElMessageBox} from "element-plus";
import EditUser from "@/views/system/user/Edit.vue";

export default {
  name: 'user',
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
  components: {EditUser, AddUser, Pagination, Tree},
  data() {
    return {
      tree: [],
      dataList: [],
      // 查询条件
      query: {
        username: '',
        account: ''
      },
      // 选中树节点信息
      currentTreeNode: '',
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
    this.listTree()
    this.listData()
  },
  methods: {
    listData(ignoreTree) {
      if (!ignoreTree) {
        this.listTree()
      }
      const self = this
      let orgCode = ''
      if (self.currentTreeNode && self.currentTreeNode['orgCode']) {
        orgCode = self.currentTreeNode['orgCode']
      }
      self.query['orgCode'] = orgCode
      self.query['pageNumber'] = self.page.pageNumber
      self.query['pageSize'] = self.page.pageSize
      self.$http.post('/user/list', self.query, 'apiUrl').then(res => {
        self.dataList = res.records
        self.page.total = res.total
      })
    },
    listTree() {
      const self = this
      self.$http.post('/org/initOrgInfoTree', {}, 'apiUrl').then(res => {
        self.tree = res
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
    updateCurrentTreeNode(val) {
      this.currentTreeNode = val;
      this.listData(true)
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
      ElMessageBox.confirm(
          '确定要删除[' + self.currentRow.username + ']吗?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        self.$http.get('/user/delete', {'userId': self.currentRow.userId}, 'apiUrl', {body: 'json'}).then((res) => {
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
</script>