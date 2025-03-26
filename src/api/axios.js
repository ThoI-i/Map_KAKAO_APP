import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000',  // ✅ 백엔드 주소!
  withCredentials: true,              // ✅ 쿠키 포함 필수!
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;