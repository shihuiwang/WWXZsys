import Vue from 'vue'
import router from './router/index.js'
import App from './App.vue'
import { Button, Menu, Submenu, MenuItem, Dialog, Loading, Table,
	TableColumn, Input, InputNumber, Card, Row, Col, Pagination,
	Form, FormItem, Notification, Message, Upload, Image } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { service } from './utils/request';

Vue.config.productionTip = false;
Vue.prototype.$http = service;
Vue.use(Button);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Dialog);
Vue.use(Loading);
Vue.use(Table);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Upload);
Vue.use(Image);
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

new Vue({
	router,
    render: h => h(App),
}).$mount('#app');
