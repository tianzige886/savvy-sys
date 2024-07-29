import axios from "axios";
import { message } from "antd";
import { LOCALSTORAGE_TOKEN } from "@/constants/index";

const instance = axios.create({
  // baseURL: process.env.BASE_API_URL,
  timeout: 20000,
  headers: {
    post: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
  },
});

instance.interceptors.request.use(
  function (conf: any) {
    const config = conf;
    let token = window.localStorage.getItem(LOCALSTORAGE_TOKEN);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response: any) {
    if (response.data.msg) {
      message.success(response.data.msg);
    }
    return response.data;
  },
  function (error: any) {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          // 客户端环境
          window && (location.href = "/user/login");
        case 500:
          message.error(error.response.data.msg);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
