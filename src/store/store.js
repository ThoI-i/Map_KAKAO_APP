import { configureStore } from '@reduxjs/toolkit';
import markerReducer from './markerSlice'; // ✅ Redux Slice 불러오기
import mapReducer from "./mapSlice";
import poiReducer from "./poiSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    marker: markerReducer,  // ✅ 마커 관련 Redux 상태 관리
    poi: poiReducer,
  },
});

export default store;
