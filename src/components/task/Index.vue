<template>
  <div class="task">
    <el-row style="margin: 20px">
      <el-table :data="dataList" @current-change="handleCurrentChange" border highlight-current-row :header-cell-style="setRowClass" :cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column prop="taskId" label="任务编号"> </el-table-column>
        <el-table-column prop="taskName" label="任务名称"></el-table-column>
        <el-table-column prop="progress" label="任务进度">
          <template #default="scope">
            <el-progress :percentage="scope.row.progress" :color="progressColor"/>
          </template>
        </el-table-column>
        <el-table-column prop="statusDesc" label="任务状态"></el-table-column>
        <el-table-column prop="createUser" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建日期">
          <template v-slot="scope">{{ $formatDate(scope.row.createTime, 'yyyy-MM-dd') }}</template>
        </el-table-column>
        <el-table-column prop="operate" align="center" label="操作" width="170px">
          <template v-slot="scope">
            <el-button type="primary" size="small" :icon="Download"
                       @click="handleDownload(scope.row)">下载
            </el-button>
          </template>
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
  </div>
</template>
<script>
import {Delete, Download, Edit, Plus, Search} from "@element-plus/icons-vue";
import Pagination from "@/components/pagination/Index.vue";
import baseUrl from "../../util/baseUrl";

export default {
  name: 'task',
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
    },
    Download() {
      return Download
    },
  },
  components: {Pagination},
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
      progressColor: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100},
      ],
      page: {
        pageNumber: 1,
        pageSize: 10,
        total: 10
      },
      importCustomData: false,
      fileUpload: {
        label: '',
        fileList: [],
      },
      url: ''
    }
  },
  created() {
    // 无需跨域，否则无法接收消息, 这个原因浪费我好多时间
    if (process.env.NODE_ENV === 'development') {
      this.url = 'http://127.0.0.1:8080/sse/subscribe?token=' + this.$store.getters.token
    } else {
      this.url = 'https://api-uat.sfxs.com/sse/subscribe?token=' + this.$store.getters.token
    }
    this.listData()
  },
  mounted() {
    this.connect()
  },
  methods: {
    connect () {
      // create the client with the user's config
      const self = this
      let client = self.$sse.create({
        url: this.url,
        includeCredentials: false
      })
      client.on('message', (data) => {
        // eslint-disable-next-line no-empty
        if (data === '<SSE_START>') {

        } else {
          const ret = JSON.parse(data)
          self.dataList.forEach((item, index, arr) => {
            if (ret['taskId'] === item['taskId']) {
              // 更细进度与状态
              self.dataList[index]['progress'] = ret['progress']
              self.dataList[index]['statusDesc'] = ret['statusDesc']
            }
          })
        }
      })

      client.on('error', () => { // eslint-disable-line
        console.log('[error] disconnected, automatically re-attempting connection', 'system')
      })

      // and finally -- try to connect!
      client.connect() // eslint-disable-line
          .then(() => {
            console.log('[info] connected', 'system')
          })
          .catch(() => {
            console.log('[error] failed to connect', 'system')
          })
    },
    listData() {
      const self = this
      self.$http.post('/task/list', self.query, 'apiUrl').then(res => {
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
    handleDownload(row) {
      const self = this
      self.visible.add = true
      window.open(baseUrl.apiUrl + '/download/stream?fileId=' + row.url, "_blank");
    }
  }
}
</script>
