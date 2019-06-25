<template>
	<div class="page-content">
		<el-card>
			<div slot="header">
				<i class="el-icon-edit"></i>
				<span> 编辑租户</span>
				<div class="rigth-block">
					<el-input type="text" size="small" v-model="copyId" style="width: 200px; margin-right: 10px;"></el-input>
					<el-button size="small" type="primary" @click="copyRoom">复制该房间的信息</el-button>
				</div>
			</div>
			<div class="flex-content">
				<div class="form-content">
					<el-form :model="form" :rules="rules" ref="form" label-width="100px">
						<el-form-item label="姓名" prop="tenant">
							<el-input v-model="form.tenant" size="small"></el-input>
						</el-form-item>
						<el-form-item label="身份证号" prop="tenant">
							<el-input v-model="form.cardId" size="small"></el-input>
						</el-form-item>
						<el-form-item label="联系方式" prop="tenant">
							<el-input v-model="form.phone" size="small"></el-input>
						</el-form-item>
						<el-form-item label="门牌号" prop="roomNumber">
							<el-input :disabled="type === 'edit'" v-model="form.roomNumber" size="small"></el-input>
						</el-form-item>
						<el-form-item label="月租金" prop="rent">
							<el-input v-model="form.rent" size="small"></el-input>
						</el-form-item>
						<el-form-item label="交租日期" prop="payRentDay">
							<el-input v-model="form.payRentDay" size="small"></el-input>
						</el-form-item>
						<el-form-item label="网费" prop="cost">
							<el-input v-model="form.cost" size="small"></el-input>
						</el-form-item>
						<el-form-item label="卫生费" prop="publicSaniFee">
							<el-input v-model="form.publicSaniFee" size="small"></el-input>
						</el-form-item>
						<el-form-item label="钥匙押金" prop="keyDeposit">
							<el-input v-model="form.keyDeposit" size="small"></el-input>
						</el-form-item>
						<el-form-item label="最新电表读数" prop="prePowerRead">
							<el-input v-model="form.prePowerRead" size="small"></el-input>
						</el-form-item>
						<el-form-item label="最新水表读数" prop="prePowerRead">
							<el-input v-model="form.preWaterRead" size="small"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button class="large-btn" size="small" @click="$router.go(-1)">返回</el-button>
							<el-button class="large-btn" type="primary" size="small" @click="save" :loading="loading" v-if="type === 'edit'">保存</el-button>
							<el-button class="large-btn" type="primary" size="small" @click="checkRoomHas" :loading="loading" v-if="type === 'add'">保存</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="contract-content">
					<div class="contract-header">
						<div>合同</div>
						<div class="btn-block">
							<el-button :disabled="!form.contractImgPath" @click="contractImgVisible=true" style="margin-right: 20px" size="small" type="text">查看合同图片</el-button>
							<el-upload
									:action="baseURL + '/upload'"
									:on-remove="handleRemove"
									:on-success="uploadContractSuccess"
									auto-upload
									:show-file-list="false"
									:limit="1">
								<el-button size="small" type="text">上传/更新合同图片</el-button>
							</el-upload>
						</div>
					</div>
					<div class="contract-main">
						<div class="scale-box">
							<header>房屋租赁合同</header>
							<p class="is-margin">
								<span>出租人(甲方): </span><span class="is-downline name">王华桥</span>
								<span>身份证号: </span><span class="is-downline id">440823199001180316</span>
								<span>联系方式: </span><span class="is-downline phone">13316183510</span>
							</p>
							<p class="is-margin">
								<span>承租人(甲方): </span><span class="is-downline name">{{form.tenant}}</span>
								<span>身份证号: </span><span class="is-downline id">{{form.cardId}}</span>
								<span>联系方式: </span><span class="is-downline phone">{{form.phone}}</span>
							</p>
							<p>
								一、甲方将位于<span class="is-downline">{{address[letter]}}</span>号<span class="is-downline">{{form.roomNumber}}</span>
								房租赁给乙方<span class="is-downline">居住</span>使用。居住人数不超过<span class="is-downline">4</span>人, 入住租客年龄不能超过60岁及不能饲养宠物。
							</p>
							<p>
								二、租金结算方式: 房屋租赁共<span class="is-downline">6</span>个月, 从<span class="is-downline">2018年10月26日</span>至<span class="is-downline">2019年4月26日</span>,
								租金为人民币<span class="is-downline">{{form.rent}}</span>元/月, <span class="is-downline">{{form.rent && currency.convertCurrency(form.rent)}}</span>(大写), 电费{{form.powerKWH || 1.5}}/度, 水费5元/立方, 网费
								<span class="is-downline">{{form.cost}}</span>元/月, 卫生费以及楼梯灯等分摊费<span class="is-downline">{{form.publicSaniFee || '-'}}</span>元/月, 钥匙押金
								<span class="is-downline">100</span>元。交租日期为每月<span class="is-downline">{{form.payRentDay}}</span>号; 如乙方拖欠租金, 须支付滞纳金
								<span class="is-downline">30</span>元/日。
							</p>
							<p>
								三、保证金：本合同签订后乙方必须向甲方支付保证金<span class="is-downline">{{form.rent}}</span>元, <span class="is-downline">{{form.rent && currency.convertCurrency(form.rent)}}</span>（大写）。
								合同期满后, 乙方若不续租, 则应清空物品, 打扫房屋干净交回甲方（乙方不能存留任何物品）, 待甲方验收合格, 方可终止合同, 扣除水电费等费用后, 甲方将保证金返还给乙方（保证金不计利息）。如合同期未满提前违约退房的, 甲方有权不返还乙方所交的当月房租以及全部保证金。
							</p>
							<p>四、入住7天内房间有任何问题由甲方负责, 超过7天后, 产生的一切损坏费用由乙方承担。</p>
							<p>五、1.租赁期间, 乙方须负责做好房屋的清洁和排污管道不被堵塞的责任, 安全保卫及防火工作（严禁使用高功率的电器与设备）, 如有发生意外造成甲方损失, 由乙方负责赔偿责任。2.乙方不能在该房屋内进行一切违法活动, 如出现刑事责任乙方将承担全部责任。3.租赁期间, 乙方保管好个人财产安全, 甲方不负责乙方财务保管。</p>
							<p>六、租赁期间, 乙方必须经过甲方同意才可以转租, 同时甲方将抽取房租百分之二十作为服务费, 如乙方擅自转租房屋或中途擅自解除合同作违约处理, 甲方将没收保证金。</p>
							<p>七、乙方必须向甲方提供合法个人证件和资料, 并提交一份复印件, 甲方承诺, 复印件仅作为此次租赁使用。所提交资料必须真实、合法、有效, 如有虚假, 甲方可随时解除本合同。</p>
							<p>八、租赁期间, 房屋如被政府征用或地震、洪灾等不可抗拒力量大自然灾害, 本合同失效。</p>
							<p>九、乙方有以下行为之一的, 甲方有权单方解除合同, 没收全部保证金, 收回房屋：1.拖欠房租超过5天；2.擅自改变房屋用途或改变房屋主体结构；3.租赁期间居住人数超过合同约定数量的；4.因扰民、饲养宠物等原因干扰他人正常生活, 导致邻居、居委会投诉或派出所出警协调的；5.利用房屋从事违法活动, 损害公共利益的。</p>
							<p>十、本合同在租赁期满并退租, 需提前15天以上通知甲方, 并协助甲方人员上门查看, 不说明则当续租处理, 否则甲方可以从保证金里面收取百分之二十的房租作为服务费。</p>
							<p>十一、合同经双方签字, 立即生效, 合同一式两份, 甲乙双方当事人各执一份。</p>
							<p>十二、请您确认, 在签署合同之前, 您已经仔细阅读合同条款。</p>
							<table class="own-table" cellpadding="0" cellspacing="0" width="100%">
								<tr>
									<th>物品</th>
									<th>数量</th>
									<th>赔偿金额</th>
									<th>物品</th>
									<th>数量</th>
									<th>赔偿金额</th>
									<th>物品</th>
									<th>数量</th>
									<th>赔偿金额</th>
								</tr>
								<tr>
									<td>沙发</td>
									<td>1</td>
									<td>900</td>
									<td>茶几</td>
									<td>1</td>
									<td>300</td>
									<td>热水器</td>
									<td>1</td>
									<td>700</td>
								</tr>
								<tr>
									<td>床</td>
									<td>1</td>
									<td>800</td>
									<td>床垫</td>
									<td>1</td>
									<td>500</td>
									<td>窗帘</td>
									<td>2/3</td>
									<td>100</td>
								</tr>
								<tr>
									<td>空调</td>
									<td>1/2</td>
									<td>1500</td>
									<td>冰箱</td>
									<td>1</td>
									<td>1500</td>
									<td>洗衣机</td>
									<td>1</td>
									<td>1500</td>
								</tr>
								<tr>
									<td>电脑桌</td>
									<td>1</td>
									<td>200</td>
									<td>凳子</td>
									<td>1</td>
									<td>100</td>
									<td>衣柜</td>
									<td>1</td>
									<td>300</td>
								</tr>
							</table>
							<p>如损坏以上的物品并且不能维修的，将按照以上价格赔偿</p>
							<p>
								<span>甲方: (签字) 王华桥</span><span class="sign-right">乙方: (签字) {{form.tenant}}</span>
							</p>
							<p>
								<span></span><span class="sign-right">签约日期: </span>
							</p>
							<hr>
							<p>附注: <span class="is-downline large"> </span></p>
							<p>附：收到保证金<span class="is-downline">{{form.rent}}</span>元, <span class="is-downline">2019/06/24</span>至<span class="is-downline">2019/06/24</span>租金<span class="is-downline">{{form.rent}}</span>元，网费<span class="is-downline">{{form.cost}}</span>元,</p>
							<p>卫生费<span class="is-downline">{{form.publicSaniFee}}</span>元，钥匙押金<span class="is-downline">100</span>元，其他费用<span class="is-downline">-</span>元，
								合计<span class="is-downline">{{form.rent*2 + form.cost*1 + form.publicSaniFee*1 + 100}}</span>元，大写:<span class="is-downline">{{currency.convertCurrency(form.rent*2 + form.cost*1 + form.publicSaniFee*1 + 100)}}</span>,</p>
							<p>首月的电表底数为<span class="is-downline">{{form.prePowerRead}}</span>度, 首月的水表底数为<span class="is-downline">{{form.preWaterRead}}</span>吨。</p>
						</div>
					</div>
				</div>
				<div class="card-id-content">
					<div>
						<div style="text-align: center; margin-bottom: 10px">身份证正面</div>
						<div class="card-front">
							<el-image :src="baseURL + form.cardFrontImgPath">
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
									<el-upload
											:action="baseURL + '/upload'"
											:on-remove="handleRemove"
											:on-success="uploadCardFrontSuccess"
											auto-upload
											:limit="1"
											:file-list="fileList">
										<el-button size="small" type="text">点击上传</el-button>
									</el-upload>
								</div>
							</el-image>
						</div>
					</div>
					<div>
						<div style="text-align: center; margin-bottom: 10px">身份证背面</div>
						<div class="card-back">
							<el-image :src="baseURL + form.cardBackImgPath">
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
									<el-upload
											:action="baseURL + '/upload'"
											:on-remove="handleRemove"
											:on-success="uploadCardBackSuccess"
											auto-upload
											:limit="1"
											:file-list="fileList">
										<el-button size="small" type="text">点击上传</el-button>
									</el-upload>
								</div>
							</el-image>
						</div>
					</div>
				</div>
			</div>
		</el-card>
		<!--合同图片显示contractImgPath-->
		<el-dialog
				title="提示"
				top="5vh"
				:visible.sync="contractImgVisible"
				width="800px" >
			<div style="width: 100%; min-height: 78vh">
				<!--<img :src="baseURL + form.contractImgPath" alt="" style="height: 100%">-->
				<el-image :src="baseURL + form.contractImgPath"></el-image>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { Message } from 'element-ui';
	import { host } from '../../utils/host';
	import currency from '../../utils/convertCurrency';

	export default {
		name: "edit",
		data() {
			return {
				form: {
					keyDeposit: 100,
					prePowerNumber: [],
					preWaterNumber: [],
				},
				rules: {},
				loading: false,
				baseURL: host['dev'],
				fileList: [],
				currency,
				address: {
					'A': '五眼桥滘口村50',
					'B': '五眼桥滘口村55',
					'C': '五眼桥滘口村210',
					'D': '五眼桥滘口村209',
					'E': '五眼桥滘口村77',
				},
				letter: 'A',
				type: 'edit',
				id: null,
				copyId: '',
				contractImgVisible: false,
			}
		},
		methods: {
			getRoomDetail() {
				this.$http.get(`/getRoomById?id=${this.id}`).then((res) => {
					//成功获取数据库数据
					if(res.code === 200 && res.data) {
						this.form = res.data;
						this.form.prePowerRead = this.form.prePowerNumber[this.form.prePowerNumber.length - 1];
						this.form.preWaterRead = this.form.preWaterNumber[this.form.preWaterNumber.length - 1];
						this.letter = res.data.roomNumber.substring(0,1)
					}
				})
			},
			save() {
				this.form.prePowerNumber.push(this.form.prePowerRead);
				this.form.preWaterNumber.push(this.form.preWaterRead);
				this.form.prePowerNumber = Array.from(new Set(this.form.prePowerNumber));
				this.form.preWaterNumber = Array.from(new Set(this.form.preWaterNumber));
				delete this.form.prePowerRead;
				delete this.form.preWaterRead;
				this.loading = true;
				this.$http.post('/updateRoomInfo', this.form).then(res => {
					this.loading = false;
					if(res.code === 200) {
						this.$router.push('/roomManage')
						Message.success('保存成功~');
					}
					if(!res.code) return Message.error(res.msg);
				});
			},
			// 检测数据库是否已存在相同的房间号，如果存在则把原来的房间改为退房状态，门牌号追加“_T”, 添加状态：0
			checkRoomHas() {
				this.loading = true;
				this.$http.get(`/getRoomById?id=${this.form.roomNumber}`).then((res) => {
					if(!res.data) {
						this.add()
					}
					else {
						this.$confirm('检测到已存在该房间, 继续保存将会把原来的房间置为退房状态，启用现在添加的房间。', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							res.data.roomNumber = res.data.roomNumber + '_T';
							res.data.id = res.data.id + '_T';
							res.data.status = 0;
							this.$http.post('/updateRoomInfo', res.data).then(res => {
								if(res.code === 200) {
									this.add()
								}
								if(!res.code) return Message.error(res.msg);
							});
						}).catch(() => {return false});
					}
					if(res.code === -1) this.loading = false;
				});
			},
			add() {
				this.form["id"] = this.form.roomNumber;
				this.form.prePowerNumber.push(this.form.prePowerRead);
				this.form.preWaterNumber.push(this.form.preWaterRead);
				delete this.form["_id"];
				delete this.form.prePowerRead;
				delete this.form.preWaterRead;
				this.$http.post('/insertRoom', this.form).then(res => {
					this.loading = false;
					if(res.code === 200) {
						this.$router.push('/roomManage');
						Message.success('保存成功~');
					}
					if(!res.code) return Message.error(res.msg);
				});
			},
			handleRemove() {},
			uploadContractSuccess(res) {
				this.$message.success('上传图片成功');
				this.$set(this.form, 'contractImgPath', res.reallyPath);
			},
			uploadCardFrontSuccess(res) {
				this.$set(this.form, 'cardFrontImgPath', res.reallyPath);
			},
			uploadCardBackSuccess(res) {
				this.$set(this.form, 'cardBackImgPath', res.reallyPath);
			},
			copyRoom() {
				this.id = this.copyId;
				this.getRoomDetail()
			},
		},
		created() {
			this.form = {
				keyDeposit: 100,
				prePowerNumber: [],
				preWaterNumber: [],
			};
			this.type = this.$route.query.type;
			this.id = this.$route.query.id;
			this.getRoomDetail()
		}
	}
