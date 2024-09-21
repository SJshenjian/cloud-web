<!--
 * 菜单尾
 * @author shenjian
 * @since 2023/07/31
 -->
<template>
  <div class="sys-footer">
    <el-tabs
        v-model="editableTabsValue"
        type="card"
        closable
        class="my-tab"
        @tab-remove="removeTab"
        @tab-click="clickTab"
    >
      <el-tab-pane
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>

export default {
  name: 'sysFooter',
  props: {
    menuName: {
      type: String,
      default: ""
    },
    current: {
      type: String,
      default: "patient"
    },
  },
  data() {
    return {
      tabIndex: 2,
      editableTabsValue: '',
      editableTabs: [
        {
          title: '首页',
          name: 'patient',
        }
      ]
    }
  },
  watch: {
    current: {
      handler(newVal, oldVal) {
        if (newVal === '') {
          return
        }
        const tabs = this.editableTabs
        let activeName = this.editableTabsValue
        let flag = true
        tabs.forEach((tab, index) => {
          if (tab.name === newVal) {
            activeName = tab.name
            this.editableTabsValue = activeName
            flag = false
          }
        })
        if (!flag) {
          return
        }
        if (newVal === 'user') {
          this.editableTabs.push({'title': '用户管理', 'name': 'user'})
        } else if (newVal === 'org') {
          this.editableTabs.push({'title': '机构管理', 'name': 'org'})
        } else if (newVal === 'role') {
          this.editableTabs.push({'title': '角色管理', 'name': 'role'})
        } else if (newVal === 'module') {
          this.editableTabs.push({'title': '菜单管理', 'name': 'module'})
        } else if (newVal === 'project') {
          this.editableTabs.push({'title': '项目管理', 'name': 'project'})
        } else if (newVal === 'chat') {
          this.editableTabs.push({'title': 'AI聊天', 'name': 'chat'})
        }
        this.editableTabsValue = newVal
      },
      immediate: true
    },
  },
  methods: {
    clickTab: function(pane, ev) {
      let name = pane.paneName
      this.$emit('updateRouter', name)
    },
    removeTab: function(targetName) {
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.editableTabsValue = activeName
      this.$emit('updateRouter', activeName)
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
    }
  }
}

</script>
<style>
.sys-footer {
  position: fixed!important;
  bottom: 0px!important;
  background-color: #F3F3F3;
  height: 40px;
  width: 100%;
  border: 1px solid #d9d7d7;
}
#tab-patient .el-icon.is-icon-close{
  display: none;
}
.el-tabs__content {
  display: none;
}
.my-tab {
  margin: 0px 20px 1px 20px;
}
</style>
