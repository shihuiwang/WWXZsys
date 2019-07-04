import Vue from 'vue';
import time from './time';

const method = {
  /**
   * @entry 时间戳 string
   * @return default 'yyyy-MM-dd'
   */
  time: (value, format) => {
    if (!value) return '0000-00-00';
    let _format = format || 'yyyy-MM-dd'; //'yyyy-MM-dd HH:mm:ss'
    if (_format === 'cn') {
      let dateArr = new Date(value).toLocaleDateString().split('/')
      return `${dateArr[0]}年${dateArr[1]}月${dateArr[2]}日`
    }
	if (_format === '/') {
		let dateArr = new Date(value).toLocaleDateString().split('/')
		return `${dateArr[0]}/${dateArr[1]}/${dateArr[2]}`
	}
    let date = new Date();
    date.setTime(value);
    return time.dateFormat(date, _format);
  }
}
for (let key in method) {
  Vue.filter(key, method[key])
}

export default method;
