import axios, { AxiosResponse } from "axios";
import { message } from "antd";
import { LOCALSTORAGE_TOKEN } from "@/constants/index";

// 创建 axios 实例
const instance = axios.create({
  // baseURL: process.env.BASE_API_URL,
  timeout: 20000,
  headers: {
    post: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
  },
});

// 请求拦截器
instance.interceptors.request.use(
  function (conf: any) {
    const config = conf;
    const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

interface ResponseInterface<T = any> {
  code: number;
  data: any;
  message: string;
}

// 响应拦截器
instance.interceptors.response.use(
  function (response: AxiosResponse<ResponseInterface>): any {
    // 将 data 的内容直接返回
    return response.data;
  },
  function (error: any) {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          // 客户端环境
          if (typeof window !== "undefined") {
            window.location.href = "/user/login";
          }
          break;
        case 500:
          message.error(error.response.data.msg);
          break;
        default:
          message.error("An error occurred");
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
