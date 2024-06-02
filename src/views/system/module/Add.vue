<!--
 * 菜单创建
 * @author shenjian
 * @since 2023/08/2
 -->
<template>
  <div class="module-add">
    <el-dialog class="new-dialog"
               v-model="myAddFlag" :width="width" align-center
               title="菜单信息管理 新增" :show-close="false" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="form" :rules="formRules" ref="form" label-width="150px">
        <el-row>
          <el-col :span="10">
            <el-form-item prop="moduleCode" label="菜单资源编码:">
              <el-input v-model="form.moduleCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="moduleName" label="菜单名称:">
              <el-input v-model="form.moduleName" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="moduleUrl" label="菜单URL:">
              <el-input v-model="form.moduleUrl" placeholder="请输入菜单URL"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="parentModuleName" label="上级菜单名称:">
              <el-input v-model="form.parentName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="useStatus" label="使用状态:">
              <el-select v-model="form.useStatus" placeholder="--请选择--" style="width:100%">
                <el-option v-for="item in useStatusList" size="small" :key="item.key" :label="item.label" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="sortCode" label="显示顺序:">
              <el-input v-model="form.sortCode" placeholder="请输入显示顺序" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="isDisplay" label="是否在菜单组显示:">
              <el-radio-group v-model="form.isDisplay" style="width: 100%">
                <el-radio :label="'0'">不显示</el-radio>
                <el-radio :label="'1'">显示</el-radio>
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

export default {
  name: 'addModule',
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
    let moduleCodeValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入菜单资源编码!'))
      } else {
        callback()
      }
    };
    let moduleNameValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入菜单名称!'))
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
    let sortCodeValidator = (ruler, value, callback) => {
      if (this.$isEmpty(value)) {
        callback(new Error('请输入显示顺序!'))
      } else {
        callback()
      }
    };
    return {
      myAddFlag: false,
      form: {
        parentId: '',
        parentName: '',
        moduleUrl: '',
        moduleName: '',
        sortCode: '',
        useStatus: '',
        isDisplay: '0'
      },
      useStatusList: [
        {'key': '1', 'label': '使用'},
        {'key': '0', 'label': '不使用'}
      ],
      width: this.$isMobileDevice ? '80%' : '50%',
      formRules: {
        moduleCode: [
          {validator: moduleCodeValidator, trigger: 'blur', required: true}
        ],
        moduleName: [
          {validator: moduleNameValidator, trigger: 'blur', required: true}
        ],
        useStatus: [
          {validator: useStatusValidator, trigger: 'change', required: true}
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
    },
    currentTreeNode: {
      handler(newVal, oldVal) {
        this.form.parentName = newVal['label']
        this.form.parentId = newVal['moduleId']
      },
      immediate: true,
    }
  },
  methods: {
    // 取消
    cancel() {
      this.form = {
        parentId: '',
        parentName: '',
        moduleUrl: '',
        moduleName: '',
        sortCode: '',
        useStatus: '',
        isDisplay: '0'
      }
      this.$emit("updateAddFlag", false)
    },
    // 保存
    save (formName) {
      const self = this
      self.$refs[formName].validate(async (valid) => {
        if (valid) {
          self.$http.post('/module/save', self.form, 'apiUrl', {body: 'json'}).then((res) => {
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

</style>
