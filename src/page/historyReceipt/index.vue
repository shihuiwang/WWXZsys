<template>
    <div class="page-content">
        <el-row class="margin-top-10">
            <el-card>
                <div slot="header">
	                <i class="el-icon-document"></i>
                    <span>历史收据列表</span>
	                <!--<div  style="float: right; padding: 3px 0">
		                <span>输入文件名：</span>
		                <el-input v-model="excelFileName" placeholder="请输入文件名" size="small" style="width: 190px;margin-right: 10px" />
		                <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
		                <el-button type="primary" size="small" @click="exportExcel">下载表格数据</el-button>
	                </div>-->
                </div>
	            <div class="search-container">
		            <el-input v-model="form.id" placeholder="收据编号" clearable size="small"></el-input>
		            <el-input v-model="form.roomNumber" placeholder="门牌号" clearable size="small"></el-input>
		            <el-button size="small" type="primary" @click="search">查询</el-button>
	            </div>
                <el-row>
                    <el-col :span="24">
                        <el-table stripe :loading="loading" :data="receiptData" size="small" ref="tableExcel">
	                        <el-table-column label="序号" type="index" width="50"></el-table-column>
	                        <el-table-column label="编号" prop="id"></el-table-column>
	                        <el-table-column label="门牌号" prop="roomNumber"></el-table-column>
	                        <el-table-column label="姓名" prop="tenant"></el-table-column>
	                        <el-table-column label="租金" prop="rent"></el-table-column>
	                        <el-table-column label="网费" prop="cost"></el-table-column>
	                        <el-table-column label="卫生费" prop="publicSaniFee"></el-table-column>
	                        <el-table-column label="用电量" prop="actualDosage"></el-table-column>
	                        <el-table-column label="用水量" prop="waterActualDosage"></el-table-column>
	                        <el-table-column label="电费" prop="powerFee">
		                        <template slot-scope="scope">{{Number(scope.row.powerFee).toFixed(2)}}</template>
	                        </el-table-column>
	                        <el-table-column label="水费" prop="waterFee">
		                        <template slot-scope="scope">{{Number(scope.row.waterFee).toFixed(2)}}</template>
	                        </el-table-column>
	                        <el-table-column label="缴费" prop="total"></el-table-column>
                          <el-table-column fixed="right" label="操作">
                            <template slot-scope="scope">
                              <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
	            <el-pagination style="margin-top: 20px; text-align: right"
	                     @current-change="handleCurrentChange"
			            :page-size="size"
			            layout="prev, pager, next, jumper"
			            :total="total">
	            </el-pagination>
            </el-card>
        </el-row>
    </div>
</template>

<script>
import { Message } from 'element-ui';

export default {
    name: 'exportable-table',
    data () {
        return {
            excelFileName: '',
            tableExcel: {},
            receiptData: [],
            loading: true,
			allTenants: [],

	        page: 1,
	        size: 10,
	        total: 0,
	        form: {}
        };
    },
    methods: {
        getReceiptData() {
        	this.loading = true;
	        this.$http.post('/historyReceipt/list', {
	        	page: this.page,
		        size: this.size,
		        ...this.form,
            status: 1,
	        }).then(res => {
		        this.loading = false;
		        if(res.code === 200) {
			        this.receiptData = res.data
			        this.total = res.total
		        }
		        if(!res.code) return Message.error(res.msg);
	        });
        },
	    handleCurrentChange(val) {
		    this.page = val;
		    this.getReceiptData();
	    },
	    search() {
        	if(!this.form.id) delete this.form.id;
        	if(!this.form.roomNumber) delete this.form.roomNumber;
		    this.getReceiptData();
	    },
      del(row) {
        this.$confirm('此操作将软删除该数据不再显示, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 0
          this.$http.post('/removeHistory', row).then(res => {
            if(res.code === 200) {
              this.$message.success('删除成功!');
              //this.getRoomNum(row)
              this.getReceiptData();
            }
            if(!res.code) return this.$message.error(res.msg);
          });
        }).catch(() => {return false});
      },
      // 回滚水电读数
      rebackPW(rowData, tenantInfo) {
        var data = Object.assign({}, tenantInfo);
        data.prePowerNumber.push(rowData.prePowerNumber);
        data.preWaterNumber.push(rowData.preWaterNumber);

        this.$http.post('/updateRoomInfo', data).then(res => {
          if(res.code === 200) {
            this.$notify.info({
              title: '消息',
              message: '水电表读数已回滚~'
            });
          }
        });
      },
      getRoomNum(row) {
        this.loading = true;
        this.$http.get(`/getRoomById?id=${row.roomNumber}`).then((res) => {
          //成功获取数据库数据
          if(res.code === 200) {
            this.rebackPW(row, res.data)
          }
          this.loading = false;
        })
      }
    },
    created() {
	    this.getReceiptData();
    }
};
</script>