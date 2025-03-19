import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lat: 37.5665, // 초기 위도 (서울)
  lng: 126.9780, // 초기 경도
  zoom: 3, // 초기 줌 레벨
  clickedLat: null, // 클릭한 위도
  clickedLng: null, // 클릭한 경도
  clickedZoom: null, // 클릭한 줌 레벨
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setClickedLocation: (state, action) => {
      if (action.payload.lat === null) {
        // ? 클릭된 위치 초기화
        state.clickedLat = null;
        state.clickedLng = null;
        state.clickedZoom = null;
      } else {
        state.clickedLat = action.payload.lat;
        state.clickedLng = action.payload.lng;
        state.clickedZoom = action.payload.zoom;
      }
    },
  },
});

export const { setClickedLocation } = mapSlice.actions;
export default mapSlice.reducer;
