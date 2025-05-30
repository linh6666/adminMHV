import axios from "axios";
import { BASE_API_FASTAPI } from "../config";

const createApiInstance = (baseURL: string) => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      
    },
  });

  // Thêm interceptor request để tự động gắn token Authorization
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor response xử lý lỗi 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.error("API request failed:", error);

      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // tránh vòng lặp vô hạn

        // Gọi API refresh token ở đây (nếu bạn có API refresh token)
        // Ví dụ giả định bạn có refresh token trong localStorage và API refresh token là /auth/refresh
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) {
            // Chưa có refresh token -> logout hoặc redirect login
            return Promise.reject(error);
          }

          const response = await axios.post(`${baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const newToken = response.data.access_token;
          localStorage.setItem("jwt", newToken);

          // Cập nhật lại header Authorization với token mới
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Thử gọi lại request ban đầu với token mới
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh token thất bại, logout hoặc redirect login
          localStorage.removeItem("jwt");
          localStorage.removeItem("refresh_token");
          // Bạn có thể redirect về trang login ở đây nếu cần
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

const api = createApiInstance(BASE_API_FASTAPI || "");

export { api };
