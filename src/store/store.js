import { configureStore } from '@reduxjs/toolkit';
import markerReducer from './markerSlice'; // ✅ Redux Slice 불러오기
import mapReducer from "./mapSlice";

export const store = configureStore({
  reducer: {
    marker: markerReducer,  // ✅ 마커 관련 Redux 상태 관리
    map: mapReducer,
  },
});

export default store;
