<template>
	<div id="app">
		<c-menu></c-menu>
		<router-view/>
	</div>
</template>

<script>
import './utils/filter';
import cMenu from './components/cmenu'
export default {
	components: { cMenu }
}
</script>

<style lang="scss">
html, body {
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	background: #f0f0f0;
	overflow: hidden;
}
#app {
	font-family: "微软雅黑";
	height: 100%;
	.el-table .el-table__body-wrapper tr, .el-table .el-table__fixed-body-wrapper tr {
		height: 48px;
	}
	.page-content {
		padding: 20px 10px;
		.el-card {
		}
		.el-card__body {
			overflow-y: scroll;
			max-height: calc(100vh - 200px);
			&::-webkit-scrollbar {
				display:none
			}
		}
	}
	.search-container {
		margin-bottom: 10px;
		.el-input {
			width: 200px;
			margin-right: 10px
		}
	}
}
</style>
