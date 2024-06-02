<!--
 * 机构创建
 * @author shenjian
 * @since 2023/08/1
 -->
<template>
  <div class="org-add">
    <el-dialog class="new-dialog"
               v-model="myAddFlag" :width="width" align-center
               title="组织机构管理 新增" :show-close="false" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="form" :rules="formRules" ref="form" label-width="120px">
        <el-row>
          <el-col :span="10">
            <el-form-item prop="parentOrgName" label="上级机构名称:">
              <el-input v-model="form.parentName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="orgName" label="机构名称:">
              <el-input v-model="form.orgName" placeholder="请输入机构名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
<!--          <el-col :span="10">
            <el-form-item prop="category" label="是否评估机构:">
              <el-select v-model="form.category" placeholder="&#45;&#45;请选择&#45;&#45;" style="width:100%">
                <el-option size="small" key="0" label="否" value="0"></el-option>
                <el-option size="small" key="1" label="是" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="10">
            <el-form-item prop="sortCode" label="排序码:">
              <el-input v-model="form.sortCode" placeholder="请输入排序码" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="phoneNumber" label="电话:">
              <el-input v-model="form.phoneNumber" placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row>
          <el-col :span="10">
            <el-form-item prop="openTime" label="开通日期:">
              <el-date-picker  v-model="form.openTime" style="width:100%"
                               type="date"
                               placeholder="请选择开通日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="endTime" label="截止日期:">
              <el-date-picker  v-model="form.endTime" style="width:100%"
                               type="date"
                               placeholder="请选择截止日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item prop="address" label="地址:">
              <el-input v-model="form.address" placeholder="请输入地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="20">
            <el-form-item prop="remark" label="描述:">
              <el-input v-model="form.remark" placeholder="请输入描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row>
          <el-col :span="10">
            <el-form-item prop="logo" label="机构LOGO上传:">
              <el-input v-model="form.openTime" placeholder="请选择开通日期" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>-->
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
import {isMobile} from "@/util/validate";

export default {
  name: 'addOrg',
  computed: {
    Check() {
      return Check
    },
    Close() {
      return Close
    }
  },
  props: ['addFlag', 'currentTreeNode'],
  data () {
    let orgNameValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入机构名称!'))
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
    let openTimeValidator = (ruler, value, callback) => {
      if (value === null || value === undefined || value === '') {
        callback(new Error('请选择开通日期'))
      } else {
        callback()
      }
    };
    let endTimeValidator = (ruler, value, callback) => {
      if (value === null || value === undefined || value === '') {
        callback(new Error('请选择截止日期'))
      } else {
        callback()
      }
    };
    let phoneValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback()
      } else if (!isMobile(value)) {
        callback(new Error('电话格式错误，请重新输入!'))
      } else {
        callback()
      }
    };
    return {
      myAddFlag: false,
      form: {
        parentCode: '',
        parentName: '',
        orgName: '',
        sortCode: '',
        remark: '',
        category: '',
        phoneNumber: '',
        openTime: '',
        endTime: '',
        logo: ''
      },
      width: this.$isMobileDevice ? '80%' : '50%',
      formRules: {
        orgName: [
          {validator: orgNameValidator, trigger: 'blur', required: true}
        ],
        sortCode: [
          {validator: sortCodeValidator, trigger: 'blur', required: true}
        ],
        openTime: [
          {validator: openTimeValidator, trigger: ['blur', 'change'], required: true}
        ],
        endTime: [
          {validator: endTimeValidator, trigger: ['blur', 'change'], required: true}
        ],
        phoneNumber: [
          {validator: phoneValidator, trigger: 'blur'}
        ],
      },
    }
  },
  watch: {
    addFlag: {
      handler(newVal, oldVal) {
        this.myAddFlag = newVal
      },
      immediate: true,
    },
    currentTreeNode: {
      handler(newVal, oldVal) {
        this.form.parentName = newVal['label']
        this.form.parentCode = newVal['orgCode']
      },
      immediate: true,
    }
  },
  methods: {
    // 取消
    cancel() {
      this.form = {
        parentCode: '',
        parentName: '',
        orgName: '',
        sortCode: '',
        phoneNumber: '',
        remark: ''
      },
      this.$emit("updateAddFlag", false)
    },
    // 保存
    save (formName) {
      const self = this
      self.$refs[formName].validate(async (valid) => {
        if (valid) {
          self.$http.post('/org/save', self.form, 'apiUrl', {body: 'json'}).then((res) => {
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
