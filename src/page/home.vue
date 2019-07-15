<template>
	<div class="home-container">
		<ul class="month-tab">
			<li>{{currentYear}}</li>
			<li v-for="index in 12" :key="index" @click="changeMonth(index)" :class="{active: index === currentMonth}">
				<el-button type="text" :disabled="index > new Date().getMonth() + 1">{{index}}月</el-button>
			</li>
		</ul>
		<el-card class="box-card" v-for="(num, index) in Object.keys(build)" :key="index">
			<div slot="header" class="clearfix">
				<span>{{num}}</span>
			</div>
			<div class="card-content">
				<div class="mini-card">
					<span class="right">收入</span>
					<span class="left">123</span>
				</div>
				<div class="mini-card out">
					<span class="right">支出</span>
					<span class="left">{{build[num]}}</span>
				</div>
				<div class="mini-card sur">
					<span class="right">剩余</span>
					<span class="left">111</span>
				</div>
				<div class="mini-card total" v-if="num === 'E'">
					<span class="right">剩余汇总</span>
					<span class="left">333</span>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: "home",
		data() {
			return {
				build: {
					A: '4000',
					B: '4000',
					C: '4000',
					D: '4000',
					E: '4000',
				},
				currentMonth: new Date().getMonth() + 1,
				currentYear: new Date().getFullYear()
			}
		},
		methods: {
			changeMonth(month) {
				if(month > new Date().getMonth() + 1) return false
				month = month < 10 ? ('0' + month) : (month);
				this.currentMonth = month;
				this.get();
			},
			get() {
				this.loading = true;
				this.$http.post('/historyReceipt/list', {
					page: 1,
					size: 100,
					id: `${this.currentYear}${this.currentMonth}`
				}).then(res => {
					this.loading = false;
					if(res.code === 200) {
						console.log(res.data)
					}
					if(!res.code) return Message.error(res.msg);
				});
			}
		},
		created() {
			this.get();
		}
	}
</script>

<style lang="scss" scoped>
	.home-container {
		height: 100%;
		padding: 10px 20px;
		.month-tab {
			background-color: #fff;
			display: flex;
			align-items: center;
			padding: 5px 10px;
			margin-bottom: 10px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			li {
				width: 80px;
				text-align: center;
				&.active {
					background-color: #409EFF;
				}
			}
		}
		.box-card {
			margin-top: 2px;
			.card-content {
				display: flex;
				position: relative;
				.mini-card {
					width: 300px;
					display: flex;
					height: 70px;
					margin-right: 60px;
					border-top-left-radius: 5px;
					border-top-right-radius: 0px;
					border-bottom-right-radius: 0px;
					border-bottom-left-radius: 5px;
					overflow: hidden;
					border: 1px solid #409EFF;
					.right {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 100px;
						background-color: #409EFF;
						color: #FFF;
					}
					.left {
						display: flex;
						align-items: center;
						justify-content: center;
						flex: 1;
						color: #409EFF;
					}
					&.out {
						border: 1px solid #E6A23C;
						.right {
							background-color: #E6A23C;
						}
						.left {
							color: #E6A23C;
						}
					}
					&.sur {
						border: 1px solid #67C23A;
						.right {
							background-color: #67C23A;
						}
						.left {
							color: #67C23A;
						}
					}
					&.total {
						position: absolute;
						right: 0;
						top: 0;
						border: 1px solid #909399;
						.right {
							background-color: #909399;
						}
						.left {
							color: #909399;
						}
					}
				}
			}
		}
		.el-card__header {
			padding: 10px 20px;
		}
	}
</style>

<style lang="scss">
	.home-container {
		.el-card__header {
			padding: 10px 20px;
		}
		li {
			&.active {
				.el-button--text,
				.el-button--text:focus,
				.el-button--text:hover {
					color: #fff;
				}
			}
		}
	}
</style>