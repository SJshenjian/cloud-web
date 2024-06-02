<template>
  <div class="pagination">
    <el-pagination
      :background="background"
      current-page="pageNumber"
      :page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :hide-on-single-page="hide"
    />
  </div>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    total: {
      required: true,
      type: Number,
    },
    pageNumber: {
      type: Number,
      default: 1,
    },
    hide: {
      type: Boolean,
      default: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default: function () {
        return [5, 10, 20, 50]
      },
    },
    layout: {
      type: String,
      default: 'prev, pager, next, jumper, sizes, total',
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { pageNumber: this.currentPage, pageSize: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { pageNumber: val, pageSize: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
  }
}
</script>

<style scoped></style>
