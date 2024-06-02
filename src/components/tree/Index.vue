<!--
 * 组织树
 * @author shenjian
 * @since 2023/08/01
 -->
<template>
  <div class="tree">
    <el-tree :data="tree" @node-click="handleNodeClick" :indent="20">
      <template #default="{ node }">
        <span class="custom-tree-node">
           <i v-if="node.isLeaf && node.isLeaf === true" class="iconfont icon-24gl-fileEmpty" ref="icon" style="font-size: 20px; color: #A4B3D6; cursor: pointer; margin-left: 25px"></i>
           <i v-else class="iconfont icon-wenjianjia-guan_folder-close" style="font-size: 20px; color: #EBD47B; cursor: pointer"></i>
          <span style="margin-left: 5px">{{ node.label }}</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>
<script>

export default {
  name: 'Tree',
  props: {
    tree: {
      type: Array
    },
  },
  data() {
    return {
      // tree: [
      //   {
      //     label: 'Level one 1',
      //     children: [
      //       {
      //         label: 'Level two 1-1',
      //         children: [
      //           {
      //             label: 'Level three 1-1-1',
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     label: 'Level one 2',
      //     children: [
      //       {
      //         label: 'Level two 2-1',
      //         children: [
      //           {
      //             label: 'Level three 2-1-1',
      //           },
      //         ],
      //       },
      //       {
      //         label: 'Level two 2-2',
      //         children: [
      //           {
      //             label: 'Level three 2-2-1',
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     label: 'Level one 3',
      //     children: [
      //       {
      //         label: 'Level two 3-1',
      //         children: [
      //           {
      //             label: 'Level three 3-1-1',
      //           },
      //         ],
      //       },
      //       {
      //         label: 'Level two 3-2',
      //         children: [
      //           {
      //             label: 'Level three 3-2-1',
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ]
    }
  },
  methods: {
    handleNodeClick(data) {
      this.$emit('updateCurrentTreeNode', data)
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