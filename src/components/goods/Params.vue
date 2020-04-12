<template>
  <div>
    <!-- 面包屑 -->
    <Mbx msg1="商品管理" msg2="参数列表"></Mbx>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 警告区 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>

      <!-- 选中商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            size="mini"
            type="primary"
            :disabled=" isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 展示里面的小方块参数（数组） -->
              <template slot-scope="scope">
                <el-tag
                  class="tags"
                  v-for="(item,i) in scope.row.attr_vals"
                  :Key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 编辑与输入框切换 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态属性的按钮 -->
          <el-button
            size="mini"
            type="primary"
            :disabled=" isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 展示里面的小方块参数（数组） -->
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :Key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <!-- 编辑与输入框切换 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑修改参数的对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 编辑修改参数的对话框表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 商品分类列表 */
      catelist: [],
      /* 级联选择框的配置对象 */
      cateProps: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      /* 级联选择框双向绑定到的数组 */
      selectedCateKeys: [],
      /* 被激活的页签的名称 */
      activeName: 'many',
      /* 动态参数的数据 */
      manyTableData: [],
      /* 静态属性的数据 */
      onlyTableData: [],
      /* 控制添加对话框的显示与隐藏 */
      addDialogVisible: false,
      /* 添加参数的表单数据对象 */
      addForm: {
        attr_name: ''
      },
      /* 添加表单验证规则 */
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      /* 控制修改对话框的显示与隐藏 */
      editDialogVisible: false,
      /* 修改表单数据对象 */
      editForm: {},
      /* 修改表单的验证规则 */
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    /* 获取所有商品的分类列表 */
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data /* 数据赋值给carelist列表 */
      console.log(this.catelist)
    },
    /* 级联选择框选中项变化，会触发这个函数 */
    handleChange() {
      this.getParamsData()
    },
    /* tab页签点击事件的处理函数 得到是only或many */
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    /* 获取参数的列表数据 */
    async getParamsData() {
      /*  console.log(this.selectedCateKeys) */
      /* 证明选中的不是三级分类 */
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        /* 如果不是三级分类 就清空数据不允许编辑删除 */
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      /* 证明选中的是三级分类 */
      console.log(this.selectedCateKeys)
      /* 根据所选的id 和当前所处的面板来获取相应的参数 */
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      /* 将得到的字符串数据遍历分隔为数组 方便好展示 */
      /* 三元表达式判断是否为空数组， */
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        /* 输入框与按钮切换 目前是隐藏 */
        ;(item.inputVisible = false),
          /* 输入框中输入的内容 */
          (item.inputValue = '')
      })
      console.log(res.data) /* 选中后拿到的数据*/
      /* 获取的数据先做判断是挂载在动态还是静态 */
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    /* 监听添加对话框的关闭事件 */
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    /* 点击按钮 添加参数 */
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    /* 点击按钮 展示修改的对话框 */
    async showEditDialog(attr_id) {
      /* 查询当前参数的信息 */
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      /* 如果成功获取就把参数给对话框表单 */
      this.editForm = res.data
      this.editDialogVisible = true
    },
    /* 重置修改的表单 */
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    /* 点击按钮 修改参数信息 */
    /* 第一个是分类的id 第二个是参数的id */
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    /* 根据id删除对应的参数 */
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      /* 用户取消了删除的操作 */
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      /* 删除的业务逻辑 */
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      /* 重新获取数据 */
      this.getParamsData()
    },
    /* 文本框失去焦点或按下回车 触发 */
    async handleInputConfirm(row) {
      /*  console.log('ok') */
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      /* 如果没有return 则证明输入的内容做后续处理 */
      /* 将输入框的值赋保存到row.attr_vals 然后将输入框清空并且隐藏 */
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row) /* 调用，将删除操作保存到服务器 */
    },
    /* 将attr_vals的操作保存到服务器 */
    async saveAttrVals(row) {
      /* 向服务器发起请求，数据保存到服务器 */
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
    },

    /* 点击button按钮 显示输入框 */
    showInput(row) {
      row.inputVisible = true
      /* nextTick方法的作用是，当页面元素渲染后才会执行回调函数中的代码 */
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    /* 删除对应的参数 */
    handleClose(i, row) {
      /* 把每一行的vals里的值 删除一个 */
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row) /* 重新调用，删除操作保存到服务器 */
    }
  },
  computed: {
    /* 如果按钮需要被禁用，则返回true,否则返回false */
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    /* 获取分类的id */
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    /* 动态计算标题的文本 看这是显示静态属性还是动态*/
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 10px;
}
.tags {
  margin-right: 10px;
}

.input-new-tag {
  width: 100px;
}
</style>
