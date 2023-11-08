/* eslint-disable @typescript-eslint/no-explicit-any */
const apiUrl = import.meta.env.VITE_APP_SPRING_API_URL;

export const MEM_MIN_ID_LENGTH = 3;
export const MEM_MIN_PASSWD_LENGTH = 5;
export const MEM_MIN_NAME_LENGTH = 1;
export const MEM_MIN_NICKNAME_LENGTH = 2;
export const MEM_MIN_EMAIL_LENGTH = 6;

export const MEM_MAX_ID_LENGTH = 45;
export const MEM_MAX_PASSWD_LENGTH = 50;
export const MEM_MAX_NAME_LENGTH = 15;
export const MEM_MAX_NICKNAME_LENGTH = 15;
export const MEM_MAX_EMAIL_LENGTH = 45;

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

export const signupSpring = async (
  name: string,
  email: string,
  passwd: string
) => {
  // 유효성 체크
  if (
    name === "" ||
    name.length < MEM_MIN_NAME_LENGTH ||
    name.length > MEM_MAX_NAME_LENGTH ||
    email === "" ||
    email.length < MEM_MIN_EMAIL_LENGTH ||
    email.length > MEM_MAX_EMAIL_LENGTH ||
    passwd === "" ||
    passwd.length < MEM_MIN_PASSWD_LENGTH ||
    passwd.length > MEM_MAX_PASSWD_LENGTH
  )
    return {
      state: "strCheckError",
      error:
        "회원가입 중 문제가 발생하였습니다! 입력 값이 비어 있거나 길이가 충족되지 않습니다",
    };

  // 해싱
  // const salt = await genSalt(10);
  // const hashPasswd = await hash(passwd, salt);

  // console.log(hashPasswd);
  // 유저 추가 동작
  const createUserResult = await fetch(apiUrl + "login/api/CreateUserPro", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, passwd }),
  });

  if (createUserResult.status != 200) {
    return {
      state: "fetchError",
      error: "회원가입 중 문제가 발생하였습니다!",
    };
  }
  const resultData = await createUserResult.json();

  console.log(resultData);
  if (resultData.state != "true" || resultData.error !== "") {
    return {
      state: "statusError",
      error: "회원가입 진행 중 문제가 발생했습니다! : " + resultData.error,
    };
  } else {
    if (resultData.token && resultData.token !== "") {
      // 새로 받은 토큰 집어넣기
      localStorage.setItem("token", resultData.token);
      return {
        state: "true",
        error: "",
      };
    }
    return {
      state: "statusError",
      error: "회원가입 진행 중 문제가 발생했습니다! : " + resultData.error,
    };
  }
};

export const loginSpring = async (email: string, passwd: string) => {
  // 유효성 체크
  if (email === "" || passwd === "") return;

  // 해싱
  // const salt = await genSalt(10);
  // const hashPasswd = await hash(passwd, salt);

  // 로그인 동작
  const result = await fetch(apiUrl + "login/api/LoginPro", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, passwd }),
  });

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
      };
    }
    return {
      state: "statusError",
      error: "로그인 진행 중 문제가 발생했습니다! : " + resultData.error,
    };
  }
};

export const logoutSpring = async () => {
  const result = await fetch(apiUrl + "login/api/LogoutPro", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
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
