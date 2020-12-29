<template>
	<el-dialog
	:visible="viewModal"
	:show-close="false"
	title="填写所有房号和水电读数">
		<div style="margin-bottom: 20px;">
			<el-date-picker v-model="startData" type="date" size="small"  placeholder="选择收据的统一月份开始时间(结束时间默认为选中月份最后一天)" style="width: 100%"></el-date-picker>
		</div>
		<el-input v-model="fillValue" :rows="10" type="textarea" placeholder="输入房号和水电表读数, 如a101-1234/56, 用回车分隔" />
		<span  slot="footer">
			<el-button @click="viewModal = false" size="small">关闭</el-button>
			<el-button @click="comfirm" size="small" type="primary">生成收据</el-button>
		</span >
	</el-dialog>
</template>

<script>
	export default {
		name: "fillHydropowerReads",
		data() {
			return {
				startData: '',
				viewModal: false,
				fillValue: '',
			}
		},
		methods: {
			show() {
				this.viewModal = true;
			},
			comfirm() {
				let hydropowerReads = this.fillValue.split('\n');
				for(let i = 0; i < hydropowerReads.length; i++ ) {
					let obj = {};
					obj.name = hydropowerReads[i].split('-')[0].toUpperCase();
					obj.power = hydropowerReads[i].split('-')[1].split('/')[0];
					obj.water = hydropowerReads[i].split('-')[1].split('/')[1];
					hydropowerReads[i] = obj;
				}
				this.$emit('makeReceipts',{data: hydropowerReads, startData: this.startData})
			},
			// startDataChange(val) {
			// 	this.month = new Date(val).getMonth() + 1
			// }
		},
		mounted() {
			this.$on('show', arg => {
				this.show();
			})
		}
	}
</script>

<style scoped>

</style>