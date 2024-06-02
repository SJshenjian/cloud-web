<!--
 * 密码修改
 * @author shenjian
 * @since 2023/07/26
 -->
<template>
<div class="update-password">
  <el-dialog class="new-dialog"
      v-model="myUpdatePasswordFlag"  width="450px"
      title="用户密码修改" :show-close="false" destroy-on-close
      :close-on-click-modal="false">
  <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
    <el-row>
      <el-col>
        <el-form-item prop="originPassword" label="原密码:">
          <el-input v-model="form.originPassword" placeholder="请输入原密码" show-password></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item prop="newPassword" label="新密码:">
          <el-input v-model="form.newPassword" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item prop="confirmPassword" label="重复新密码:">
          <el-input v-model="form.confirmPassword" placeholder="请再次输入新密码" show-password></el-input>
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
import {ElMessageBox} from "element-plus";

export default {
  name: 'updatePassword',
  computed: {
    Check() {
      return Check
    },
    Close() {
      return Close
    }
  },
  props: ['updatePasswordFlag'],
  data () {
    let originPasswordValidator = (ruler, value, callback) => {
       if (this.$isEmpty(value)) {
         callback(new Error('请输入原密码!'))
      } else {
         callback()
      }
    };
    let newPasswordValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入新密码!'))
      } else if (value.length < 6) {
        callback(new Error('新密码最少为6位!'))
      } else {
        callback()
      }
    };
    let confirmPasswordValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请再次输入新密码!'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入的新密码不一致!'))
      } else {
        callback()
      }
    };
    return {
      myUpdatePasswordFlag: false,
      form: {
        originPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      formRules: {
        originPassword: [
          {validator: originPasswordValidator, trigger: ['blur', 'change'], required: true}
        ],
        newPassword: [
          {validator: newPasswordValidator, trigger: ['blur'], required: true}
        ],
        confirmPassword: [
          {validator: confirmPasswordValidator, trigger: ['blur'], required: true}
        ]
      },
    }
  },
  watch: {
    updatePasswordFlag: {
      handler(newVal, oldVal) {
        this.myUpdatePasswordFlag = newVal
      },
      immediate: true
    },
  },
  methods: {
    // 取消
    cancel() {
      this.$emit("updatePasswordFlag", false)
    },
    // 保存
    save (formName) {
      const self = this
      self.$refs[formName].validate(async (valid) => {
        if (valid) {
          self.$http.post('/user/updatePassword', self.form, 'apiUrl', {body: 'json'}).then((res) => {
            if (res) {
              self.$message({
                message: res,
                type: 'success'
              })
              this.cancel()
            }
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
