<!--
 * 配置列表
 * @author shenjian
 * @since 2023/08/22
 -->
<template>
  <div class="demo">
    <download-file :file-id="fileId"></download-file>
  </div>
</template>
<script>
import {Delete, Edit, Plus, Search} from "@element-plus/icons-vue";
import Pagination from "@/components/pagination/Index.vue";
import {ElMessageBox} from "element-plus";
import AddConfig from "@/views/system/config/Add.vue";
import EditConfig from "@/views/system/config/Edit.vue";
import DownloadFile from "@/components/downloadFile/Index.vue";

export default {
  name: 'demo',
  components: {DownloadFile},
  data() {
    return {
      fileId: 'test.zip'
    }
  },
  created() {

  },
  methods: {

  }
}
</script>
