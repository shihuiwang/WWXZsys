<template>
	<el-dialog
	:visible.sync="viewModal"
	width="1000px"
	:close-on-click-modal="false"
	:close-on-press-escape="false"
	:before-close="handleClose"
	title="填写所有房号和水电读数">
		<div id="receipt-container" style="padding: 20px 0">
			<div class="receipt-module" :id="'img' + item.id" v-for="(item, index) in allReceiptData" :key="index">
				<img :src="require('../../assets/images/item-bgimg.png')" alt="" class="item-bgimg">
				<div class="receipt-head">
					<span class="title">公寓租金收据</span>
					<div class="receipt-number-date">
						<p class="number">No {{item.id}}</p>
						<p class="date">20{{year}}年{{month}}月{{date}}日</p> 
					</div>
				</div>
				<div class="receipt-content">
					<p style="padding-left: 40px;">
						<span>今收到</span>
						<span class="input-span n1">{{item.tenant}}<input type="text" v-model="changeData.tenant" v-if="item.isEdit"></span>
						<span>交来</span>
						<span class="input-span n1">{{item.roomNumber}}<input type="text" v-model="changeData.roomNumber" v-if="item.isEdit"></span>
						<span>房(20</span>
						<span class="input-span n2">{{item.year || year}}<input type="text" v-model="changeData.year" v-if="item.isEdit"></span>
						<span>年</span>
						<span class="input-span n2">{{item.month || month}}<input type="text" v-model="changeData.month" v-if="item.isEdit"></span>
						<span>月</span>
						<span class="input-span n2">{{item.payRentDay}}<input type="text" v-model="changeData.payRentDay" v-if="item.isEdit"></span>
						<span>日至20</span>
						<span class="input-span n2">{{item.year || year}}<input type="text" v-model="changeData.year" v-if="item.isEdit"></span>
						<span>年</span>
						<span class="input-span n2">{{item.month || month}}</span>
						<span>月</span>
						<span class="input-span n2">{{lastDay}}<input type="text" v-model="changeData.payRentDay" v-if="item.isEdit"></span>
						<span>日)</span>
					</p>
					<p>
						<span>租金: </span>
						<span class="input-span">{{item.rent}}</span>
						<span>管理费: </span>
						<span class="input-span n2">-</span>
						<span>卫生费: </span>
						<span class="input-span n2x">{{item.publicSaniFee}}</span>
						<span>网络费: </span>
						<span class="input-span n2x">{{item.cost}}</span>
						<span>电梯费: </span>
						<span class="input-span n2">-</span>
						<span>其他: </span>
						<span class="input-span n2">-</span>
					</p>
					<p>
						<span>电费: 本月读数</span>
						<span class="input-span">{{item.currentPowerNumber}}</span>
						<span>上月读数</span>
						<span class="input-span">{{item.prePowerNumber}}</span>
						<span>实际用量</span>
						<span class="input-span">{{item.actualDosage}}</span>
						<span>金额</span>
						<span class="input-span" :class="{redtips: item.powerFee < 0}">{{item.powerFee}}</span>
						<span>元</span>
					</p>
					<p>
						<span>水费: 本月读数</span>
						<span class="input-span">{{item.currentWaterNumber}}</span>
						<span>上月读数</span>
						<span class="input-span">{{item.preWaterNumber}}</span>
						<span>实际用量</span>
						<span class="input-span">{{item.waterActualDosage}}</span>
						<span>金额</span>
						<span class="input-span">{{item.waterFee}}</span>
						<span>元</span>
					</p>
					<p>
						<span>合计金额(大写)：</span>
						<span class="money-daxie">
                        <span>{{currency.convertCurrency(item.total)}}</span>
                    </span>
					</p>
					<p>
						<span class="seal">收款单位盖章：</span>
						<span class="money-num">￥：<span class="total-view">{{item.total}}</span></span>
					</p>
				</div>
				<div class="receipt-foot">
					<span>核准：</span>
					<span>会计：</span>
					<span>记账：</span>
					<span>出纳：</span>
					<span>经手人：王华桥</span>
				</div>
				<div style="position: absolute;top: 0;left: -35px;">
					<el-button type="text" size="mini" @click="changeReceipt(item, index)">修改</el-button>
					<br>
					<el-button type="text" size="mini" @click="comfirm(item, index)">确定</el-button>
					<br>
					<el-button type="text" size="mini" @click="saveReceipt([item])">保存</el-button>
				</div>
		</div>

		</div>
		<span slot="footer">
			<el-button @click="handleClose(()=>{viewModal = false})" size="small">关闭</el-button>
			<el-button @click="saveReceipt(temReceiptData)" size="small" type="primary">一键保存所有收据</el-button>
			<el-button @click="saveImgcomfirm(0)" size="small" type="success">下载收据</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import currency from '../../utils/convertCurrency'
	import html2canvas from 'html2canvas'
	let currentDate = new Date();//获取系统当前时间
	let year = currentDate.getFullYear().toString().substring(2,4);
	let countTotal = function(a,b,c,d,e) {
		a = a == ''?0:parseFloat(a);
		b = b == ''?0:parseFloat(b);
		c = c == ''?0:parseFloat(c);
		d = d == ''?0:parseFloat(d);
		e = e == ''?0:parseFloat(e);
		var total = a+b+c+d+e;
		return total;
	}

	export default {
		name: "fillHydropowerReads",
		data() {
			return {
				viewModal: false,
				fillValue: '',
				// 设置收据背景图 .paper
				paper: {
					backgroundImage: "url(" + require("../../assets/images/big-paper.png") + ")",
					backgroundRepeat: "no-repeat",
					backgroundSize: "100% 100%",
				},
				receiptId: '', //收据ID
				tenantInfo: [],
				year: year,
				month: currentDate.getMonth()+1,
				date: currentDate.getDate(),
				totalStr: '',
				total: 0,
				allReceiptData: [],
				countTotal,
				currency,
				changeData: {},
				temReceiptData: [],
        lastDay: 31,
			}
		},
		methods: {
			show() {
				this.viewModal = true;
			},
			comfirm(item, index) {
				Object.assign(item, this.changeData, {isEdit: false});
				this.$set(this.allReceiptData, index, item);
			},
			changeReceipt(item, index) {
				this.changeData = {};
				item.isEdit = true
				this.$set(this.allReceiptData, index, item);

			},
			getAllHouseData(room,index) {
				this.$http.get(`/getRoomById?id=${room[index].name}`).then((res) => {
					this.tenantInfo[index] = Object.assign({}, res.data);
					const data = res.data;
					data.prePowerNumber = data.prePowerNumber[data.prePowerNumber.length-1];
					data.preWaterNumber = data.preWaterNumber[data.preWaterNumber.length-1];
					data.currentPowerNumber = room[index].power;
					data.currentWaterNumber = room[index].water;
					data.actualDosage = data.currentPowerNumber - data.prePowerNumber;
					data.waterActualDosage = data.currentWaterNumber - data.preWaterNumber;
					data.powerFee = (data.actualDosage*(data.powerKWH?data.powerKWH:1.5)).toFixed(2);
					data.waterFee = (data.waterActualDosage*5).toFixed(2);

					let month = this.month < 10 ? ('0' + this.month) : (this.month);
					let date = this.date < 10 ? ('0' + this.date) : (this.date);
					data.id = '20' + year + month + date + data.roomNumber;

					data.year = this.year;
					data.month = month;
					data.total = countTotal(data.rent, data.cost, data.publicSaniFee, data.powerFee, data.waterFee).toFixed(2);
					data.tenant = data.tenant?data.tenant:'';
					this.allReceiptData[index] = data;
					index++;
					if(index > room.length-1) {
						this.saveReceiptData(data, index, () => {
							this.show();
							console.log(this.temReceiptData)
						});
						return;
					}
					this.saveReceiptData(data, index, () => {
						this.getAllHouseData(room, index);
					});
				});
			},
			// 保存收据数据
			saveReceiptData(receipt, index, func) {
				delete receipt._id;
				this.temReceiptData.push(receipt);
				func();
			},
			//保存收据
			saveReceipt(receipts) {
				const data = receipts.shift();
				this.$http.post('/insertReceipt', data).then(res => {
					if(res.code === 200) {
						this.$notify({
							title: '成功',
							message: `已经保存收据，编号：NO ${data.id}`,
							type: 'success'
						});
						this.temReceiptData = this.temReceiptData.filter(val => val.id !== data.id)
						this.updatePW(data, receipts)
					}
					if(!res.code) return this.$message.error(res.msg);
				});
			},
			// 更新水电读数
			updatePW(receiptData, receipts) {
				var currentPower = parseFloat(receiptData.currentPowerNumber);
				var prevPower = parseFloat(receiptData.prePowerNumber);
				var currentWater = parseFloat(receiptData.currentWaterNumber);
				var prevWater = parseFloat(receiptData.preWaterNumber);

				if(currentPower < prevPower) {
					this.$message.warning('存在一条电费为负数的收据，注意查看及时修改！');
				}
				if(currentWater < prevWater) {
					this.$message.warning('存在一条水费为负数的收据，注意查看及时修改！');
				}

				var data = Object.assign({}, this.tenantInfo.shift());
				data.prePowerNumber.push(currentPower);
				data.preWaterNumber.push(currentWater);

				this.$http.post('/updateRoomInfo', data).then(res => {
					if(res.code === 200) {
						this.$notify.info({
							title: '消息',
							message: '水电表读数也一起更新好了~'
						});
						this.temReceiptData = this.temReceiptData.filter(val => val.id !== receiptData.id)
						if(receipts.length) {
							this.saveReceipt(receipts)
						}
					}
				});
			},
			saveImgcomfirm(i) {
				let list = this.allReceiptData;
				html2canvas(document.querySelector(`#img${list[i].id}`)).then(canvas => {
					var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url 　
					var saveLink = document.createElement( 'a');
					saveLink.href = imgUri;

					saveLink.download = `${list[i].roomNumber}-${list[i].id}`;
					saveLink.setAttribute('download', `${list[i].roomNumber}-${list[i].id}.png`);
					saveLink.click();
					setTimeout( () => {
						i++
						if(i === list.length) {
							return false;
						}
						this.saveImgcomfirm(i)
					}, 100)
				});

			},
			handleClose(done) {
				if(this.temReceiptData.length > 0) {
					const noSaveStr = this.temReceiptData.map(val => val.id).join('/');
					this.$confirm(`还有收据没有保存到数据库，编号分别为：${noSaveStr}, 确认关? 确认则不会保存收据，水电数也不会更新！`)
					.then(_ => {
						done();
					}).catch(_ => {});
				}
				else {
					done()
				}
			},
		},
		mounted() {
			this.$on('showReceipts', arg => {
				if(arg.startData) {
					this.month = new Date(arg.startData).getMonth() + 1
					this.year = new Date(arg.startData).getFullYear().toString().substring(2,4);
				}
				this.temReceiptData = [];
				let list = arg.data;
				let i = 0;
				this.getAllHouseData(list,i);
				const date= new Date();
				date.setMonth(date.getMonth() + 1);
				//日期设置为0号, 0表示1号的前一天
				let lastDay = date.setDate(0);
				this.lastDay = new Date(lastDay).toLocaleString().split(' ')[0].slice(-2)
			})
		}
	}
