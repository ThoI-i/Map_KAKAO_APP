export const checkLoginStatus = () => {
  const token = sessionStorage.getItem('accessToken');
  return !!token;  // 있으면 true, 없으면 false
};
