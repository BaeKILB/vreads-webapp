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

// subtaglist 불러올때 쓰는 틀
export interface SubTagInit {
  vd_subtag: string;
  vd_subtag_count: string;
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

// vread 등록
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
  return resultData;
};

// vread 업데이트
// 업데이트 하지 않을 항목은 "" file 의 경우는 null
export const updateVread = async (
  vreads_idx: string,
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
        "Vread 업데이트 중 문제가 발생하였습니다! 새로고침 또는 다시 로그인 해주세요",
    };

  const formData = new FormData();

  formData.append("vreads_idx", vreads_idx);
  formData.append("vd_vtTitle", vd_vtTitle);
  formData.append("vd_vtDetail", vd_vtDetail);
  formData.append("vd_subtag", vd_subtag);
  formData.append("file1", file1);

  const result = await fetch(apiUrl + "/updateVread", {
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
    console.log("통신중 문제가 발생했습니다 " + result.status);
    return {
      state: "fetchError",
      error: "통신중 문제가 발생했습니다 " + result.status,
    };
  }

  const resultData = await result.json();
  return resultData;
};

// vread 삭제
export const deleteVread = async (vreads_idx: string) => {
  const token = localStorage.getItem("token");

  if (!token || token === "") {
    console.log("토큰이 없거나 잘못된 값 입니다!");
    return {
      state: "tokenError",
      error: "토큰이 없거나 잘못된 값 입니다!",
    };
  }

  // 유효성 체크
  if (vreads_idx === "") {
    console.log("속성 값이 잘못되었습니다!");
    return {
      state: "inputError",
      error: "속성 값이 잘못되었습니다!",
    };
  }

  const result = await fetch(apiUrl + "/deleteVread", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      vreads_idx,
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
  }

  return resultData;
};

export const getAllVreads = async (
  startCount: number,
  setPageListLimit: number
) => {
  const token = localStorage.getItem("token");

  const result = await fetch(apiUrl + "/all", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ startCount, setPageListLimit }),
  });

  if (result.status != 200) {
    console.log("통신중 문제가 발생했습니다" + result.status);
    return {
      state: "fetchError",
      error: "통신중 문제가 발생했습니다" + result.status,
    };
  }

  const resultData = await result.json();

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

  // 로그인 하지 않아도 검색 할 수 있도록 하기

  // if (!token || token === "") {
  //   return {
  //     state: "tokenError",
  //     error: "토큰이 없거나 잘못된 값 입니다!",
  //   };
  // }

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

  // 로그인 하지 않아도 검색 할 수 있도록 하기

  // if (!token || token === "") {
  //   return {
  //     state: "tokenError",
  //     error: "토큰이 없거나 잘못된 값 입니다!",
  //   };
  // }

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

export const getVreadDetail = async (vreads_idx: string) => {
  const token = localStorage.getItem("token");

  // 로그인 하지 않아도 검색 할 수 있도록 하기

  // if (!token || token === "") {
  //   return {
  //     state: "tokenError",
  //     error: "토큰이 없거나 잘못된 값 입니다!",
  //   };
  // }

  // 유효성 체크
  if (vreads_idx === "") {
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
      vreads_idx,
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

export const loadImg = (doc: HTMLImageElement, url: string) => {
  const token = localStorage.getItem("token");

  // 로그인 하지 않아도 검색 할 수 있도록 하기

  // if (!token || token === "") {
  //   console.log("tokenError : 토큰이 없거나 잘못된 값 입니다!");
  //   return;
  // }

  // 이미지 데이터 요청
  fetch(url, {
    credentials: "include",
    headers: {
      Authorization: "Bearer " + token,
    },
  }) //
    .then((res) => res.blob())
    .then((blob) => {
      const objectURL = URL.createObjectURL(blob);
      doc.src = objectURL;
    });
};

//search type 과 keyword 에 맞춰서 Subtag 이름과 해당 subtag 의 갯수 불러오기
/*
	 * 유의사항
	 * 
	 * 0 번의 경우 searchDate 보다 최근의 정보를 불러옴
	 * 
	 * 0 번 사용시 userIdx 널 스트링으로
	 * 
	 * 	<!-- serchType -->
	<!-- 0 = 전체 subtag 인기순 정렬 검색-->
	<!-- 1 = userIdx 로 특정 유저의 vread subtag 검색-->
	 * */
export const getSubtagList = async (
  uid: string,
  searchType: number,
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
  if (searchType < 0 || startCount < 0 || setPageListLimit < 0) {
    return {
      state: "inputError",
      error: "속성 값이 잘못되었습니다!",
    };
  }

  const result = await fetch(apiUrl + "/subtagList", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      uid,
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
  }

  return resultData;
};
