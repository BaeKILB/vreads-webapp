/* eslint-disable @typescript-eslint/no-explicit-any */
const apiUrl = import.meta.env.VITE_APP_SPRING_API_URL + "api/vread";

export const VT_TITLE_MIN_LENGTH = 1;
export const VT_DETAIL_MIN_LENGTH = 1;
export const VT_SUBTAG_MIN_LENGTH = 1;

export const VT_TITLE_MAX_LENGTH = 120;
export const VT_DETAIL_MAX_LENGTH = 1500;
export const VT_SUBTAG_MAX_LENGTH = 20;

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
