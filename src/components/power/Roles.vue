<template>
  <div>
    <!-- 面包屑 -->
    <Mbx msg1="权限管理" msg2="角色列表"></Mbx>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleslist" border stripe>
        <!-- 展开页  -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- item代表每个元素，i代表索引 -->
            <el-row
              :class="['bdbottom', i1 ===0 ? 'botop' : '','vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 row指行  col指列 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '': 'bdtop' ,'vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--三级权限  -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--    <pre>
                {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesByID(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户的对话框 :visible.sync控制对话框显示与隐藏 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!--  内容主体区域 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 所有角色列表数据 */
      roleslist: [],
      /* 控制用户对话框的显示与隐藏 */
      addDialogVisible: false,
      /*  添加用户的表单数据 */
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      /* 控制分配角色权限对话框的展示与隐藏 */
      setRightDialogVisible: false,
      rightslist: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defkeys: []
    }
  },
  created() {
    /* 获取所有角色列表数据 */
    this.getRoleslist()
  },
  methods: {
    async getRoleslist() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.console.error('获取失败')
      }
      this.roleslist = res.data
    },
    /* 删除用户 */
    async removeRolesByID(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      /* console.log('确认了删除') */
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getRoleslist()
    },
    /* 监听添加对话框关闭事件（重置表单信息） */
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    } /* 点击按钮 添加新用户 */,
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        /* console.log(valid)得到ture输入合法 */
        if (!valid) return
        /* 如果没被return就可发用户请求了 */
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        /*  隐藏添加用户对话框 */
        this.addDialogVisible = false
        /* 重新获取用户列表数据   b  */
        this.getRoleslist()
      })
    },
    /* 删除角色指定权限 */
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      /* console.log('确认了删除') */
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      /* 刷新数据会关闭 */
      /*  this.getRoleslist()  */ role.children = res.data
    },
    /* 分配权限 */
    async showSetRightDialog(role) {
      /* 获取所有权限的数据 */
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('添加失败')
      }
      this.rightslist = res.data
      /*  console.log(this.rightslist) */

      /* 递归获取三级节点(调用) */
      this.getLeafkeys(role, this.defkeys)

      this.setRightDialogVisible = true
    },
    /* 通过递归获取三级权限id，保存到defkeys数组 */
    getLeafkeys(node, arr) {
      /* 目前node节点不包含children属性则是三级节点 */
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafkeys(item, arr))
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
