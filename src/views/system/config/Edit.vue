<!--
 * 配置编辑
 * @author shenjian
 * @since 2023/08/22
 -->
<template>
  <div class="config-edit">
    <el-dialog class="new-dialog"
               v-model="myEditFlag" :width="width" align-center
               title="系统配置管理 编辑" :show-close="false" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="form" :rules="formRules" ref="form" label-width="150px">
        <el-row>
          <el-col :span="10">
            <el-form-item prop="code" label="配置编号:">
              <el-input v-model="form.code"  placeholder="请输入配置编号" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="orgName" label="所属机构:" required>
              <el-input v-model="form.orgName" placeholder="请选择所属机构" readonly></el-input>
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
import {orgCodeValidator} from "@/util/validate";

export default {
  name: 'editConfig',
  computed: {
    Check() {
      return Check
    },
    Close() {
      return Close
    }
  },
  props: ['editFlag', 'currentRow'],
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
      myEditFlag: false,
      form: {
        code: '',
        orgName: '',
        name: '',
        value: '',
        sortCode: '',
        remark: ''
      },
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
    editFlag: {
      handler(newVal, oldVal) {
        this.myEditFlag = newVal
        const currentRow = JSON.parse(JSON.stringify(this.currentRow))
        this.form = currentRow
      },
      immediate: true,
    },
  },
  methods: {
    // 取消
    cancel() {
      this.form = {
        code: '',
        orgName: '',
        name: '',
        value: '',
        sortCode: '',
        remark: ''
      }
      this.$emit("updateEditFlag", false)
    },
    save (formName) {
      const self = this
      self.$refs[formName].validate(async (valid) => {
        if (valid) {
          self.$http.post('/config/update', self.form, 'apiUrl', {body: 'json'}).then((res) => {
            if (res === false || res === undefined) {
              return false
            }
            self.$message({
              message: '修改成功!',
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
