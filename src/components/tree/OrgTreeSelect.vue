<!--
 * 可选择树
 * @author shenjian
 * @since 2023/08/01
 -->
<template>
  <div class="org-tree-select">
    <el-tree-select :data="tree" v-model="value" :indent="28" check-strictly :render-after-expand="false" node-key="orgCode" style="width: 100%" placeholder="请选择所属机构">
      <template #default="{ node }">
        <span class="custom-tree-node">
           <i v-if="node.isLeaf && node.isLeaf === true" class="iconfont icon-24gl-fileEmpty" ref="icon" style="font-size: 20px; color: #A4B3D6; cursor: pointer; margin-left: 25px"></i>
           <i v-else class="iconfont icon-wenjianjia-guan_folder-close" style="font-size: 20px; color: #EBD47B; cursor: pointer"></i>
          <span style="margin-left: 5px">{{ node.label }}</span>
        </span>
      </template>
    </el-tree-select>
  </div>
</template>
<script>

export default {
  name: 'OrgTreeSelect',
  props: {
    tree: {
      type: Array
    },
    modelValue: {
      type: String
    }
  },
  data() {
    return {
      orgCode: ''
    }
  },
  methods: {
  },
  // 为了父组件绑定v-model使用, 否则formRulers获取不到值报请选择所属机构！
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}

</script>
<style>
.el-tree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  padding: 6px 9px 6px 3px;
}

/* 解决+ -位置变化问题, 不要用//注释，会报错排查了好久 */
.el-tree .el-tree-node__content>.el-tree-node__expand-icon {
  padding: 6px 9px 6px 3px;
}

/* 有子节点 且未展开 */
.el-tree .el-tree-node.is-focusable .el-tree-node__expand-icon:before {
  background: url('../../assets/svg/jia.svg') no-repeat 0 3px;
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  font-size: 16px;
  background-size: 16px;
  padding-right: 18px;
}

/* 有子节点 且已展开 */
.el-tree .is-expanded .el-tree-node__expand-icon.expanded:before {
  background: url('../../assets/svg/jian.svg') no-repeat 0 3px;
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  font-size: 16px;
  background-size: 16px;
  padding-right: 18px;
}
.el-tree-node__expand-icon.is-leaf {
  display: none;
}

</style>