</script>

<style lang="scss" scoped>
	.flex-content {
		display: flex;
		justify-content: start;
	}
	.form-content {
		width: 400px;
		margin-right: 100px;
		.large-btn {
			width: 145px;
		}
	}
	.contract-content {
		margin-right: 100px;
		.contract-header {
			display: flex;
			justify-content: space-between;
			.btn-block {
				display: flex;
			}
		}
		.contract-main {
			width: 520px;
			height: 750px;
			border: 1px solid #ccc;
			padding: 15px;
			box-sizing: border-box;
			font-size: 10px;
			box-shadow: 0 0 5px #ccc;
			.scale-box {
				height: 735px;
				position: relative;
				top: -38px;
				-webkit-transform: scale(1,.9);
				-moz-transform: scale(1,.9);
				-o-transform: scale(1,.9);
				transform: scale(1,.9);
			}
			p {
				margin: 0;
				line-height: 17px;
				&:after {
					content: '';
					display: block;
					clear: both;
				}
			}
			.is-margin {
				margin: 5px 0;
			}
			header {
				font-size: 20px;
				font-weight: bold;
				line-height: 30px;
				text-align: center;
			}
			.is-downline {
				display: inline-block;
				border-bottom: 1px solid #333;
				height: 15px;
				&.phone,
				&.name {
					width: 80px;
				}
				&.id {
					width: 134px;
				}
				&.large {
					width: 455px;
				}
			}
			.own-table {
				border-right: 1px solid #ccc;
				border-bottom: 1px solid #ccc;
				td, th {
					text-align: center;
					border-left: 1px solid #ccc;
					border-top: 1px solid #ccc;
				}
			}
			.sign-right {
				float: right;
				margin-right: 30%;
			}
		}
	}
	.card-id-content {
		display: flex;
		flex-direction: column;
		.card-front,
		.card-back{
			width: 300px;
			height: 200px;
			margin-bottom: 30px;
			background-color: #eee;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #666;
		}
	}
	.rigth-block {
		float: right;
	}
</style>

<style lang="scss">
	.card-id-content {
		.image-slot {
			display: flex;
			flex-direction: column;
			align-items: center;
			i {
				font-size: 50px;
			}
		}
	}
</style>