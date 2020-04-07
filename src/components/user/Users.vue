<template>
  <div>
    <Mbx msg1="用户管理" msg2="用户列表"></Mbx>
    <!-- 卡片视图区 -->
    <el-card>
      <!--  搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
          <template slot-scope="scope">
            <!-- 状态 作用域插槽 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--   修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserByID(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 tooltp组件实现文字提示-->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 :visible.sync控制对话框显示与隐藏 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!--  内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    return {
      /* 获取用户列表的参数对象 */
      queryInfo: {
        query: '' /* 查询 */,
        pagenum: 2 /* 当前页码 绑定queryInfo.pagenum */,
        pagesize: 2 /* 每页显示的数据 绑定queryInfo.pagesize */
      },
      userlist: [],
      total: 10 /* 总共有多少条 */,
      /* 控制用户对话框的显示与隐藏 */
      addDialogVisible: false,
      /*  添加用户的表单数据 */
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      /* 验证表单规则 */
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6-15个字符之间',
            trigger: 'blur'
          }
        ] /* trigger指定检验时机 */,
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      /* 控制修改用户对话框的隐藏与显示 */
      editDialogVisible: false,
      editForm: {},
      /* 修改表单的规则对象 */
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
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
      /* console.log(res) */
    },
    /* 监听pagesize 改变的事件 */
    handleSizeChange(newSize) {
      /* console.log(newSize) */
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    /* 监听页码值改变的事件 */
    handleCurrentChange(newPage) {
      /* console.log(newPage) */
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    /* 监听switch开关状态的改变 */
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state /* 更新失败取反保证页码状态不会有变化 */
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    /* 监听添加对话框关闭事件（重置表单信息） */
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    /* 监听编辑对话框关闭事件（清空表单数据） */
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    /* 点击按钮 添加新用户 */
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        /* console.log(valid)得到ture输入合法 */
        if (!valid) return
        /* 如果没被return就可发用户请求了 */
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        /*  隐藏添加用户对话框 */
        this.addDialogVisible = false
        /* 重新获取用户列表数据   b  */
        this.getUserList()
      })
    },
    /* 展示编辑用户的对话框 */
    showEditDialog(row) {
      /*  console.log(id) */
      this.editForm = row
      this.editDialogVisible = true
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        /* console.log(valid)得到ture输入合法 */
        if (!valid) return
        /* 如果没被return就可发用户请求了 */
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        if (res.meta.status !== 200) {
          this.$message.error('编辑用户失败')
        }
        this.$message.success('编辑用户成功')

        /*  隐藏编辑用户对话框 */
        this.editDialogVisible = false
        /* 重新获取用户列表数据   b  */
        this.getUserList()
      })
    },
    /* 根据id删除用户 */
    async removeUserByID(id) {
      /*  console.log(id) */
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(
        err => err
      ) /* console.log(res) 确认删除则返回值为字符串confirm取消为cancel */
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      /* console.log('确认了删除') */
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      /* 获取当前数据和当前页码,然后当数据长度等于1，就让页码做减法 */
      /* console.log(this.userlist, this.queryInfo.pagenum) */
      if (this.queryInfo !== 1) {
        if (this.userlist.length === 1) {
          this.queryInfo.pagenum -= 1
        }
      }

      /* 重新获取用户列表数据   b  */
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
