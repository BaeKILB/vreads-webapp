import { SET_PAGE_LIST_LIMIT_INIT, START_COUNT_INIT } from "./springVreads";

/* eslint-disable @typescript-eslint/no-explicit-any */
const apiUrl = import.meta.env.VITE_APP_SPRING_API_URL + "api/userInfo";

export interface IUser {
  mem_idx: number;
  mem_id: string;
  mem_name: string;
  mem_nickname: string;
  mem_passwd: string;
  mem_address: string;
  mem_birthday: string;
  mem_interest: string;
  mem_email: string;
  mem_mtel: string;
  role: string;
  mem_bio: string;
  mem_account_auth: string;
  mem_status: string;
  mem_rank: string;
  mem_profileImageUrl: string;
  mem_sign_date: string;
}

export const springUserInfo = async (uidStr: string) => {
  const token = localStorage.getItem("token");
  try {
    // 유저 정보 가져오기
    const createUserResult = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ uidStr }),
    });

    if (createUserResult.status != 200) {
      console.log("error");
      return {
        state: "false",
        error: "유저 정보 받는 중 문제가 발생했습니다",
      };
    }

    const result = await createUserResult.json();
    if (!result) {
      console.log("error");
      return {
        state: "false",
        error: "유저 정보 받는 중 문제가 발생했습니다",
      };
    }
    if (result.state !== "true") {
      console.log("error : " + result.error);
      return {
        state: "false",
        error: "유저 정보 받는 중 문제가 발생했습니다 : " + result.error,
      };
    } else {
      console.log("create ok");
      return result;
    }
  } catch (e: any) {
    // 에러 형태가 firebase error일 경우
    console.log(e.message);
    return {
      state: "false",
      error: "유저 정보 받는 중 문제가 발생했습니다 : " + e.message,
    };
  }
};

export const springProfileUpdate = async (
  mem_nickname: string,
  mem_bio: string,
  file: any
) => {
  const token = localStorage.getItem("token");
  const uidStr = localStorage.getItem("uid");

  if (!token || token === "" || !uidStr || uidStr === "")
    return {
      state: "tokenError",
      error:
        "Profile update 중 문제가 발생하였습니다! 새로고침 또는 다시 로그인 해주세요",
    };
  console.log(mem_nickname);
  console.log(mem_bio);
  // 유효성 체크
  if (
    mem_nickname === null ||
    mem_nickname === undefined ||
    mem_bio === null ||
    mem_bio === undefined
  )
    return {
      state: "strCheckError",
      error:
        "Profile update 중 문제가 발생하였습니다! 입력 값이 비어 있거나 길이가 충족되지 않습니다",
    };
  const formData = new FormData();

  formData.append("uidStr", uidStr);
  formData.append("mem_nickname", mem_nickname);
  formData.append("mem_bio", mem_bio);
  formData.append("file", file);

  const result = await fetch(apiUrl + "/profileUpdate", {
    credentials: "include",
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    // body: JSON.stringify({ vd_vtTitle, vd_vtDetail, vd_subtag }),
    body: formData,
  });

  if (result.status != 200) {
    console.log("통신중 문제가 발생했습니다 : " + result.status);
    return {
      state: "fetchError",
      error: "통신중 문제가 발생했습니다 : " + result.status,
    };
  }

  const resultData = await result.json();
  if (resultData.state !== "true") {
    return {
      state: "stateError",
      error: "유저 업데이트 중 이상이 발생했습니다! : " + resultData.error,
    };
  }
  // 로컬 프로필 이미지 업데이트
  localStorage.setItem("userPhoto", resultData.data.mem_profileImageUrl);
  return resultData;
};

// 유저 검색 사용

export const getUserSearch = async (
  keyword: string,
  searchDate: string, // 날짜는 밀리세컨드로
  startCount: number,
  setPageListLimit: number
) => {
  const token = localStorage.getItem("token");

  // 로그인 하지 않아도 검색 할 수 있도록 하기

  // if (!token || token === "") {
  //   return {
  //     state: "tokenError",
  //     error: "토큰이 없거나 잘못된 값 입니다!",
  //   };
  // }

  // 유효성 체크
  if (searchDate === "") {
    return {
      state: "inputError",
      error: "속성 값이 잘못되었습니다!",
    };
  }

  // 만약 리미트값 잘못 되어있으면 초기값으로 하기
  if (startCount < 0 || setPageListLimit < 1) {
    startCount = START_COUNT_INIT;
    setPageListLimit = SET_PAGE_LIST_LIMIT_INIT;
  }

  const result = await fetch(apiUrl + "/getUserList", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      keyword,
      searchDate,
      startCount,
      setPageListLimit,
    }),
  });

  if (result.status != 200) {
    console.log("통신중 문제가 발생했습니다" + result.status);
    return {
      state: "fetchError",
      error: "통신중 문제가 발생했습니다" + result.status,
    };
  }

  const resultData = await result.json();
  if (!resultData) {
    return {
      state: "dataError",
      error: "통신중 문제가 발생했습니다 데이터를 받지 못했습니다!",
    };
  }
  if (resultData.state !== "true") {
    return {
      state: "dataError",
      error:
        "통신중 문제가 발생했습니다 데이터를 받지 못했습니다! : " +
        resultData.error,
    };
  }

  return resultData;
};
