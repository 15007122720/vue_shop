<template>
  <div>
    <Mbx msg1="用户管理" msg2="用户列表"></Mbx>
    <!-- 卡片视图区 -->
    <el-card>
      <!--  搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">  <!-- 作用域插槽 -->
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 获取用户列表的参数对象 */
      queryInfo: {
        query: '',
        pagenum: 1 /* 当前页码 */,
        pagesize: 2 /* 每页显示的数据 */
      },
      userlist: [],
      total: 0 /* 总共有多少条 */
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      /* 发起请求获取数据data对象解构 */
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = res.data.users /* 获取的数据赋给空数组 */
      this.total = res.data.total
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
