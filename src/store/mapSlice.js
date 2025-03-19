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
    setInitialState: (state, action) => {
      const { lat, lng, zoom } = action.payload;
      state.lat = lat;
      state.lng = lng;
      state.zoom = zoom;
    },
    setClickedLocation: (state, action) => {
      const { lat, lng, zoom } = action.payload;
      state.clickedLat = lat;
      state.clickedLng = lng;
      state.clickedZoom = zoom;
    },
  },
});

export const { setInitialState, setClickedLocation } = mapSlice.actions;
export default mapSlice.reducer;
