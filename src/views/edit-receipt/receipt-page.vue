<template>
    <div class="redirect-page" :style ="bg">
        <div class="receipt-module" :style="paper">
            <div class="receipt-head">
                <span class="title">公寓租金收据</span>
                <div class="receipt-number-date">
                    <p class="number">No {{receiptId}}</p>
                    <p class="date">20{{year}}年{{month}}月{{date}}日</p>
                </div>
            </div>
            <div class="receipt-content">
                <p style="padding-left: 40px;">
                    <span>今收到</span>
                    <input type="text" v-model="tenantInfo.tenant">
                    <span>交来</span>
                    <input type="text" v-model="roomNum" @keyup.13="getRoomNum($event)" v-focus="roomFocus">
                    <span>房(20</span>
                    <input type="text" class="n2" :value="year">
                    <span>年</span>
                    <input type="text" class="n2" :value="month">
                    <span>月</span>
                    <input type="text" class="n2" v-model="tenantInfo.payRentDay">
                    <span>日至20</span>
                    <input type="text" class="n2" :value="year">
                    <span>年</span>
                    <input type="text" class="n2" :value="month+1">
                    <span>月</span>
                    <input type="text" class="n2" v-model="tenantInfo.payRentDay">
                    <span>日)</span>
                </p>
                <p>
                    <span>租金：</span>
                    <input type="text" class="n2x" v-model="tenantInfo.rent">
                    <span>管理费：</span>
                    <input type="text" class="n2">
                    <span>卫生费：</span>
                    <input type="text" class="n2x" v-model="tenantInfo.publicSaniFee">
                    <span>网络费：</span>
                    <input type="text" class="n2x" v-model="tenantInfo.cost">
                    <span>电梯费：</span>
                    <input type="text" class="n2">
                    <span>其他：</span>
                    <input type="text" class="n2x">
                </p>
                <p>
                    <span>电费：本月读数</span>
                    <input type="text" v-model="currentPowerNumber" @keyup="countPower" v-focus="powerFocus">
                    <span>上月读数</span>
                    <input type="text" v-model="prev.powerNumber">
                    <span>实际用量</span>
                    <input type="text" v-model="actualDosage">
                    <span>金额</span>
                    <input type="text" v-model="powerFee">
                    <span>元</span>
                </p>
                <p>
                    <span>水费：本月读数</span>
                    <input type="text" v-model="currentWaterNumber" @keyup="countWater">
                    <span>上月读数</span>
                    <input type="text" v-model="prev.waterNumber">
                    <span>实际用量</span>
                    <input type="text" v-model="waterActualDosage">
                    <span>金额</span>
                    <input type="text" v-model="waterFee">
                    <span>元</span>
                </p>
                <p>
                    <span>合计金额(大写)：</span>
                    <span class="money-daxie">
                        <span>{{totalStr}}</span>
                    </span>
                </p>
                <p>
                    <span class="seal">收款单位盖章：</span>
                    <span class="money-num">￥：<input type="text" v-model="total" class="total"></span>
                </p>
            </div>
            <div class="receipt-foot">
                <span>核准：</span>
                <span>会计：</span>
                <span>记账：</span>
                <span>出纳：</span>
                <span>经手人：王华桥</span>
            </div>
        </div>
        <div class="btn-area">
            <a class="update-pw" @click="updatePW">更新水电读数</a>
            <a class="update-pw" @click="saveReceipt">保存收据</a>
            <a class="update-pw" @click="updateTenantData">更新租客数据</a>
        </div>
        <a class="console-btn" @click="consoleLogDBHouse">控制台打印所有数据</a>

        <a class="update-pw fast-fill" @click="fastFillReceipt">快速填写收据</a>
        <fillHydropowerReads ref="fillHydropowerReads" @makeReceipts="makeReceipts"></fillHydropowerReads>
        <receiptView ref="receipts"></receiptView>
    </div>
</template>

