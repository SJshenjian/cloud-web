<!--
 * 角色创建
 * @author shenjian
 * @since 2023/08/7
 -->
<template>
  <div class="role-add">
    <el-dialog class="new-dialog"
               v-model="myAddFlag" :width="width" align-center
               title="角色管理 新增" :show-close="false" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item prop="roleId" label="角色编码:">
              <el-input v-model="form.roleId" placeholder="请输入角色编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="roleName" label="角色名称:">
              <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="status" label="使用状态:">
              <el-select v-model="form.status" placeholder="--请选择--" style="width:100%">
                <el-option v-for="item in useStatusList" size="small" :key="item.key" :label="item.label" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="category" label="是否评估机构:">
              <el-select v-model="form.category" placeholder="--请选择--" style="width:100%">
                <el-option v-for="item in categoryList" size="small" :key="item.key" :label="item.label" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item prop="remark" label="备注:">
              <el-input v-model="form.remark" placeholder="请输入备注" type="textarea"></el-input>
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

export default {
  name: 'addRole',
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
    let roleIdValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入角色编码!'))
      } else {
        callback()
      }
    };
    let roleNameValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入角色名称!'))
      } else {
        callback()
      }
    };
    let useStatusValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请选择使用状态!'))
      } else {
        callback()
      }
    };
    return {
      myAddFlag: false,
      form: {
        roleId: '',
        roleName: '',
        remark: '',
        status: '',
        category: ''
      },
      useStatusList: [
        {'key': '1', 'label': '使用'},
        {'key': '0', 'label': '不使用'}
      ],
      categoryList: [
        {'key': '0', 'label': '否'},
        {'key': '1', 'label': '是'}
      ],
      width: this.$isMobileDevice ? '80%' : '50%',
      formRules: {
        roleId: [
          {validator: roleIdValidator, trigger: 'blur', required: true}
        ],
        roleName: [
          {validator: roleNameValidator, trigger: 'blur', required: true}
        ],
        status: [
          {validator: useStatusValidator, trigger: 'change', required: true}
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
  },
  methods: {
    // 取消
    cancel() {
      this.form = {
        roleId: '',
        roleName: '',
        remark: '',
        status: '',
        category: ''
      },
      this.$emit("updateAddFlag", false)
    },
    // 保存
    save (formName) {
      const self = this
      self.$refs[formName].validate(async (valid) => {
        if (valid) {
          self.$http.post('/role/save', self.form, 'apiUrl', {body: 'json'}).then((res) => {
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
