import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  color: "#36c991",  // ✅ 기본 색상
  icon: "★",         // ✅ 기본 아이콘
};

const markerSlice = createSlice({
  name: "marker",
  initialState,
  reducers: {
    setMarkerColor: (state, action) => {
      state.color = action.payload;
    },
    setMarkerIcon: (state, action) => {
      state.icon = action.payload;
    },
  },
});

export const { setMarkerColor, setMarkerIcon } = markerSlice.actions;
export default markerSlice.reducer;
