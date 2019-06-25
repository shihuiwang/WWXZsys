<template>
    <div class="page-content">
        <el-row class="margin-top-10">
            <el-card>
                <div slot="header">
	                <i class="el-icon-news"></i>
                    <span style="margin-right: 30px"> 租户列表</span>
	                <el-button size="small" type="text" @click="toggle(true)" :disabled="isList">列表</el-button>
	                <el-button size="small" type="text" @click="toggle(false)" :disabled="!isList">月度收租日分布</el-button>
	                <div class="rigth-block">
		                <el-button size="small" type="primary" @click="edit({})">添加</el-button>
	                </div>
                </div>
	            <div class="search-container" v-show="isList">
		            <el-input v-model="form.roomNumber" placeholder="门牌号" clearable size="small"></el-input>
		            <el-select v-model="form.status" placeholder="状态" size="small">
			            <el-option label="正常" :value="1"></el-option>
			            <el-option label="已退" :value="0"></el-option>
		            </el-select>
		            <el-button size="small" type="primary" @click="search">查询</el-button>
	            </div>
                <el-row v-show="isList">
                    <el-col :span="24">
                        <el-table stripe :loading="loading" :data="list" size="small" ref="tableExcel">
	                        <el-table-column label="序号" type="index"></el-table-column>
	                        <el-table-column label="门牌号" prop="roomNumber"></el-table-column>
	                        <el-table-column label="姓名" prop="tenant"></el-table-column>
	                        <el-table-column label="租金" prop="rent"></el-table-column>
	                        <el-table-column label="交租日" prop="payRentDay"></el-table-column>
	                        <el-table-column label="月/网费" prop="cost"></el-table-column>
	                        <el-table-column label="月/卫生费" prop="publicSaniFee"></el-table-column>
	                        <el-table-column label="最近一次电表读数" prop="prePowerRead"></el-table-column>
	                        <el-table-column label="1°电收费/元" prop="powerKWH"></el-table-column>
	                        <el-table-column label="最近一次水表读数" prop="preWaterRead"></el-table-column>
	                        <el-table-column
			                        fixed="right"
			                        label="操作">
		                        <template slot-scope="scope">
			                        <!--<el-button type="text" size="small">查看</el-button>-->
			                        <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
			                        <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
		                        </template>
	                        </el-table-column>
                        </el-table>
                    </el-col>
	                <el-col :span="24">
		                <el-pagination
				                style="margin-top: 20px; text-align: right"
				                @current-change="handleCurrentChange"
				                :page-size="size"
				                layout="prev, pager, next, jumper"
				                :total="total">
		                </el-pagination>
	                </el-col>
                </el-row>
	            <el-row v-show="!isList" class="data-table">
		            <el-col :span="24">
			            <el-table border stripe :loading="loading" :data="list" size="small" align="center" ref="dateTable">
				            <el-table-column label="门牌号" align="center" width="60px" prop="roomNumber"></el-table-column>
				            <el-table-column :label="curMonth + '/' + day"
				                             :class-name="day === 15 ? 'center-cell' : ''"
				                             width="55px"
				                             align="center"
				                             v-for="day in getMonthDays()">
					            <template slot-scope="scope">
						            {{scope.row.payRentDay == day ? scope.row.payRentDay : ''}}
					            </template>
				            </el-table-column>
			            </el-table>
		            </el-col>
	            </el-row>
            </el-card>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'exportable-table',
    data () {
        return {
            excelFileName: '',
            tableExcel: {},
	        list: [],
            loading: false,
			allTenants: [],

	        page: 1,
	        size: 10,
	        total: 0,
	        form: {
		        status: 1,
	        },
	        isList: true,
	        curMonth: 1
        };
    },
    methods: {
        getRoomData() {
        	this.loading = true;
	        this.$http.post('/getRoomList', {
	        	page: this.page,
		        size: this.size,
		        ...this.form
	        }).then(res => {
		        this.loading = false;
		        if(res.code === 200) {
			        this.list = res.data
			        this.total = res.total
		        }
		        if(!res.code) return this.$message.error(res.msg);
	        });
        },
	    handleCurrentChange(val) {
		    this.page = val;
		    this.getRoomData();
	    },
	    edit(row) {
        	this.$router.push({path: '/roomManage/roomEdit', query: {id: row.id, type: row.id ? 'edit' : 'add'}})
	    },
	    del(row) {
		    this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
			    confirmButtonText: '确定',
			    cancelButtonText: '取消',
			    type: 'warning'
		    }).then(() => {
			    this.$http.post('/removeItem', {'_id': row["_id"]}).then(res => {
				    if(res.code === 200) {
					    this.$message.success('删除成功!');
					    this.getRoomData();
				    }
			    })
		    }).catch(() => {return false});
	    },
	    search() {
		    if(!this.form.id) delete this.form.id;
		    if(!this.form.roomNumber) delete this.form.roomNumber;
		    this.getRoomData();
	    },
	    // 计算天数
	    getMonthDays() {
        	let arr = [];
		    let curDate = new Date();
		    /* 获取当前月份 */
		    let curMonth = curDate.getMonth();
		    this.curMonth = curMonth + 1;
		    /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
		    curDate.setMonth(curMonth + 1);
		    /* 将日期设置为0 */
		    curDate.setDate(0);
		    /* 返回当月的天数 */
		    return curDate.getDate()
	    },
	    toggle(b) {
        	this.isList = b;
        	if(b) {
		        this.page = 1;
		        this.size = 10;
	        }
	        else {
		        this.page = 1;
		        this.size = 50;
	        }
		    this.getRoomData();
	    }
    },
    created() {
	    this.getRoomData();
    }
};
</script>

<style lang="scss">
	.data-table {
		.el-table .el-table__body-wrapper tr, .el-table .el-table__fixed-body-wrapper tr {
			height: 20px !important;
		}
		.el-table--small td, .el-table--small th {
			padding: 0;
		}
		.center-cell {
			border-left: 1px solid red;
			border-right: 1px solid red;
		}
	}
</style>

<style lang="scss" scoped>
	.rigth-block {
		float: right;
	}
</style>