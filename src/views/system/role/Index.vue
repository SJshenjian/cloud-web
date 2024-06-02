<!--
 * 角色列表
 * @author shenjian
 * @since 2023/08/07
 -->
<template>
  <div class="role">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="14">
            <el-form :inline="true" style="height: 20px; margin: 20px 20px 20px 20px">
              <el-form-item label="角色名称:">
                <el-input v-model="query.roleName" placeholder="请输入角色名称" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" style="margin-left: 20px;" @click="listData">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 20px 20px 20px">
          <el-col :xs="19" :sm="19" :md="19" :lg="20" :xl="21">
            <el-row>
              <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <span style="font-weight: bolder">角色管理</span>
              </el-col>
              <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" style="float: right;">
                <el-button type="primary" size="small" class="iconfont icon-quanxianyuechi-xianxing" style="margin-left: 20px; font-size: 12px; float: right" @click="handleAuth">
                  <span style="margin-left: 4px;">权限分配</span></el-button>
                <el-button type="primary" size="small" :icon="Delete" style="margin-left: 20px; float: right" @click="handleDelete">删除</el-button>
                <el-button type="primary" size="small" :icon="Edit" style="margin-left: 20px; float: right" @click="handleEdit">编辑</el-button>
                <el-button type="primary" size="small" :icon="Plus" style="margin-left: 20px; float: right" @click="handleAdd">增加</el-button>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <el-table :data="dataList" @current-change="handleCurrentChange" border highlight-current-row :header-cell-style="setRowClass" :cell-style="{ textAlign: 'center' }" stripe>
                <el-table-column prop="roleId" label="角色编码"> </el-table-column>
                <el-table-column prop="roleName" label="角色名称"> </el-table-column>
                <el-table-column prop="status" label="状态">
                  <template v-slot="scope">{{ scope.row.status === '0' ? '不使用' : '使用' }}</template>
                </el-table-column>
                <el-table-column prop="category" label="是否评估机构">
                  <template v-slot="scope">{{ scope.row.category === '0' ? '否' : '是' }}</template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
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
          <el-col :xs="5" :sm="5" :md="5" :lg="4" :xl="3">
            <el-row style="font-weight: bolder; margin-left: 20px">菜单树</el-row>
            <el-row style="margin-top: 10px; margin-left: 20px">
              <div class="checkbox-tree">
                <el-tree :data="tree" :indent="50" show-checkbox :default-checked-keys="checkedKeys" node-key="moduleId" ref="tree">
                  <template #default="{ node }">
                    <span class="custom-tree-node">
                       <i v-if="node.isLeaf && node.isLeaf === true" class="iconfont icon-24gl-fileEmpty" ref="icon" style="font-size: 20px; color: #A4B3D6; cursor: pointer;"></i>
                       <i v-else class="iconfont icon-wenjianjia-guan_folder-close" style="font-size: 20px; color: #EBD47B; cursor: pointer"></i>
                      <span style="margin-left: 5px">{{ node.label }}</span>
                    </span>
                  </template>
                </el-tree>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
  <div>
    <add-role v-if="visible.add" :addFlag="visible.add" :currentTreeNode="currentTreeNode" @updateAddFlag="updateAddFlag" @listData="listData"></add-role>
    <edit-role v-if="visible.edit" :editFlag="visible.edit" :currentRow="currentRow" @updateEditFlag="updateEditFlag" @listData="listData"></edit-role>
  </div>
</template>
<script>
import {Delete, Edit, Plus, Search} from "@element-plus/icons-vue";
import Pagination from "@/components/pagination/Index.vue";
import AddRole from "@/views/system/role/Add.vue";
import {ElMessageBox} from "element-plus";
import EditRole from "@/views/system/role/Edit.vue";

export default {
  name: 'role',
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
  components: {EditRole, AddRole, Pagination},
  data() {
    return {
      tree: [],
      dataList: [],
      // 查询条件
      query: {
        roleName: '',
      },
      // 选中树节点信息
      currentTreeNode: '',
      // 表格选中行信息
      currentRow: '',
      visible: {
        add: false,
        edit: false
      },
      checkedKeys: [],
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
    listData(ignoreTree) {
      if (!ignoreTree) {
        this.listTree()
      }
      const self = this
      self.currentRow = ''
      self.query['pageNumber'] = self.page.pageNumber
      self.query['pageSize'] = self.page.pageSize
      self.$http.post('/role/list', self.query, 'apiUrl').then(res => {
        self.dataList = res.records
        self.page.total = res.total
      })
    },
    listTree() {
      const self = this
      self.$http.post('/module/initModuleInfoTree', {}, 'apiUrl').then(res => {
        self.tree = res
      })
    },
    handleCurrentChange (val) {
      if (val) {
        this.currentRow = val
        this.getCheckedKey()
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
    // 权限分配
    handleAuth() {
      const self = this
      if (self.currentRow === '') {
        self.$message.warning('请选择需要分配权限的数据!')
        return
      }
      self.saveRoleAuth()
    },
    getCheckedKey () {
      const self = this
      self.$http.get('/role/getRoleModule', {roleId: self.currentRow.roleId}, 'apiUrl').then(res => {
        if (res === undefined) {
          self.$refs.tree.setCheckedKeys([])
        } else {
          self.$refs.tree.setCheckedKeys(res)
        }
      })
    },
    saveRoleAuth () {
      const self = this
      let keys = self.$refs.tree.getCheckedKeys()
      // 与言语不同，不可以选择父节点否则组件显示存在问题
      // const parentKeys = self.$refs.tree.getHalfCheckedKeys()
      // keys = keys.concat(parentKeys)
      const data = {
        moduleIds: keys,
        roleId: self.currentRow.roleId
      }
      self.$confirm('确认为' + self.currentRow.roleName + '授权吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$http.post('/role/auth', data, 'apiUrl', {body: 'json'}).then((res) => {
          if (res === false || res === undefined) {
            return false
          }
          self.$message({
            message: '授权成功',
            type: 'success'
          })
        })
      }).catch(() => {
        console.log("")
      })
    },
    handleDelete() {
      const self = this
      if (self.currentRow === '') {
        self.$message.warning('请选择需要删除的数据!')
        return
      }
      ElMessageBox.confirm(
          '确定要删除[' + self.currentRow.roleName + ']吗?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        self.$http.get('/role/delete', {'roleId': self.currentRow.roleId}, 'apiUrl', {body: 'json'}).then((res) => {
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
<style>

</style>