</script>

<style lang="scss" scoped>
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
		width: 630px;
		height: 340px;
		color: #000;
		margin-left: 110px;
		box-sizing: border-box;
		padding: 0 40px 20px 30px;
		position: relative;
		font-size: 14px;
		margin-bottom: 25px;
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
		position: relative;
	}
	.receipt-content p {
		letter-spacing:2px;
	}
	.receipt-content p input,
	.receipt-content p .input-span {
		font-size: 13px;
		display: inline-block;
		width: 60px;
		height: 25px;
		color: #333;
		text-align: center;
		border: none;
		margin: 0 -1px;
		background: rgba(255,255,255,0);
		position: relative;
		// 实现border-bottom，兼容html2canvas
		&:after {
			content: '';
			display: block;
			position: absolute;
			bottom: -1px;
			left: 0;
			width: 100%;
			height: 1px;
			background-color: #000;
		}

	}
	.receipt-content p .input-span input {
		position: absolute;
		left: 0px;
		top: 5px;
		bottom: 0px;
		right: 0px;
		width: 100%;
		background-color: rgba(255,255,255, 0.5);
		height: 18px;
	}
	.receipt-content p input.n1,
	.receipt-content p .input-span.n1 {
		width: 54px;
	}
	.receipt-content p input.n2,
	.receipt-content p .input-span.n2 {
		width: 20px;
	}
	.receipt-content p input.n2x,
	.receipt-content p .input-span.n2x {
		width: 30px;
	}
	.money-daxie {
		display: inline-block;
		letter-spacing:10px;
		padding-left: 40px;
		width: 350px;
		position: relative;
		// 实现border-bottom，兼容html2canvas
		&:after {
			content: '';
			display: block;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 1px;
			background-color: #000;
		}
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
		bottom: 15px;
		display: flex;
		justify-content: space-between;
		width: 560px;
	}
	.receipt-content p input.total {
		width: 80px;
	}
	.total-view {
		display: inline-block;
		width: 100px;
		height: 25px;
		text-align: center;
		position: relative;
		// 实现border-bottom，兼容html2canvas
		&:after {
			content: '';
			display: block;
			position: absolute;
			bottom: -2px;
			left: 0;
			width: 100%;
			height: 1px;
			background-color: #000;
		}
	}
	.redtips {
		color: red !important;
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
	.item-bgimg {
		width: 120%;
		height: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 20px;
		z-index: 0;
	}

</style>