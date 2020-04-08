<template>
  <div>
    <!-- 面包屑 -->
    <Mbx msg1="商品管理" msg2="商品分类"></Mbx>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :show-row-hover="false"
        show-index
        index-text="#"
        border
        :selection-type="false"
        :expand-type="false"
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 3, 5, 7]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
      <!-- 添加分类的表单  -->
      <el-form
        ref="addCateFormRef"
        :rules="addCateFormRules"
        :model="addCateForm"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:"></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 查询条件 */
      querInfo: {
        type: 3 /* 级别分类 */,
        pagenum: 1 /* 当前页码 */,
        pagesize: 5 /* 每条显示的数据 */
      },
      /* 商品分类列表 */
      catelist: [],
      /* 总数据条数 */
      total: 0,
      /* 为table表格指定列的定义 */
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          /* 表示将当前列，定为模板 */
          type: 'template',
          /* 这一列使用模板名称 */
          template: 'isok'
        },
        {
          label: '排序',
          /* 表示将当前列，定为模板 */
          type: 'template',
          /* 这一列使用模板名称 */
          template: 'order'
        },
        {
          label: '操作',
          /* 表示将当前列，定为模板 */
          type: 'template',
          /* 这一列使用模板名称 */
          template: 'opt'
        }
      ],
      /* 添加分类对话框显示与隐藏 */
      addCateDialogVisible: false,
      /* 添加分类的表单数据对象 */
      addCateForm: {
        /* 分类的名称 */
        cat_name: '',
        /* 分类的id */
        cat_pid: 0,
        /* 分类的等级 */
        cat_level: 0
      },
      /* 添加分类表单的验证规则 */
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      /* 父级分类的列表 */
      parentCateList: []
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    /* 获取商品分类数据 */
    async getCatelist() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.console.error('获取商品分类失败')
      }
      console.log(res.data)
      /*  把数据赋值给catelist商品分类列表 */
      this.catelist = res.data.result
      /* 为总数据条数total赋值 */
      this.total = res.data.total
    },
    /* 监听pagesize改变 (每条显示的数据) */
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCatelist()
    },
    /* 监听pagenum改变(当前页) */
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCatelist()
    },
    /* 点击按钮展示添加分类的对话框 */
    showAddCateDialog() {
      /* 先获取父级数据列表 */
      this.getparentCateList()
      /* 再展示对话框 */
      this.addCateDialogVisible = true
    },
    /* 添加父级分类的数据列表 */
    async getparentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级数据失败')
      }
      /* console.log(res.data) */
      this.parentCateList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>
