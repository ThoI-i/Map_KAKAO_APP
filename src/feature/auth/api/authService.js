// 로그인 요청(지도 클릭 시)
export const login = async (emailOrNickname, password) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ emailOrNickname, password }),
    });

    // ✅ 응답이 JSON인지 먼저 안전하게 확인
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`서버 오류: ${text}`);
    }

    // ✅ 상태 코드 확인
    if (!res.ok) {
      throw new Error(data?.error || "로그인 실패");
    }

    if (!data.accessToken) {
      throw new Error("accessToken이 응답에 포함되지 않았어요 😢");
    }

    return data;

  } catch (err) {
    console.error("로그인 실패:", err);
    throw err;
  }
};


// Refresh Token O / Access Token X(새로고침 시)
/**
 * 앱 초기 로딩 시 Access Token이 없을 경우
 * Refresh Token이 있다면 조용히 Access Token을 재발급
 */
export const initializeAuth = async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    console.log("✅ accessToken 이미 있음");
    return;
  }

  try {
    const newAccessToken = await refreshAccessToken(); // <- 이미 만든 함수 사용
    sessionStorage.setItem("accessToken", newAccessToken);
    console.log("🔁 초기화: AccessToken 재발급 성공");
  } catch (err) {
    console.warn("⚠️ 초기화 실패: refreshToken 없거나 만료됨");
  }
};

// 백엔드(API) Access Token 검증 요청
export const validateAccessToken = async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const res = await fetch("/api/token/access/validate", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`, // ❗ null이면 잘못된 요청이야
      "Cache-Control": "no-cache", // 👈 캐시 방지!
    },
  });

  console.log("🧪 validateAccessToken status:", res.status); // 이거 꼭 넣어!
  return res.ok;
};

// 프론트 Refresh Token 쿠키 → 백엔드 전송/확인 → Access Token 재발행
export const refreshAccessToken = async () => {
  const res = await fetch("/api/token/refresh", {
    method: "POST",
    credentials: "include", // ⭐️ 쿠키 포함!
  });

  console.log("🔎 refresh response 상태 코드:", res.status);

  if (!res.ok) {
    throw new Error("❌ Refresh Token 실패!"); // ❗ 이게 호출돼야 catch로 감
  }

  const { accessToken } = await res.json();
  return accessToken;
};

// 자동 로그인
export const tryAutoLogin = async () => {
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    const isValid = await validateAccessToken();
    if (isValid) return true;
  }

  try {
    const newAccessToken = await refreshAccessToken();
    sessionStorage.setItem("accessToken", newAccessToken);
    return true;
  } catch {
    return false;
  }
};
