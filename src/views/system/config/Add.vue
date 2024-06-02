<!--
 * 配置创建
 * @author shenjian
 * @since 2023/08/22
 -->
<template>
  <div class="config-add">
    <el-dialog class="new-dialog"
               v-model="myAddFlag" :width="width" align-center
               title="系统配置管理 新增" :show-close="false" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="form" :rules="formRules" ref="form" label-width="150px">
        <el-row>
          <el-col :span="10">
            <el-form-item prop="code" label="配置编号:">
              <el-input v-model="form.code"  placeholder="请输入配置编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="orgCode" label="所属机构:">
              <OrgTreeSelect v-model="form.orgCode" :tree="tree" style="width: 100%"></OrgTreeSelect>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="name" label="参数名称:">
              <el-input v-model="form.name" placeholder="请输入参数名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="value" label="参数值:">
              <el-input v-model="form.value" placeholder="请输入参数值"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="sortCode" label="排序码:">
              <el-input v-model="form.sortCode" placeholder="请输入排序码" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="remark" label="备注:">
              <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button :icon="Close" @click="cancel">取消</el-button>
        <el-button type="primary" :icon="Check" @click="save('form')">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {Check, Close} from "@element-plus/icons-vue";
import OrgTreeSelect from "@/components/tree/OrgTreeSelect.vue";
import {orgCodeValidator} from "@/util/validate";

export default {
  name: 'addConfig',
  components: {OrgTreeSelect},
  computed: {
    Check() {
      return Check
    },
    Close() {
      return Close
    }
  },
  props: ['addFlag'],
  data () {
    let codeValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入配置编号!'))
      } else {
        callback()
      }
    };
    let nameValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入参数名称!'))
      } else {
        callback()
      }
    };
    let valueValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入参数值!'))
      } else {
        callback()
      }
    };
    let sortCodeValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入排序码!'))
      } else {
        callback()
      }
    };
    return {
      myAddFlag: false,
      form: {
        code: '',
        orgCode: '',
        name: '',
        value: '',
        sortCode: '',
        remark: ''
      },
      tree: [],
      width: this.$isMobileDevice ? '80%' : '50%',
      formRules: {
        code: [
          {validator: codeValidator, trigger: 'blur', required: true}
        ],
        orgCode: [
          {validator: orgCodeValidator, trigger: ['blur', 'change'], required: true}
        ],
        name: [
          {validator: nameValidator, trigger: 'blur', required: true}
        ],
        value: [
          {validator: valueValidator, trigger: 'blur', required: true}
        ],
        sortCode: [
          {validator: sortCodeValidator, trigger: 'blur', required: true}
        ]
      },
    }
  },
  watch: {
    addFlag: {
      handler(newVal, oldVal) {
        this.myAddFlag = newVal
      },
      immediate: true,
    }
  },
  created() {
    this.listTree()
  },
  methods: {
    // 取消
    cancel() {
      this.form = {
        code: '',
        orgCode: '',
        name: '',
        value: '',
        sortCode: '',
        remark: ''
      }
      this.$emit("updateAddFlag", false)
    },
    listTree() {
      const self = this
      self.$http.post('/org/initOrgInfoTree', {}, 'apiUrl').then(res => {
        self.tree = res
      })
    },
    // 保存
    save (formName) {
      const self = this
      self.$refs[formName].validate(async (valid) => {
        if (valid) {
          self.$http.post('/config/save', self.form, 'apiUrl', {body: 'json'}).then((res) => {
            if (res === false || res === undefined) {
              return false
            }
            self.$message({
              message: '新增成功!',
              type: 'success'
            })
            this.cancel()
            this.$emit('listData', '')
          })
        }
      })
    }
  }
}
</script>

<style>
.new-dialog .el-dialog__footer {
  background-color: #daebfb;
  padding-bottom: 10px;
}
.new-dialog .el-dialog__title {
  color: white
}

.new-dialog .el-dialog__header {
  background-color: #132EBE;
  margin-right: 0px;
}

</style>
