import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: true,
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalsSlice.actions;

export const isModalOpen = (state: RootState) => state.modals.isOpen;

export default modalsSlice.reducer;
