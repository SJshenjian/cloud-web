<!--
 * 用户创建
 * @author shenjian
 * @since 2023/08/8
 -->
<template>
  <div class="user-add">
    <el-dialog class="new-dialog"
               v-model="myAddFlag" :width="width" align-center
               title="用户管理 新增" :show-close="false" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item prop="orgCode" label="所属机构:">
              <OrgTreeSelect v-model="form.orgCode" :tree="tree" style="width: 100%"></OrgTreeSelect>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="username" label="用户姓名:">
              <el-input v-model="form.username" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="account" label="登录帐号:">
              <el-input v-model="form.account" placeholder="请输入登录帐号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="phoneNumber" label="手机号码:">
              <el-input v-model="form.phoneNumber" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="roleId" label="用户角色:">
              <el-select v-model="form.roleId" placeholder="请选择用户角色" style="width:100%">
                <el-option v-for="item in roleList" size="small" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="employeeNumber" label="工号:">
              <el-input v-model="form.employeeNumber" placeholder="请输入工号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="department" label="科室:">
              <el-input v-model="form.department" placeholder="请输入科室"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="title" label="职称:">
              <el-input v-model="form.title" placeholder="请输入职称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item prop="state" label="状态:" required>
              <el-radio-group v-model="form.state"  style="width:100%">
                <el-radio :label="'0'">启用</el-radio>
                <el-radio :label="'1'">禁用</el-radio>
              </el-radio-group>
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
import {isMobile} from "@/util/validate";
import OrgTreeSelect from "@/components/tree/OrgTreeSelect.vue";
import {ElMessageBox} from "element-plus";

export default {
  name: 'addUser',
  components: {OrgTreeSelect},
  computed: {
    Check() {
      return Check
    },
    Close() {
      return Close
    }
  },
  props: ['addFlag', 'currentTreeNode'],
  created() {
    this.listTree()
    this.listRole()
  },
  data () {
    let orgCodeValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请选择所属机构!'))
      } else {
        callback()
      }
    };
    let roleIdValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请选择用户角色!'))
      } else {
        callback()
      }
    };
    let usernameValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入用户姓名!'))
      } else {
        callback()
      }
    };
    let accountValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入登录账号!'))
      } else {
        callback()
      }
    };
    let phoneValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入手机号码!'))
      } else if (!isMobile(value)) {
        callback(new Error('手机号码格式错误，请重新输入!'))
      } else {
        callback()
      }
    };
    return {
      myAddFlag: false,
      roleList: [],
      tree: [],
      form: {
        orgCode: '',
        username: '',
        account: '',
        phoneNumber: '',
        roleId: '',
        employeeNumber: '',
        department: '',
        title: '',
        state: '0'
      },
      width: this.$isMobileDevice ? '80%' : '50%',
      formRules: {
        orgCode: [
          {validator: orgCodeValidator, trigger: ['blur', 'change'], required: true}
        ],
        username: [
          {validator: usernameValidator, trigger: 'blur', required: true}
        ],
        account: [
          {validator: accountValidator, trigger: 'blur', required: true}
        ],
        roleId: [
          {validator: roleIdValidator, trigger: ['blur', 'change'], required: true}
        ],
        phoneNumber: [
          {validator: phoneValidator, trigger: 'blur', required: true}
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
        this.form.parentCode = newVal['userCode']
      },
      immediate: true,
    }
  },
  methods: {
    // 取消
    cancel() {
      this.form = {
        orgCode: '',
        username: '',
        account: '',
        phoneNumber: '',
        roleId: '',
        employeeNumber: '',
        department: '',
        title: '',
        state: '0'
      },
      this.$emit("updateAddFlag", false)
    },
    listRole() {
      const self = this
      self.$http.post('/role/list', {pageNumber: 1, pageSize: 30}, 'apiUrl').then(res => {
        self.roleList = res.records
      })
    },
    listTree() {
      const self = this
      self.$http.post('/org/initOrgInfoTree', {}, 'apiUrl').then(res => {
        self.tree = res
      })
    },
    updateCurrentTreeNode(val) {
      this.form.orgCode = val.orgCode
    },
    // 保存
    save (formName) {
      const self = this
      self.$refs[formName].validate(async (valid) => {
        if (valid) {
          self.$http.post('/user/save', self.form, 'apiUrl', {body: 'json'}).then((res) => {
            if (res === false || res === undefined) {
              return false
            }
            ElMessageBox.alert(res, '提示', {
              confirmButtonText: '确认',
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
