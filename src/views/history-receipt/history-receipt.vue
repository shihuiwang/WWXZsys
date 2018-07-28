<template>
    <div>
        <Row class="margin-top-10">
            <Card>
                <h4 slot="title">
                    <Icon type="android-archive"></Icon>
                    历史收据列表
                </h4>
                <div slot="extra">
                    <span>输入文件名：</span>
                    <Input v-model="excelFileName" icon="document" placeholder="请输入文件名" style="width: 190px" />
                    <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
	                <Button type="primary" size="small" @click="exportExcel">下载表格数据</Button>
                </div>
                <Row>
                    <Col span="24">
                        <Table :loading="loading" :columns="excelColumns" :data="receiptData" size="small" ref="tableExcel"></Table>
                    </Col>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
import table2excel from '@/libs/table2excel.js';
import myIDB from '../../assets/js/indexedDB';
export default {
    name: 'exportable-table',
    data () {
        return {
            excelFileName: '',
            tableExcel: {},
            receiptData: [],
            loading: true,
            excelColumns: [
            	{
                    'type': 'index',
                    'width': 60,
                },
			    {
			        'title': '收据编号',
			        'key': 'id',
			        'width': 130,
			    },
			    {
			        'title': '门牌号',
			        'key': 'roomNumber',
			        'width': 80,
			    },
			    {
			        'title': '租金',
			        'key': 'rent',
			        'sortable': true,
			        'width': 80,
			    },
			    {
			        'title': '交租日',
			        'key': 'payRentDay',
			        'width': 80,
			    },
			    {
			        'title': '租客名字',
			        'key': 'tenant'
			    },
			    {
			        'title': '卫生费',
			        'key': 'publicSaniFee',
			        'sortable': true,
			        'width': 90,
			    },
			    {
			        'title': '用电量',
			        'key': 'actualDosage',
			        'sortable': true
			    },
			    {
			        'title': '用水量',
			        'key': 'waterActualDosage',
			        'sortable': true
			    },
			    {
			        'title': '电费',
			        'key': 'powerFee',
			        'sortable': true,
			        'width': 80,
			    },
			    {
			        'title': '水费',
			        'key': 'waterFee',
			        'sortable': true,
			        'width': 80,
			    },
			    {
			        'title': '缴费',
			        'key': 'total',
			        'sortable': true
			    }
			],
			allTenants: [],
        };
    },
    methods: {
        exportExcel () {
            table2excel.transform(this.$refs.tableExcel, 'hrefToExportTable', this.excelFileName);
        },
        getReceiptData() {
        	var receiptData = [];
        	myIDB.storeObj.fetchStoreByCursor('room',res => {
	            if(res.key && !res.key.includes('测试')) {
	                if(res.key != '') {
	                    //console.log(res.value);
	                    if(this.allTenants.indexOf(res.value.tenant) === -1) {
	                    	res.value.tenant = res.value.tenant + '(已退)';
	                    	res.value.stateColor = '#ed3f14';
	                    }
	                    receiptData.unshift(res.value);
	                }
	            }
	            else if(res == '游标结束'){
	            	this.receiptData = receiptData;
	            	this.loading = false;
	            }
	        });
        },
        getAllHouseData() {
        	this.allTenants = [];
	        myIDB.storeObj.fetchStoreByCursor('HOUSE',res => {
	            if(res.key && !res.key.includes('测试')) {
	                if(res.key != '') {
	                    this.allTenants.push(res.value.tenant);
	                }
	            }
	            else if(res == '游标结束'){
	                //console.log('所有房客：',this.allTenants); 
        			this.getReceiptData();
	            }
	        });
        },
    },
    created() {
        setTimeout(() => {
        	this.getAllHouseData();
        },1000);
    }
};
</script>