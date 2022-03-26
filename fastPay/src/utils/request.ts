import axios from 'axios';
import qs from 'qs';
import router from '~/router';
const baseConfig = {
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: process.env.NODE_ENV == 'production' ? '/' : 'api/',
  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)，如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 20000,
  // `headers` 是即将被发送的自定义请求头
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  // `paramsSerializer` 是一个负责 `params` 序列化的函数
  paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'brackets', allowDots: true }),
};

// 在发送请求之前做些什么
const formatRequestConfig = (config: any) => {
  config.data = qs.stringify(config.data)
  return config;
};

// response 处理器
const responseHandle = (response: any) => {
    //拦截响应，做统一处理 
    if (response.data.code) {
      switch (response.data.code) {
        case 999:
          router.push({path: '/login', query: {redirect: location.hostname }});
      }
    }
    return response
}

// 对请求错误做些什么
const err = (response: any) => {
  if (!response) {
    // message.error('网络开小差啦');
  } else {
    const { status } = response;
    console.log('resp', response);
    switch (status) {
      case 403:
        // 处理403
        break;
      case 401:
        window.location.href = 'http://localhost:8080';
        break;
      case 400:
        if (!response.config.ignoreError) {
          // 显示错误信息
        }
        break;
      case 999:
        window.location.href = window.location.origin + '/login';
      default:
        break;
    }
  }
  return Promise.reject(response);
};

// 新建一个 axios 实例
const service = axios.create(baseConfig);
// 添加请求拦截器
service.interceptors.request.use(formatRequestConfig, err);

service.interceptors.response.use(responseHandle, (error) => { return Promise.reject(error.response.status) })

// axios.defaults.withCredentials=true;

export {
  service as axios,
};