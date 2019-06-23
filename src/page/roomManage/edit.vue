<template>
	<div class="page-content">
		<el-card>
			<div slot="header">
				<i class="el-icon-edit"></i>
				<span> 编辑租户</span>
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
							<el-input disabled v-model="form.roomNumber" size="small"></el-input>
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
						<el-form-item label="最新电表读数" prop="prePowerRead">
							<el-input v-model="form.prePowerRead" size="small"></el-input>
						</el-form-item>
						<el-form-item label="最新水表读数" prop="prePowerRead">
							<el-input v-model="form.preWaterRead" size="small"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button size="small" @click="$router.go(-1)">返回</el-button>
							<el-button type="primary" size="small" @click="save" :loading="loading">保存</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="contract-content">
					<div class="contract-header">
						<div>合同</div>
						<div class="btn-block">
							<el-button style="margin-right: 20px" size="small" type="text">查看合同图片</el-button>
							<el-upload
									:action="baseURL + '/upload'"
									:on-remove="handleRemove"
									:on-success="uploadContractSuccess"
									auto-upload
									:limit="1"
									:file-list="fileList">
								<el-button size="small" type="text">上传/更新合同图片</el-button>
							</el-upload>
						</div>
					</div>
					<div class="contract-main">
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
							一、甲方将位于<span class="is-downline">五眼桥滘口村77</span>号<span class="is-downline">{{form.roomNumber}}</span>
							房租赁给乙方<span class="is-downline">居住</span>使用。居住人数不超过<span class="is-downline">4</span>人，入住租客年龄不能超过60岁及不能饲养宠物。
						</p>
						<p>
							二、租金结算方式: 房屋租赁共<span class="is-downline">6</span>个月，从<span class="is-downline">2018年10月26日</span>至<span class="is-downline">2019年4月26日</span>,
							租金为人民币<span class="is-downline">{{form.rent}}</span>元/月，<span class="is-downline">{{form.rent && currency.convertCurrency(form.rent)}}</span>(大写)，电费{{form.powerKWH || 1.5}}/度，水费5元/立方，网费
							<span class="is-downline">{{form.cost}}</span>元/月，卫生费以及楼梯灯等分摊费<span class="is-downline">{{form.publicSaniFee || '-'}}</span>元/月，钥匙押金
							<span class="is-downline">100</span>元。交租日期为每月<span class="is-downline">{{form.payRentDay}}</span>号; 如乙方拖欠租金，须支付滞纳金
							<span class="is-downline">30</span>元/日。
						</p>
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
				form: {},
				rules: {},
				loading: false,
				baseURL: host['dev'],
				fileList: [],
				currency,
			}
		},
		methods: {
			getRoomDetail() {
				this.$http.get(`/getRoomById?id=${this.$route.query.id}`).then((res) => {
					//成功获取数据库数据
					if(res.code === 200) {
						this.form = res.data;
						this.form.prePowerRead = this.form.prePowerNumber[this.form.prePowerNumber.length - 1];
						this.form.preWaterRead = this.form.preWaterNumber[this.form.preWaterNumber.length - 1];
					}
				})
			},
			save() {
				this.form.prePowerNumber.push(this.form.prePowerRead);
				this.form.preWaterNumber.push(this.form.preWaterRead);
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
			handleRemove() {},
			uploadContractSuccess(res) {
				this.form.contractImgPath = res.reallyPath;
			},
			uploadCardFrontSuccess(res) {
				this.form.cardFrontImgPath = res.reallyPath;
			},
			uploadCardBackSuccess(res) {
				this.form.cardBackImgPath = res.reallyPath;
			},
		},
		created() {
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
			height: 735px;
			border: 1px solid #ccc;
			padding: 20px;
			box-sizing: border-box;
			font-size: 11px;
			p {
				margin: 0;
				line-height: 22px;
			}
			.is-margin {
				margin: 8px 0;
			}
			header {
				font-size: 20px;
				font-weight: bold;
				line-height: 40px;
				text-align: center;
			}
			.is-downline {
				display: inline-block;
				border-bottom: 1px solid #333;
				height: 19px;
				&.phone,
				&.name {
					width: 80px;
				}
				&.id {
					width: 134px;
				}
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