//indexedDB数据仓库
/*indexedDB怎么玩

IndexedDB 鼓励使用的基本模式如下所示：

打开数据库并且开始一个事务。
创建一个 object store。
构建一个请求来执行一些数据库操作，像增加或提取数据等。
通过监听正确类型的 DOM 事件以等待操作完成。
在操作结果上进行一些操作（可以在 request 对象中找到）*/
import tenant from './tenantInfo'

var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var db;
if(!indexedDB) {
    console.log("你的浏览器不支持IndexedDB");
}

//第一个参数是数据库的名称，第二个参数是数据库的版本号。
var request = indexedDB.open('wwxz', 8);

request.onerror = function(e) {
    console.log(e.currentTarget.error.message);
};
  
request.onsuccess = function(e) {   
    db = e.target.result; 
    console.log('成功打开DB');  
};

request.onupgradeneeded = function(e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains('HOUSE')) {
        console.log("我需要创建一个新的HOUSE存储对象");
        //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
        var objectStore = db.createObjectStore('HOUSE', {
            keyPath: "roomNumber"
        });

        //指定可以被索引的字段，unique字段是否唯一
        objectStore.createIndex("rent", "rent", {
            unique: false
        });
        objectStore.createIndex("cost", "cost", {
            unique: false
        });
        objectStore.createIndex("payRentDay", "payRentDay", {
            unique: false
        });

	    // 在新创建的对象存储空间中保存值
	  	for (var i in tenant.tenantInfo) {
	  		console.log(tenant.tenantInfo[i]);
	    	objectStore.add(tenant.tenantInfo[i]);
	  	}
    }
    if (!db.objectStoreNames.contains('room')) {
        console.log("我需要创建一个新的room存储对象");
        //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
        var objectStore = db.createObjectStore('room', {
            keyPath: "id",
            unique: true
        });

        //指定可以被索引的字段，unique字段是否唯一
        objectStore.createIndex("rent", "rent", { //房租
            unique: false
        });
        objectStore.createIndex("cost", "cost", { //网费
            unique: false
        });
        objectStore.createIndex("payRentDay", "payRentDay", { //交租日期
            unique: false
        });
        objectStore.createIndex("total", "total", { //共计租金
            unique: false
        });
        objectStore.createIndex("year", "year", { //年份
            unique: false
        });
        objectStore.createIndex("powerFee", "powerFee", { //电费
            unique: false
        });
        objectStore.createIndex("waterFee", "waterFee", { //水费
            unique: false
        });
        objectStore.createIndex("roomNumber", "roomNumber", { //房间号
            unique: false
        });
        objectStore.createIndex("publicSaniFee", "publicSaniFee", { //卫生费
            unique: false
        });

	    // 在新创建的对象存储空间中保存值
	  	for (var i in tenant.roomJSON) {
	  		console.log(tenant.roomJSON[i]);
	    	objectStore.add(tenant.roomJSON[i]);
	  	}
    }
    console.log('数据库版本更改为： ' + db.version);
};

var storeObj = {
    get: function(key,success) {
        var transaction = db.transaction('HOUSE', 'readwrite');
        //获取objectStore
        var store = transaction.objectStore('HOUSE'); 
        var request = store.get(key);
        request.onsuccess = function(e) {
            var res = e.target.result;
            if(success) success(res);
        };
    },
    put: function(data,success) {
        var transaction = db.transaction('HOUSE', 'readwrite');
        //获取objectStore
        var store = transaction.objectStore('HOUSE'); 
        var request = store.put(data);
        request.onsuccess = function(e) {
            var res = e.target;
            if(success) success(res);
        };
    },
    add: function(data,success) {
        var transaction = db.transaction('HOUSE', 'readwrite');
        //获取objectStore
        var store = transaction.objectStore('HOUSE'); 
        var request = store.add(data);
        request.onsuccess = function(e) {
            var res = e.target.result;
            if(success) success(res);
        };
    },
    receiptAdd: function(data,success) {
        var transaction = db.transaction('room', 'readwrite');
        //获取objectStore
        var store = transaction.objectStore('room'); 
        var request = store.put(data);
        request.onsuccess = function(e) {
            var res = e.target;
            if(success) success(res);
        };
    },
    fetchStoreByCursor(storeName,success,by){
        var transaction=db.transaction(storeName);
        var store=transaction.objectStore(storeName);
        var request=store.openCursor(null, 'prev');
        request.onsuccess=function(e){
            var cursor=e.target.result;
            if(cursor){
                var month = cursor.key.substring(4,6);
                var date = new Date().getDate();
                //by是上个月的月数，如果传入月数by则只拿by的20号以上的收据数据
                if(by && month >= by ) {
	                success(cursor);
	                if(month == by && cursor.key.substring(6,8) > 20 && date < 10) {
		                cursor.continue();
                    }
                    else if(month > by) {
	                    cursor.continue();
                    }
                    else {
		                success('游标结束');
	                }
                }
                else if(!by) {
	                success(cursor);
	                cursor.continue();
                }
                else {
	                success('游标结束');
                }
            }
            if(!cursor){
                success('游标结束');
            }
        };
    }
}

export default {
	storeObj
}