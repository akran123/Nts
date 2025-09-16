import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
});

//  요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  응답 인터셉터 (토큰 오류 처리)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      alert(message || "로그인이 필요합니다.");
      localStorage.clear();
    } else if (status === 403) {
      alert(message || "권한이 없습니다.");
    } else if (status === 404) {
      alert(message || "데이터를 찾을 수 없습니다.");
    } else if (status >= 500) {
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } else if (status ===409){
      alert("데이터베이스 조건을 위배하였습니다.")
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
