export const checkLoginStatus = async () => {
  try {
    const token = localStorage.getItem("token"); // ✅ 저장된 토큰 가져오기
    if (!token) return false;

    const response = await fetch("/auth/check", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Unauthorized");

    return true;
  } catch (error) {
    console.warn("⛔ 로그인 필요!", error);
    return false;
  }
};

// ✅ 로그인 후 토큰 저장 함수
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};
