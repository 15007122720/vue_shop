<template>
  <div>
    <!-- 面包屑 -->
    <Mbx msg1="商品管理" msg2="添加商品"></Mbx>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 警告区 -->
      <el-alert show-icon title="添加商品信息" type="info" :closable="false" center style="height: 50px;"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏切换 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传组件 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
/* 导入lodash  */
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        /* 商品所属的分类数组 */
        goods_cat: [],
        /* 存放图片的数组 */
        pics: [],
        /* 富文本编辑器 */
        goods_introduce: '',
        /* 商品内容的参数（数组）包含动态参数`静态属性 */
        attrs: []
      },
      /* 表单的校验规则 */
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选中商品分类', trigger: 'blur' }
        ]
      },
      /* 商品分类列表 */
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      /* 动态参数列表的数据 */
      manyTableData: [],
      /* 静态属性列表的数据 */
      onlyTableData: [],
      /* 图片地址 */
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      /* 图片的请求头对象 */
      headersObj: { Authorization: window.sessionStorage.getItem('token') },
      /* 图片预览 */
      previewPath: '',
      /* 图片预览显示与隐藏 */
      previewVisible: false
    }
  },
  /* created这个钩子在实例创建完成后发生 可访问data属性 */
  created() {
    this.getCatelist()
  },
  methods: {
    /*获取所有商品分类数据 */
    async getCatelist() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.catelist = res.data
      /* console.log(this.catelist) */
    },
    /* 级联选择器发生改变，会触发这个函数 */
    handleChange() {
      /* 获得选中时的数据 */
      /* console.log(this.addForm.goods_cat) */
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    /*根据条件切换tab栏 */
    /*activeName是即将进入。 oldActiveName是即将离开 */
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
    },
    async tabClicked() {
      /* 等于1证明访问的是动态参数面板 */
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        console.log(res.data)
        /* 对数组进行遍历  （字符串分隔成数组）*/
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    /*触发图片预览事件*/
    handlePreview(file) {
      /*  console.log(file) */ //拿到url
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    /* 触发图片移除事件 */
    handleRemove(file) {
      /* 1获取图片的临时路径 2从pics数组找到索引作比较 3 splice方法 */
      console.log(file)
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      /*  console.log(this.addForm) */
    },
    /* 监听图片上传成功事件 */
    handleSuccess(response) {
      /*  console.log(response) */
      /* 拼接得到一个图片对象pic是文档里的值 */
      const picInfo = { pic: response.data.tmp_path }
      /*  console.log(picInfo)  */
      /* 把得到的图片信息对象push到数组里去 */
      this.addForm.pics.push(picInfo)
      /* console.log(this.addForm) */
    },
    /* 添加商品(商品内容) */
    add() {
      /* console.log(this.addForm) */
      /* 先填写表单项才能填写商品内容 */
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入必要的表单项')
        }
        /* 因为级联选择器需要数组， 而商品内容需要字符串所以需要分割成字符串 */
        /* 执行业务逻辑 先深拷贝 再将数组转为字符串 这样两个不会干扰  */
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        /* 处理动态属性 */
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        /* 处理静态属性 */
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs /* 拿到字符串 */
        /* console.log(form) */ /* 发起请求添加商品  商品名称必须是唯一的  提交数据对象是form表单*/
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        /* 编程式导航 跳转到 */

        this.$router.push('/goods')
      })
    }
  },
  /* 计算属性 */
  computed: {
    cateId() {
      /* 如果得到的数组包含三级分类   没有就为空 */
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>
