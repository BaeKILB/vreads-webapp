/* eslint-disable @typescript-eslint/no-explicit-any */
const apiUrl = import.meta.env.VITE_APP_SPRING_API_URL;

export const checkToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return {
      state: "emptyToken",
      error: "토큰이 존재하지 않습니다!",
    };
  }
  const result = await fetch(apiUrl + "api/auth/checkToken", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  console.log(result);
  if (result.status != 200) {
    if (result.status == 503 || result.status == 403) {
      return {
        state: "false",
        error: "인증에 실패하였습니다! 다시 로그인 해 주세요!",
      };
    }
    return {
      state: "fetchError",
      error: "결과를 받아오지 못했습니다!",
    };
  }
  const resultData = await result.json();
  console.log(resultData);
  if (resultData.state == "false") {
    return {
      state: "statusError",
      error: "결과에 이상이 있습니다! : " + resultData.error,
    };
  } else {
    if (resultData.newToken && resultData.newToken !== "") {
      // 새로 받은 토큰 집어넣기
      localStorage.setItem("token", resultData.newToken);
      return {
        state: "true",
        error: "",
      };
    }
    return {
      state: "true",
      error: "",
    };
  }
};

export const loginSpring = async (email: string, passwd: string) => {
  // 유효성 체크
  if (email === "" || passwd === "") return;
  // 유저 추가 동작
  const result = await fetch(apiUrl + "login/api/LoginPro", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, passwd }),
  });

  console.log(result);
  if (result.status != 200) {
    return {
      state: "fetchError",
      error: "로그인 중 문제가 발생하였습니다!",
    };
  }
  const resultData = await result.json();
  console.log(resultData);
  if (resultData.state != "true" || resultData.error !== "") {
    return {
      state: "statusError",
      error: "로그인 진행 중 문제가 발생했습니다! : " + resultData.error,
    };
  } else {
    if (resultData.token && resultData.token !== "") {
      // 새로 받은 토큰 집어넣기
      localStorage.setItem("token", resultData.token);
      return {
        state: "true",
        error: "",
        token: resultData.token,
      };
    }
    return {
      state: "statusError",
      error: "로그인 진행 중 문제가 발생했습니다! : " + resultData.error,
    };
  }
};

export const logoutSpring = async () => {
  const result = await fetch(apiUrl + "login/api/LogoutPro");
  console.log(result);
  if (result.status != 200) {
    console.log("logout error");
    return {
      state: "fetchError",
      error: "로그아웃에 실패하였습니다!",
    };
  }
  try {
    localStorage.removeItem("token");
  } catch (e: any) {
    console.log("logout error");
    console.log(e.message || "error");
  }
};
