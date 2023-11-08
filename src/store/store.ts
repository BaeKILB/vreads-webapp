import { configureStore } from "@reduxjs/toolkit";
import vdGStateSlice from "./vreadsStore";

const store = configureStore({
  reducer: { vdGStateSlice: vdGStateSlice.reducer },
});

export default store;
