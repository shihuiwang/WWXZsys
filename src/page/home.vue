<template>
	<div class="home-container">
		<ul class="month-tab">
			<li>{{currentYear}}</li>
			<li v-for="index in 12" :key="index" @click="changeMonth(index)" :class="{active: (index < 10 ? '0' + index : index) === currentMonth}">
				<el-button type="text" :disabled="index > new Date().getMonth() + 1">{{index}}月</el-button>
			</li>
		</ul>
		<!--<el-card class="box-card" v-for="(num, index) in Object.keys(build)" :key="index">-->
		<el-card class="box-card">
			<el-table ref="tableData" show-summary :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="expand-box">
              <div>租金收入: <span>{{props.row.rent_in}}</span> </div>
              <div>电费收入: <span>{{props.row.powerFee_in}}</span> </div>
              <div>水费收入: <span>{{props.row.waterFee_in}}</span> </div>
              <div>网费收入: <span>{{props.row.cost_in}}</span> </div>
              <div>卫生费收入: <span>{{props.row.publicSaniFee_in}}</span> </div>
            </div>
          </template>
        </el-table-column>
				<el-table-column prop="build" label="楼栋"></el-table-column>
				<el-table-column prop="_in" label="收入">
					<template slot-scope="scope">
						{{scope.row._in}}
					</template>
				</el-table-column>
				<el-table-column prop="out" label="支出">
          <template  slot-scope="scope">{{build[scope.row.build]}}</template>
        </el-table-column>
				<el-table-column prop="total" label="盈余">
          <template  slot-scope="scope">{{scope.row._in - build[scope.row.build]}}</template>
        </el-table-column>

			</el-table>
		</el-card>
	</div>
</template>

<script>
  const obj = {
    out: 0,
    _in: 0,
    rent_in: 0,
    powerFee_in: 0,
    waterFee_in: 0,
    cost_in: 0,
    publicSaniFee_in: 0,
    total: 0
  }
	export default {
		name: "home",
		data() {
			return {
        tableData: [
          { build: 'A', ...obj },
          { build: 'B', ...obj },
          { build: 'C', ...obj },
          { build: 'D', ...obj },
          { build: 'E', ...obj }
        ],
				build: { A: '4000', B: '5200', C: '8800', D: '6000', E: '2750' },
				currentMonth: (new Date().getMonth() + 1) < 10 ? ('0' + (new Date().getMonth() + 1)) : ((new Date().getMonth() + 1)),
				currentYear: new Date().getFullYear()
			}
		},
		methods: {
			changeMonth(month) {
				if(month > new Date().getMonth() + 1) return false
				month = month < 10 ? ('0' + month) : (month);
				this.currentMonth = month;
				this.get();
			},
			get() {
				this.loading = true;
				this.$http.post('/historyReceipt/list', {
					page: 1,
					size: 100,
					id: `${this.currentYear}${this.currentMonth}`,
          status: 1
				}).then(res => {
					this.loading = false;
					if(res.code === 200) {
            Object.keys(this.build).map(val => {
              this.tableData.map(value => {
                // value = { build: value.build, ...obj }
                if(value.build === val) {
                  const data = res.data.filter(_val => _val.roomNumber.substring(0,1) === val);
                  this.$set(value, 'data', data);
                  data.map(sum => {
                    value._in = parseInt(value._in) + parseInt(sum.total);
                    value.rent_in = parseInt(value.rent_in) + parseInt(sum.rent);
                    value.powerFee_in = parseInt(value.powerFee_in) + parseInt(sum.powerFee);
                    value.waterFee_in = parseInt(value.waterFee_in) + parseInt(sum.waterFee);
                    value.publicSaniFee_in = parseInt(value.publicSaniFee_in) + parseInt(sum.publicSaniFee);
                    value.cost_in = parseInt(value.cost_in) + parseInt(sum.cost);
                  });
                }
              })
            })
					}
					if(!res.code) return Message.error(res.msg);
				});
			}
		},
		created() {
			this.get();
		}
	}
</script>

<style lang="scss" scoped>
	.home-container {
		height: 100%;
		padding: 10px 20px;
		.month-tab {
			background-color: #fff;
			display: flex;
			align-items: center;
			padding: 5px 10px;
			margin-bottom: 10px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			li {
				width: 80px;
				text-align: center;
				&.active {
					background-color: #409EFF;
				}
			}
		}
		.box-card {
			margin-top: 2px;
			.card-content {
				display: flex;
				position: relative;
				.mini-card {
					width: 300px;
					display: flex;
					height: 70px;
					margin-right: 60px;
					border-top-left-radius: 5px;
					border-top-right-radius: 0px;
					border-bottom-right-radius: 0px;
					border-bottom-left-radius: 5px;
					overflow: hidden;
					border: 1px solid #409EFF;
					.right {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 100px;
						background-color: #409EFF;
						color: #FFF;
					}
					.left {
						display: flex;
						align-items: center;
						justify-content: center;
						flex: 1;
						color: #409EFF;
					}
					&.out {
						border: 1px solid #E6A23C;
						.right {
							background-color: #E6A23C;
						}
						.left {
							color: #E6A23C;
						}
					}
					&.sur {
						border: 1px solid #67C23A;
						.right {
							background-color: #67C23A;
						}
						.left {
							color: #67C23A;
						}
					}
					&.total {
						position: absolute;
						right: 0;
						top: 0;
						border: 1px solid #909399;
						.right {
							background-color: #909399;
						}
						.left {
							color: #909399;
						}
					}
				}
			}
		}
		.el-card__header {
			padding: 10px 20px;
		}
    .expand-box {
      line-height: 30px;
    }
	}
</style>

<style lang="scss">
	.home-container {
		.el-card__header {
			padding: 10px 20px;
		}
		li {
			&.active {
				.el-button--text,
				.el-button--text:focus,
				.el-button--text:hover {
					color: #fff;
				}
			}
		}
	}
</style>