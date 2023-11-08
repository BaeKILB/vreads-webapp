import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// 전역 state 인 redux 사용

// 인터페이스 틀 만들기
export interface vreadsGState {
  ishomeVdListReload: boolean;
}

// 위 인터페이스로 찍어낸 객체 초기화
const initialState: vreadsGState = {
  ishomeVdListReload: false,
};

// slice 만들기
export const vdGStateSlice = createSlice({
  name: "vreadsGState",
  initialState,
  reducers: {
    // redux 동작 메서드 추가
    ishomeVdListReload: (state, action: PayloadAction<boolean>) => {
      state.ishomeVdListReload = action.payload;
    },
  },
});

// reducers 액션 내보내기
export const vdGStateActions = vdGStateSlice.actions;

// slice 내보내기
export default vdGStateSlice;
