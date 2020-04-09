import Vue from 'vue'
/* Message导入弹框提示组件 */
import { Button, Form, FormItem, Input, Message, container, header, aside, main, menu, submenu, menuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Pagination, Dialog, Tooltip, MessageBox, Tag, Tree, Select, Option, Cascader, Alert, Tabs, TabPane } from 'element-ui'

Vue.use(Button)/* 注册全局组件 */
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(container)
Vue.use(header)
Vue.use(aside)
Vue.use(main)
Vue.use(menu)
Vue.use(submenu)
Vue.use(menuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
