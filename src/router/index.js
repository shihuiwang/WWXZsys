import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		component: () => import('../page/home.vue')
	},

	{
		path: '/newReceipt',
		component: () => import('../page/receipt/receiptPage.vue')
	},

	{
		path: '/history',
		component: () => import('../page/historyReceipt/index.vue')
	},

	{
		path: '/roomManage',
		component: () => import('../page/roomManage/index.vue'),
	},

	{
		path: '/roomManage/roomEdit',
		component: () => import('../page/roomManage/edit.vue'),
	}

];

const router = new VueRouter({ routes });

export default router