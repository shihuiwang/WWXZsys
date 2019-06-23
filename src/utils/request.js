import axios from 'axios';
import { Message } from 'element-ui'
import { host } from './host';

const baseURL = host['dev'];
const service = axios.create({
    baseURL: baseURL,
    timeout: 10000,
});
service.interceptors.request.use(config => {
    //config.headers['APP-VERSION'] = '1.0';
    return config
}, error => {
    Promise.reject(error)
});

service.interceptors.response.use(res => {
    if (!res.data.code) {
		Message({ message: res.data.msg, type: 'error' })
    }
    //request config meta : default data
    if (res.request.status === 200 && res.data.code === 200) {
        return res.data;
    }
    return res.data || res;
}, error => {
    Message({ message: '网络连接超时，请稍后再试', type: 'warning' })
    return Promise.reject(error)
});

export { service };
