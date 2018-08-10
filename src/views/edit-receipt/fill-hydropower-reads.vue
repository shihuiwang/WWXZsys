<template>
	<Modal
	v-model="viewModal"
	title="填写所有房号和水电读数">
		<Input v-model="fillValue" :rows="10" type="textarea" placeholder="Enter something..." />
		<div slot="footer">
			<Button @click="comfirm">确 定</Button>
		</div>
	</Modal>
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
					obj.name = hydropowerReads[i].split('-')[0];
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