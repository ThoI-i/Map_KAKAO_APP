import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nearestPOI: null,
  isModalOpen: false,
};

const poiSlice = createSlice({
  name: 'poi',
  initialState,
  reducers: {
    setNearestPOI: (state, action) => {
      state.nearestPOI = action.payload;
    },
    clearNearestPOI: (state) => {
      state.nearestPOI = null;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const { setNearestPOI, clearNearestPOI, openModal, closeModal } = poiSlice.actions;
export default poiSlice.reducer;
