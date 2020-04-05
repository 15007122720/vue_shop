<template>
  <!--封装面包屑组件 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{msg1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{msg2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ['msg1', 'msg2'], /* 接受父组件传过来的 */
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
