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
    credentials: "include",
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (result.status != 200) {
    if (result.status == 503 || result.status == 403) {
      console.log("결과에 이상이 있습니다! : " + result.status);
      return {
        state: "false",
        error: "인증에 실패하였습니다! 다시 로그인 해 주세요!",
      };
    }

    console.log("결과에 이상이 있습니다! : " + result.status);
    return {
      state: "fetchError",
      error: "결과를 받아오지 못했습니다!",
    };
  }
  const resultData = await result.json();

  if (resultData.state !== "true") {
    console.log("결과에 이상이 있습니다! : " + resultData.error);
    return {
      state: "statusError",
      error: "결과에 이상이 있습니다! : " + resultData.error,
    };
  } else {
    console.log("OK " + result.status);
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
      localStorage.setItem("userPhoto", resultData.userPhoto);
      localStorage.setItem("uid", resultData.uid);
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
      localStorage.setItem("userPhoto", resultData.userPhoto);
      localStorage.setItem("uid", resultData.uid);
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

export const springSocialLogin = async (params: any) => {
  try {
    // 유효성 체크

    // 유저 추가 동작
    const createUserResult = await fetch(
      import.meta.env.VITE_APP_SPRING_API_URL +
        "login/oauth2/code/google?" +
        params,
      {
        credentials: "include",
      }
    );
    const result = await createUserResult.json();
    if (!result) {
      console.log("error");
      return {
        state: "false",
        error: "로그인중 문제가 발생했습니다",
      };
    }
    if (result.state == "false") {
      console.log("error");
      return {
        state: "false",
        error: "로그인중 문제가 발생했습니다 : " + result.error,
      };
    } else {
      console.log("create ok");
      localStorage.setItem("token", result.token);
      localStorage.setItem("userPhoto", result.userPhoto);
      localStorage.setItem("uid", result.uid);
      return {
        state: "true",
        error: "",
      };
    }
  } catch (e: any) {
    // 에러 형태가 firebase error일 경우
    console.log(e.message);
    return {
      state: "false",
      error: "로그인중 문제가 발생했습니다 : " + e.message,
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
    localStorage.removeItem("userPhoto");
    localStorage.removeItem("uid");
  } catch (e: any) {
    console.log("logout error");
    console.log(e.message || "error");
  }
};

export const memberRemove = async () => {
  // 토큰 가져오기
  const tk = localStorage.getItem("token");

  // 저장된 uid 가져오기
  const u = localStorage.getItem("uid");

  if (!tk || !u) {
    console.log("token error");
    return {
      state: "token_error",
      error: "인증 정보가 없습니다!",
    };
  }
  //delete 는 body가 없음
  const result = await fetch(apiUrl + "login/api/RemoveMember", {
    credentials: "include",
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + tk,
    },
  });

  if (result.status != 200) {
    console.log("mem quit error");
    try {
      const resultData = await result.json();
      return resultData;
    } catch (error) {
      return {
        state: "fetchError",
        error: "회원탈퇴에 실패하였습니다! : 연결문제 " + result.status,
      };
    }
  }

  const resultData = await result.json();
  if (!resultData) {
    return {
      state: "data_error",
      error: "회원탈퇴에 실패하였습니다! : 데이터를 제대로 받지 못했습니다!",
    };
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    localStorage.removeItem("userPhoto");
    return resultData;
  }
};
