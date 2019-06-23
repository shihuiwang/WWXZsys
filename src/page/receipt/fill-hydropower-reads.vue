<template>
	<el-dialog
	:visible="viewModal"
	:show-close="false"
	title="填写所有房号和水电读数">
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
				this.$emit('makeReceipts',hydropowerReads)
			},
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