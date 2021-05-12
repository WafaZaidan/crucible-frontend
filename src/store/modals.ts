import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './hooks';
import { ReactNode } from 'react';

interface ModalState {
  isOpen: boolean;
  component: ReactNode;
}

const initialState: ModalState = {
  isOpen: true,
  component: null,
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.component = action.payload.component;
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const useModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modals.isOpen);
  const component = useAppSelector((state) => state.modals.component);
  const openModal = (component: ReactNode) =>
    dispatch(modalsSlice.actions.openModal({ component }));
  const closeModal = () => dispatch(modalsSlice.actions.closeModal());
  return { isOpen, openModal, closeModal, component };
};

export default modalsSlice.reducer;
