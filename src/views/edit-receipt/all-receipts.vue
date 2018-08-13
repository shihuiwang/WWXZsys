<template>
	<Modal
	v-model="viewModal"
	width="1000px"
	title="填写所有房号和水电读数">
		<div style="padding: 20px 0">
			<div class="receipt-module" :id="'img' + item.id" v-for="item in allReceiptData">
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
						<span class="input-span">{{item.tenant}}</span>
						<span>交来</span>
						<span class="input-span">{{item.roomNumber}}</span>
						<span>房(20</span>
						<span class="input-span n2">{{year}}</span>
						<span>年</span>
						<span class="input-span n2">{{month}}</span>
						<span>月</span>
						<span class="input-span n2">{{item.payRentDay}}</span>
						<span>日至20</span>
						<span class="input-span n2">{{year}}</span>
						<span>年</span>
						<span class="input-span n2">{{month+1}}</span>
						<span>月</span>
						<span class="input-span n2">{{item.payRentDay}}</span>
						<span>日)</span>
					</p>
					<p>
						<span>租金：</span>
						<span class="input-span">{{item.rent}}</span>
						<span>管理费：</span>
						<span class="input-span n2">-</span>
						<span>卫生费：</span>
						<span class="input-span n2x">{{item.publicSaniFee}}</span>
						<span>网络费：</span>
						<span class="input-span n2x">{{item.cost}}</span>
						<span>电梯费：</span>
						<span class="input-span n2">-</span>
						<span>其他：</span>
						<span class="input-span n2">-</span>
					</p>
					<p>
						<span>电费：本月读数</span>
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
						<span>水费：本月读数</span>
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
		</div>

		</div>
		<div slot="footer">
			<Button @click="saveImgcomfirm(0)" type="success">下载收据</Button>
		</div>
	</Modal>
</template>

<script>
	import myIDB from '../../assets/js/indexedDB'
	import currency from '../../assets/js/convertCurrency'
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
				tenantInfo: {},
				year: year,
				month: currentDate.getMonth()+1,
				date: currentDate.getDate(),
				totalStr: '',
				total: 0,
				allReceiptData: [],
				countTotal,
				currency,
				tenantInfo: {},
			}
		},
		methods: {
			show() {
				this.viewModal = true;
			},
			comfirm() {

			},
			getAllHouseData(room,index) {
				myIDB.storeObj.get(room[index].name,(res) => {

					this.tenantInfo = Object.assign({}, res);

					res.prePowerNumber = res.prePowerNumber[res.prePowerNumber.length-1];
					res.preWaterNumber = res.preWaterNumber[res.preWaterNumber.length-1];
					res.currentPowerNumber = room[index].power;
					res.currentWaterNumber = room[index].water;
					res.actualDosage = res.currentPowerNumber - res.prePowerNumber;
					res.waterActualDosage = res.currentWaterNumber - res.preWaterNumber;
					res.powerFee = res.actualDosage*1.5;
					res.waterFee = res.waterActualDosage*5;
					res.id = '20' + year + this.month + this.date + res.roomNumber;
					res.year = year;
					res.month = this.month;
					res.total = countTotal(res.rent, res.cost, res.publicSaniFee, res.powerFee, res.waterFee).toFixed(2);
					res.tenant = res.tenant?res.tenant:'';
					this.allReceiptData[index] = res;
					index++;
					if(index > room.length-1) {
						this.saveReceipt(res, index, () => {
							this.show();
						});
						return;
					}
					this.saveReceipt(res, index, () => {
						this.getAllHouseData(room, index);
					});
				})
			},
			//保存收据
			saveReceipt(receipt, index, func) {
				myIDB.storeObj.receiptAdd(receipt,(res) => {
					this.$Notice.success({title: `已经保存第${index}条收据`});

					//保存成功后更新水电读数
					var currentPower = parseFloat(receipt.currentPowerNumber);
					var prevPower = parseFloat(receipt.prePowerNumber);
					var currentWater = parseFloat(receipt.currentWaterNumber);
					var prevWater = parseFloat(receipt.preWaterNumber);

					if(currentPower < prevPower) {
						this.$Notice.error({title: '存在一条电费为负数的收据，注意查看及时修改！'});
					}
					if(currentWater < prevWater) {
						this.$Notice.error({title: '存在一条水费为负数的收据，注意查看及时修改！'});
					}

					var data = Object.assign(this.tenantInfo);
					data.prePowerNumber.push(currentPower);
					data.preWaterNumber.push(currentWater);

					myIDB.storeObj.put(data,(res) => {
						this.$Notice.success({title: `已经更新第${index}条收据的水电度数`});
						func();
					});
				});
			},
			saveImgcomfirm(i) {
				let list = this.allReceiptData;
				/*for (let i = 0; i < list.length; i++) {
					console.log(`#img${list[i].id}`);
					html2canvas(document.querySelector(`#img${list[i].id}`)).then(canvas => {
						var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url 　
						var saveLink = document.createElement( 'a');
						saveLink.href =imgUri;
						saveLink.download = `${list[i].roomNumber}-${list[i].id}`;
						saveLink.click();
					});
				}*/

				html2canvas(document.querySelector(`#img${list[i].id}`)).then(canvas => {
					var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url 　
					var saveLink = document.createElement( 'a');
					saveLink.href =imgUri;
					saveLink.download = `${list[i].roomNumber}-${list[i].id}`;
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
		},
		mounted() {
			this.$on('showReceipts', arg => {
				let list = arg.data;
				let i = 0;
				this.getAllHouseData(list,i);
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
		width: 620px;
		height: 360px;
		margin-left: 110px;
		box-sizing: border-box;
		padding: 0 30px 10px 30px;
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
	.total-view {
		display: inline-block;
		width: 100px;
		height: 25px;
		border-bottom: 1px solid #000;
		text-align: center;
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