<script>
import tenant from '../../assets/js/tenantInfo'
import currency from '../../assets/js/convertCurrency'
import myIDB from '../../assets/js/indexedDB'
import fillHydropowerReads from './fill-hydropower-reads'
import receiptView from './all-receipts'


var countTotal = function(a,b,c,d,e) {
    a = a == ''?0:parseFloat(a);
    b = b == ''?0:parseFloat(b);
    c = c == ''?0:parseFloat(c);
    d = d == ''?0:parseFloat(d);
    e = e == ''?0:parseFloat(e);
    var total = a+b+c+d+e;
    return total;
}

var currentDate = new Date();//获取系统当前时间
var year = currentDate.getFullYear().toString().substring(2,4);

export default {
  name: 'redirect-page',
  components:{ fillHydropowerReads, receiptView },
  data () {
    return {
      roomNum: '', //输入的房号
      currentPowerNumber: '', //本月的电表读数
      actualDosage: '', //电的实际用量
      powerFee: '', //本月电费金额
      factor: 1.5, //每度电的收费
      waterFactor: 5, //每吨水的收费
      currentWaterNumber: '', //本月水表读数
      waterFee: '', //本月水费金额
      waterActualDosage: '', //水的实际用量
      tenantInfo: {},
      prev: {
          powerNumber: '', //上月电表读数 取数组最后一个
          waterNumber:'' //上月水表读数 取数组最后一个
      }, 
      total: 0,
      totalStr: '',
      year: year,
      month: currentDate.getMonth()+1,
      date: currentDate.getDate(),
      roomFocus: true,
      powerFocus: false,
      receiptId: '', //收据ID
      // 设置收据背景图 .paper
      paper: {
        backgroundImage: "url(" + require("../../assets/images/paper.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      bg: {
        backgroundImage: "url(" + require("../../assets/images/bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }
    }
  },
  methods: {
    getRoomNum() {
        myIDB.storeObj.get(this.roomNum,(res) => {
            //成功获取数据库数据
            //console.log(res);
            var houseData = res;
            this.tenantInfo = houseData;

            var month = this.month < 10 ? ('0' + this.month) : (this.month);
            var date = this.tenantInfo.payRentDay < 10 ? ('0' + this.tenantInfo.payRentDay) : (this.tenantInfo.payRentDay);
            this.receiptId = '20' + year + month + date + this.roomNum;

            //上个月电表读数
            this.prev.powerNumber = this.tenantInfo.prePowerNumber[this.tenantInfo.prePowerNumber.length-1];
            //上个月水表读数
            this.prev.waterNumber = this.tenantInfo.preWaterNumber[this.tenantInfo.preWaterNumber.length-1];

            if(this.roomNum && this.tenantInfo == undefined) {
                this.$Message.warning('没有该房间的数据');
            }
            
            this.total = countTotal(this.tenantInfo.rent,this.tenantInfo.cost,this.tenantInfo.publicSaniFee,this.powerFee,this.waterFee).toFixed(2);
            this.totalStr = currency.convertCurrency(this.total);
            this.roomFocus = false;
            setTimeout(() => {
                this.powerFocus = true;
                //alert(11);
            },100);
        });
    },
    countPower() {
        //每个月电费 = 本月读数 - 上月读数
        var count = parseInt(this.currentPowerNumber) - parseInt(this.prev.powerNumber);
        if(count < 0){
            count = 0;
        }
        this.actualDosage = count;
        this.powerFee = count*(this.tenantInfo.powerKWH?this.tenantInfo.powerKWH:this.factor);
        this.total = countTotal(this.tenantInfo.rent,this.tenantInfo.cost,this.tenantInfo.publicSaniFee,this.powerFee,this.waterFee).toFixed(2);
        this.totalStr = currency.convertCurrency(this.total);
        
    },
    countWater() {
        var count = parseInt(this.currentWaterNumber) - parseInt(this.prev.waterNumber);
        if(count < 0){
            count = 0;
        }
        this.waterActualDosage = count;
        this.waterFee = count*this.waterFactor;
        this.total = countTotal(this.tenantInfo.rent,this.tenantInfo.cost,this.tenantInfo.publicSaniFee,this.powerFee,this.waterFee).toFixed(2);
        this.totalStr = currency.convertCurrency(this.total);
    },
    updatePW() {
        var currentPower = parseFloat(this.currentPowerNumber);
        var prevPower = parseFloat(this.prev.powerNumber);
        var currentWater = parseFloat(this.currentWaterNumber);
        var prevWater = parseFloat(this.prev.waterNumber);

        if(currentPower == '' || !currentPower) {
            return this.$Message.warning('本月的电表读数不可以为空');

        }
        if(currentPower < prevPower) {
            return this.$Message.warning('本月的电表读数小于上月读数，改一下吧，不然就倒贴钱了');
        }
        if(currentWater == '' || !currentWater) {
            return this.$Message.warning('本月的水表读数不可以写空');
        }
        if(currentWater < prevWater) {
            return this.$Message.warning('本月的水表读数小于上月读数，改一下吧，不然就倒贴钱了');
        }

        //console.log(this.tenantInfo,currentPower);
        var data = Object.assign(this.tenantInfo);
        data.prePowerNumber.push(currentPower);
        data.preWaterNumber.push(currentWater);

        myIDB.storeObj.put(data,(res) => {
	        this.$Notice.success({title: '水电表读数更新好了', duration: 5});
        });
    },
    updateTenantData() {
        var data = Object.assign(this.tenantInfo);
        data.tenant = this.tenantInfo.tenant;
        console.log(data);
        myIDB.storeObj.put(data,(res) => {
	        this.$Notice.success({title: '基本信息已经更新啦~', duration: 5});
        });
    },
    saveReceipt() {
        var receipt = {
            id: this.receiptId, //收据编号
            roomNumber: this.roomNum, //房间号
            rent: this.tenantInfo.rent, //租金
            cost: this.tenantInfo.cost, //网费
            publicSaniFee: this.tenantInfo.publicSaniFee, //卫生费
            prePowerNumber: this.prev.powerNumber, //上月电表读数
            preWaterNumber: this.prev.waterNumber,   //上月水表读数
            currentPowerNumber: this.currentPowerNumber, //本月电表读数
            currentWaterNumber: this.currentWaterNumber,   //本月水表读数
            payRentDay: this.tenantInfo.payRentDay, //交租日期
            powerFee: this.powerFee, //电费
            waterFee: this.waterFee, //水费
            total: this.total, //总数
            actualDosage: this.actualDosage, //电的实际用量
            waterActualDosage: this.waterActualDosage, //水的实际用量
            tenant: this.tenantInfo.tenant, //租客名字
            year: this.year,
            month: this.month
        }
        myIDB.storeObj.receiptAdd(receipt,(res) => {
	        this.$Notice.success({title: '收据保存好了~'});

            //保存成功后更新水电读数
            var currentPower = parseFloat(this.currentPowerNumber);
            var prevPower = parseFloat(this.prev.powerNumber);
            var currentWater = parseFloat(this.currentWaterNumber);
            var prevWater = parseFloat(this.prev.waterNumber);

            if(currentPower == '' || !currentPower) {
                return this.$Message.warning('本月的电表读数不可以为空');
            }
            if(currentPower < prevPower) {
                return this.$Message.warning('本月的电表读数小于上月读数，改一下吧，不然就倒贴钱了');
            }
            if(currentWater == '' || !currentWater) {
                return this.$Message.warning('本月的水表读数不可以写空');
            }
            if(currentWater < prevWater) {
                return this.$Message.warning('本月的水表读数小于上月读数，改一下吧，不然就倒贴钱了');
            }

            //console.log(this.tenantInfo,currentPower);
            var data = Object.assign(this.tenantInfo);
            data.prePowerNumber.push(currentPower);
            data.preWaterNumber.push(currentWater);

            myIDB.storeObj.put(data,(res) => {
	            this.$Notice.success({title: '水电表读数也更新了，不用再点更新了', duration: 5});
            });
        });
    },
    consoleLogDBHouse() {
        var JSONstr = '';
        myIDB.storeObj.fetchStoreByCursor('HOUSE',res => {
            if(res.key && !res.key.includes('测试')) {
                if(res.key != '') {
                    //console.log(res.value);
                    var roomDataStr = '"' + res.key + '"' + ':' + JSON.stringify(res.value) + ',';
                    JSONstr += roomDataStr;
                }
            }
            else if(res == '游标结束'){
                console.log('所有房间的JSON数据：', JSONstr); 
            }
        });

        var receiptJSONstr = '';
        myIDB.storeObj.fetchStoreByCursor('room',res => {
            if(res.key && !res.key.includes('测试')) {
                if(res.key != '') {
                    //console.log(res.value);
                    var receiptDataStr = '"' + res.key + '"' + ':' + JSON.stringify(res.value) + ',';
                    receiptJSONstr += receiptDataStr;
                }
            }
            else if(res == '游标结束'){
                console.log('历史收据的JSON数据：', receiptJSONstr);
            }
        });
    },
    fastFillReceipt() {
        this.$refs.fillHydropowerReads.$emit('show')
    },
    makeReceipts(data) {
	    this.$refs.receipts.$emit('showReceipts',{data})
    },
  },
    directives: {
        focus: {
            inserted: function (el, {value}) {
                if (value) {
                    el.focus();
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.redirect-page {
		position: fixed;
	    top: 100px;
	    bottom: 0;
	    left: 200px;
	    right: 0;
	    min-width: 900px;
	    padding: 50px;
	}
    p {
        margin: 0;
    }
    .receipt-module {
        width: 840px;
        height: 340px;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 0 200px 10px 80px;
        position: relative;
        font-size: 14px;
    }
    .receipt-head {
        position: relative;
        padding: 20px 0;
    }
    .receipt-head .title{
        display: block;
        font-size: 26px;
        font-weight: bold;
        margin: 0 auto;
        text-align: center;
        letter-spacing:9px;
    }
    .receipt-number-date {
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .receipt-content {
        border: 1px solid #000;
        padding: 10px;
        line-height: 32px;
        overflow: hidden;
    }
    .receipt-content p {
        letter-spacing:2px;
    }
    .receipt-content p input {
        width: 55px;
        height: 18px;
        color: #495060;
        text-align: center;
        border: none;
        border-bottom: 1px solid #000;
        margin: 0 -7px;
        background: rgba(255,255,255,0);
    }
    .receipt-content p input.n2 {
        width: 15px;
    }
    .receipt-content p input.n2x {
        width: 30px;
    }
    .money-daxie {
        display: inline-block;
        letter-spacing:10px;
        padding-left: 40px;
        border-bottom: 1px solid #000;
        width: 350px;
    }
    .seal {
        float: left;
        padding: 5px;
        padding-left: 0;
    }
    .money-num {
        float: right;
        margin-right: 12px;
        padding: 5px;
    }

    .receipt-foot {
        position: absolute;
        bottom: 15px;
        display: flex;
        justify-content: space-between;
        width: 560px;
    }
    .receipt-content p input.total {
        width: 80px;
    }
    .update-pw {
        font-size: 12px;
        background-color: #2d78f4; 
        color: #fff;
        padding: 10px;
        text-align: center;
        float: right;
        cursor: pointer;
        margin-right: 10px; 
    }
    .btn-area {
        width: 600px;
        margin: 0 auto;
        padding: 0 30px 0 10px;
        box-sizing: border-box;
        overflow: hidden;
    }
    .console-btn {
        position: absolute;
        bottom: 20px;
        left: 20px;
        text-decoration: underline;
        color: #2d78f4;
    }
    .fast-fill {
        position: absolute;
        top: 10px;
        left: 10px;
    }

</style>
