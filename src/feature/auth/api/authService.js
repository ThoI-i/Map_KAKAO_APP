// services/authService.js
export const checkLoginStatus = () => {
  const token = sessionStorage.getItem('accessToken');
  console.log('🔑 accessToken:', token);
  return !!token;
};
