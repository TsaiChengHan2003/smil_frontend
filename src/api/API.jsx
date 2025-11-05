import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_API_VERSION;
const LOGIN_PAGE = import.meta.env.VITE_FRONTEND_URL;
const HOME_PAGE = import.meta.env.VITE_FRONTEND_URL;

const API = axios.create({ baseURL: BASE_URL });
const redirect = path => {
  window.location.href = `${window.location.origin}${path}`;
};

API.interceptors.request.use(function (config) {
  if (!config) {
    config = {};
  }
  if (!config.headers) {
    config.headers = {};
  }
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  if (localStorage.getItem("token")) {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  }
  return config;
});

API.interceptors.response.use(
  function (response) {
    // 處理新的 token
    if (response.headers["x-auth-token"]) {
      console.log(response);
      localStorage.setItem("token", response.headers["x-auth-token"]);
    }
    return response.data;
  },
  function (error) {
    // 確保 error.response 存在
    if (!error.response) {
      toast.error("網路連線或伺服器異常，請稍後再試");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // console.log(error.response);
    // 根據不同狀態碼處理
    switch (status) {
      case 400:
        localStorage.removeItem("token");
        if (window.location.pathname !== LOGIN_PAGE) {
          redirect(LOGIN_PAGE);
        }
        toast.error(data?.message);
        break;
      case 401:
        localStorage.removeItem("token");
        if (window.location.pathname !== LOGIN_PAGE) {
          redirect(LOGIN_PAGE);
        }
        toast.error(data?.message);
        break;
      case 403:
        if (window.location.pathname !== HOME_PAGE) {
          redirect(HOME_PAGE);
        }
        break;
      case 500:
        toast.error(data?.message || "伺服器錯誤，請稍後再試");
        break;
    }

    return Promise.reject(data || error);
  }
);

export default API;