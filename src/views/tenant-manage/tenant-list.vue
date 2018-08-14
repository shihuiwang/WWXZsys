<template>
	<Card>
		<p slot="title">
			<Icon type="android-remove"></Icon>
			租户列表一览 ( 可在列表上更新租户信息 )
		</p>
		<div class="edittable-table-height-con">
			<can-edit-table refs="table2" v-model="allTenants" :columns-list="editInlineColumns" :editIncell="true" hoverShow
            @on-cell-change="handleCellChange"
            @on-change="handleChange"></can-edit-table>
		</div>
	</Card>
</template>

<script>
	import myIDB from '../../assets/js/indexedDB'
	import canEditTable from './components/canEditTable.vue';
	export default {
		name: "tenant-list",
		components: { canEditTable },
		data () {
			return {
				editInlineColumns: [
					{
						title: '序号',
						type: 'index',
						width: 80,
						align: 'center'
					},
					{
						title: '门牌号',
						align: 'center',
						key: 'roomNumber',
						//width: 90,
					},
					{
						title: '姓名',
						align: 'center',
						key: 'tenant',
						//width: 150,
						editable: true
					},
					{
						title: '租金',
						align: 'center',
						key: 'rent',
						width: 150,
						editable: true
					},
					{
						title: '月/网费',
						align: 'center',
						key: 'cost',
						width: 150,
						editable: true
					},
					{
						title: '月/卫生费',
						align: 'center',
						key: 'publicSaniFee',
						width: 150,
						editable: true
					},
					{
						title: '交租日期',
						align: 'center',
						key: 'payRentDay',
						width: 150,
						editable: true
					},
					{
						title: '最近一次电表读数',
						align: 'center',
						key: 'prePowerRead',
						width: 200,
						editable: true
					},
					{
						title: '1°电收费/元',
						align: 'center',
						key: 'powerKWH',
						width: 100,
						editable: true
					},
					{
						title: '最近一次水表读数',
						align: 'center',
						key: 'preWaterRead',
						width: 200,
						editable: true
					},
					{
						title: '操作',
						align: 'center',
						width: 150,
						key: 'handle',
						handle: ['edit']
					}
				],
				allTenants: [],
			}
		},
		created() {
			this.getAllHouseData();
		},
		methods: {
			getAllHouseData() {
				let allTenants = [];
				myIDB.storeObj.fetchStoreByCursor('HOUSE',res => {
					//console.log(res.value);
					if(res.key) {
						res.value.prePowerRead = res.value.prePowerNumber[res.value.prePowerNumber.length-1];
						res.value.preWaterRead = res.value.preWaterNumber[res.value.preWaterNumber.length-1];
						allTenants.push(res.value)
					}
					else if(res == '游标结束'){
						this.allTenants = allTenants;
					}
				});
			},
			handleChange (val, index) {
				console.log(val[index]);
				myIDB.storeObj.put(val[index],(res) => {
					this.$Notice.success({title: res.result+'的基本信息已经更新啦~', duration: 5});
				});
			},
			handleCellChange (val, index, key) {
				if(key === 'prePowerRead'){
					val[index].prePowerNumber.push(parseFloat(val[index].prePowerRead));
				}
				if(key === 'preWaterRead'){
					val[index].preWaterNumber.push(parseFloat(val[index].preWaterRead));
				}
				myIDB.storeObj.put(val[index],(res) => {
					this.$Notice.success({title: res.result+'的基本信息已经更新啦~', duration: 5});
				});
			},
		}
	}
</script>

<style scoped>

</style>