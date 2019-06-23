<template>
	<el-menu :default-active="activeIndex" background-color="#545c64"
	         text-color="#fff" active-text-color="#409EFF"
	         class="el-menu-demo" mode="horizontal" @select="handleSelect">
		<el-menu-item index="/">首页</el-menu-item>
		<el-menu-item index="newReceipt">填写收据</el-menu-item>
		<el-menu-item index="history">历史收据</el-menu-item>
		<el-menu-item index="roomManage">租户管理</el-menu-item>
	</el-menu>
</template>

<script>
	export default {
		name: "cmenu",
		data() {
			return {
				activeIndex: '/'
			};
		},
		methods: {
			handleSelect(key) {
				if(key === '/') key = ''
				this.$router.push({path: '/' + key})
			}
		},
		created() {
			setTimeout(() => {
				const name = this.$route.path.split('/')[1];
				this.activeIndex = name ? name : '/'
			}, 200)
		}
	}
</script>

<style scoped>

</style>