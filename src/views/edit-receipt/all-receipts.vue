<template>
	<Modal
	v-model="viewModal"
	width="1000px"
	title="填写所有房号和水电读数">
		<div class="receipt-module" :style="paper">
			<div class="receipt-head">
				<span class="title">公寓租金收据</span>
				<div class="receipt-number-date">
					<p class="number">No {{receiptId}}</p>
					<p class="date">20{{year}}年{{month}}月{{date}}日</p>
				</div>
			</div>
			<div class="receipt-content">
				<p style="padding-left: 40px;">
					<span>今收到</span>
					<span class="input-span">123</span>
					<span>交来</span>
					<span class="input-span">123</span>
					<span>房(20</span>
					<span class="input-span n2">18</span>
					<span>年</span>
					<span class="input-span n2">7</span>
					<span>月</span>
					<span class="input-span n2">8</span>
					<span>日至20</span>
					<span class="input-span n2">18</span>
					<span>年</span>
					<span class="input-span n2">8</span>
					<span>月</span>
					<span class="input-span n2">8</span>
					<span>日)</span>
				</p>
				<p>
					<span>租金：</span>
					<span class="input-span n2x">123</span>
					<span>管理费：</span>
					<span class="input-span n2"></span>
					<span>卫生费：</span>
					<span class="input-span n2x">123</span>
					<span>网络费：</span>
					<span class="input-span n2x">123</span>
					<span>电梯费：</span>
					<span class="input-span n2"></span>
					<span>其他：</span>
					<span class="input-span n2x"></span>
				</p>
				<p>
					<span>电费：本月读数</span>
					<span class="input-span">123</span>
					<span>上月读数</span>
					<span class="input-span">123</span>
					<span>实际用量</span>
					<span class="input-span">123</span>
					<span>金额</span>
					<span class="input-span">123</span>
					<span>元</span>
				</p>
				<p>
					<span>水费：本月读数</span>
					<span class="input-span">123</span>
					<span>上月读数</span>
					<span class="input-span">123</span>
					<span>实际用量</span>
					<span class="input-span">123</span>
					<span>金额</span>
					<span class="input-span">123</span>
					<span>元</span>
				</p>
				<p>
					<span>合计金额(大写)：</span>
					<span class="money-daxie">
                        <span>{{totalStr}}</span>
                    </span>
				</p>
				<p>
					<span class="seal">收款单位盖章：</span>
					<span class="money-num">￥：<input type="text" v-model="total" class="total"></span>
				</p>
			</div>
			<div class="receipt-foot">
				<span>核准：</span>
				<span>会计：</span>
				<span>记账：</span>
				<span>出纳：</span>
				<span>经手人：王华桥</span>
			</div>
		</div>
		<div slot="footer">
			<Button @click="comfirm">确 定</Button>
		</div>
	</Modal>
</template>

<script>

	let currentDate = new Date();//获取系统当前时间
	let year = currentDate.getFullYear().toString().substring(2,4);
	export default {
		name: "fillHydropowerReads",
		data() {
			return {
				viewModal: false,
				fillValue: '',
				// 设置收据背景图 .paper
				paper: {
					backgroundImage: "url(" + require("../../assets/images/paper.png") + ")",
					backgroundRepeat: "no-repeat",
					backgroundSize: "100% 100%",
				},
				receiptId: '', //收据ID
				tenantInfo: {},
				year: year,
				month: currentDate.getMonth()+1,
				date: currentDate.getDate(),
				totalStr: '',
				total: 0,
			}
		},
		methods: {
			show() {
				this.viewModal = true;
			},
			comfirm() {

			},
		},
		mounted() {
			this.$on('showReceipts', arg => {
				console.log(arg);
				this.show();
			})
		}
	}
</script>

<style scoped>
	.redirect-page {
		position: fixed;
		top: 100px;
		bottom: 0;
		left: 200px;
		right: 0;
		min-width: 900px;
		padding: 50px;
	}
	p {
		margin: 0;
	}
	.receipt-module {
		width: 840px;
		height: 360px;
		margin: 0 auto;
		box-sizing: border-box;
		padding: 0 200px 10px 80px;
		position: relative;
		font-size: 14px;
	}
	.receipt-head {
		position: relative;
		padding: 20px 0;
	}
	.receipt-head .title{
		display: block;
		font-size: 26px;
		font-weight: bold;
		margin: 0 auto;
		text-align: center;
		letter-spacing:9px;
	}
	.receipt-number-date {
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.receipt-content {
		border: 1px solid #000;
		padding: 10px;
		line-height: 32px;
		overflow: hidden;
	}
	.receipt-content p {
		letter-spacing:2px;
	}
	.receipt-content p input,
	.receipt-content p .input-span {
		display: inline-block;
		width: 55px;
		height: 25px;
		color: #495060;
		text-align: center;
		border: none;
		border-bottom: 1px solid #000;
		margin: 0 -4px;
		background: rgba(255,255,255,0);
	}
	.receipt-content p input.n2,
	.receipt-content p .input-span.n2 {
		width: 15px;
	}
	.receipt-content p input.n2x,
	.receipt-content p .input-span.n2x {
		width: 30px;
	}
	.money-daxie {
		display: inline-block;
		letter-spacing:10px;
		padding-left: 40px;
		border-bottom: 1px solid #000;
		width: 350px;
	}
	.seal {
		float: left;
		padding: 5px;
		padding-left: 0;
	}
	.money-num {
		float: right;
		margin-right: 12px;
		padding: 5px;
	}

	.receipt-foot {
		position: absolute;
		bottom: 25px;
		display: flex;
		justify-content: space-between;
		width: 560px;
	}
	.receipt-content p input.total {
		width: 80px;
	}
	.update-pw {
		font-size: 12px;
		background-color: #2d78f4;
		color: #fff;
		padding: 10px;
		text-align: center;
		float: right;
		cursor: pointer;
		margin-right: 10px;
	}
	.btn-area {
		width: 600px;
		margin: 0 auto;
		padding: 0 30px 0 10px;
		box-sizing: border-box;
		overflow: hidden;
	}
	.console-btn {
		position: absolute;
		bottom: 20px;
		left: 20px;
		text-decoration: underline;
		color: #2d78f4;
	}
	.fast-fill {
		position: absolute;
		top: 10px;
		left: 10px;
	}

</style>