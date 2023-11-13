/* eslint-disable @typescript-eslint/no-explicit-any */

// Vread 게시글 인터페이스
export interface IVread {
  mem_idx: string;
  mem_nickname: string;
  mem_profileImageUrl: string;
  vd_media_1: string;
  vd_vtTitle: string;
  vd_vtDetail: string;
  vd_subtag: string;
  vd_createDate: number;
  vd_modifyDate: number;
  vreads_idx: string;
}

const apiUrl = import.meta.env.VITE_APP_SPRING_API_URL + "api/vread";

export const VT_TITLE_MIN_LENGTH = 1;
export const VT_DETAIL_MIN_LENGTH = 1;
export const VT_SUBTAG_MIN_LENGTH = 1;

export const VT_TITLE_MAX_LENGTH = 120;
export const VT_DETAIL_MAX_LENGTH = 1500;
export const VT_SUBTAG_MAX_LENGTH = 20;

// 한번 요청시 가져올 limit 값 초기값
export const START_COUNT_INIT = 0;
export const SET_PAGE_LIST_LIMIT_INIT = 15;

export const addVread = async (
  vd_vtTitle: string,
  vd_vtDetail: string,
  vd_subtag: string,
  file1: any
) => {
  const token = localStorage.getItem("token");

  if (!token || token === "")
    return {
      state: "tokenError",
      error:
        "Vread 등록 중 문제가 발생하였습니다! 새로고침 또는 다시 로그인 해주세요",
    };

  // 유효성 체크
  if (
    vd_vtTitle === "" ||
    vd_vtTitle.length < VT_TITLE_MIN_LENGTH ||
    vd_vtTitle.length > VT_TITLE_MAX_LENGTH ||
    // 서브태그와 detail 은 최대 길이만 체크
    vd_vtDetail.length > VT_DETAIL_MAX_LENGTH ||
    vd_subtag.length > VT_SUBTAG_MAX_LENGTH
  )
    return {
      state: "strCheckError",
      error:
        "Vread 등록 중 문제가 발생하였습니다! 입력 값이 비어 있거나 길이가 충족되지 않습니다",
    };

  const formData = new FormData();

  formData.append("vd_vtTitle", vd_vtTitle);
  formData.append("vd_vtDetail", vd_vtDetail);
  formData.append("vd_subtag", vd_subtag);
  formData.append("file1", file1);

  const result = await fetch(apiUrl + "/addVread", {
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
    console.log("통신중 문제가 발생했습니다" + result.status);
    return {
      state: "fetchError",
      error: "통신중 문제가 발생했습니다" + result.status,
    };
  }

  const resultData = await result.json();
  console.log(resultData);
  return resultData;
};

export const getAllVreads = async () => {
  const token = localStorage.getItem("token");

  const result = await fetch(apiUrl + "/all", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (result.status != 200) {
    console.log("통신중 문제가 발생했습니다" + result.status);
    return {
      state: "fetchError",
      error: "통신중 문제가 발생했습니다" + result.status,
    };
  }

  const resultData = await result.json();
  console.log(resultData);
  return resultData;
};

//특정 유저 Vreads 불러오기
/*
	 * <!-- serchType -->
	<!-- 0 = 유저uid 로만 검색 -->
	<!-- 1 = 제목검색 -->
	<!-- 2 = 제목과 타이틀 검색 -->
	<!-- 3 = 서브태그 검색 -->
	 * */
// userSearchType
// = 0 : uid 검색
// = 1 : id 로 검색
// db 검색시 이용할 값 셋팅
export const getUserVreads = async (
  userId: string,
  userSearchType: string,
  keyword: string,
  searchType: number,
  startCount: number,
  setPageListLimit: number
) => {
  const token = localStorage.getItem("token");

  if (!token || token === "") {
    return {
      state: "tokenError",
      error: "토큰이 없거나 잘못된 값 입니다!",
    };
  }

  // 유효성 체크
  if (userSearchType === "" || searchType < 0) {
    return {
      state: "inputError",
      error: "속성 값이 잘못되었습니다!",
    };
  }

  // 만약 리미트값 잘못 되어있으면 초기값으로 하기
  if (
    !startCount ||
    startCount < 0 ||
    !setPageListLimit ||
    setPageListLimit < 1
  ) {
    startCount = START_COUNT_INIT;
    setPageListLimit = SET_PAGE_LIST_LIMIT_INIT;
  }

  const result = await fetch(apiUrl + "/user", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      userId,
      userSearchType,
      keyword,
      searchType,
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

//search type 과 keyword 에 맞춰서 Vreads 불러오기
/*
	 * 	<!-- serchType -->
	<!-- 1 = 제목검색 -->
	<!-- 2 = 제목과 타이틀 검색 -->
	<!-- 3 = 서브태그 검색 -->
	 * */
export const getSearchVreads = async (
  keyword: string,
  searchType: number,
  startCount: number,
  setPageListLimit: number
) => {
  const token = localStorage.getItem("token");

  if (!token || token === "") {
    return {
      state: "tokenError",
      error: "토큰이 없거나 잘못된 값 입니다!",
    };
  }

  // 유효성 체크
  if (searchType < 0 || startCount < 0 || setPageListLimit < 0) {
    return {
      state: "inputError",
      error: "속성 값이 잘못되었습니다!",
    };
  }

  const result = await fetch(apiUrl + "/search", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      keyword,
      searchType,
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
    console.log(
      "dataError : " +
        resultData.state +
        " 통신중 문제가 발생했습니다 데이터를 받지 못했습니다! : " +
        resultData.error
    );
    return {
      state: "dataError",
      error:
        "통신중 문제가 발생했습니다 데이터를 받지 못했습니다! : " +
        resultData.error,
    };
  }

  return resultData;
};

export const getVreadDetail = async (vread_idx: string) => {
  const token = localStorage.getItem("token");

  if (!token || token === "") {
    return {
      state: "tokenError",
      error: "토큰이 없거나 잘못된 값 입니다!",
    };
  }

  // 유효성 체크
  if (vread_idx === "") {
    return {
      state: "inputError",
      error: "속성 값이 잘못되었습니다!",
    };
  }

  const result = await fetch(apiUrl + "/detail", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      vread_idx,
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
    console.log(
      "dataError : " +
        resultData.state +
        " 통신중 문제가 발생했습니다 데이터를 받지 못했습니다! : " +
        resultData.error
    );
    return {
      state: "dataError",
      error:
        "통신중 문제가 발생했습니다 데이터를 받지 못했습니다! : " +
        resultData.error,
    };
  }

  return resultData;
};

export const deleteVread = async (vread_idx: string) => {
  const token = localStorage.getItem("token");

  if (!token || token === "") {
    return {
      state: "tokenError",
      error: "토큰이 없거나 잘못된 값 입니다!",
    };
  }

  // 유효성 체크
  if (vread_idx === "") {
    return {
      state: "inputError",
      error: "속성 값이 잘못되었습니다!",
    };
  }

  const result = await fetch(apiUrl + "/delete", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      vread_idx,
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
    console.log(
      "dataError : " +
        resultData.state +
        " 삭제중 문제가 발생했습니다 데이터를 받지 못했습니다! : " +
        resultData.error
    );
    return {
      state: "dataError",
      error:
        "삭제중 문제가 발생했습니다 데이터를 받지 못했습니다! : " +
        resultData.error,
    };
  }

  return resultData;
};

export const loadImg = (doc: HTMLImageElement, url: string) => {
  const token = localStorage.getItem("token");

  if (!token || token === "") {
    console.log("tokenError : 토큰이 없거나 잘못된 값 입니다!");
    return;
  }

  // 이미지 데이터 요청
  fetch(url, {
    credentials: "include",
    headers: {
      Authorization: "Bearer " + token,
    },
  }) //
    .then((res) => res.blob())
    .then((blob) => {
      console.log(blob);

      const objectURL = URL.createObjectURL(blob);
      console.log(objectURL);

      doc.src = objectURL;
    });
};
