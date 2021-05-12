import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './hooks';
import { ReactNode } from 'react';
import { ModalType } from '../components/modals/types';

interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: any; // TODO: we could type these props as a generic an pass the interface in
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
  modalProps: {},
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.modalType = action.payload.modalType;
      state.modalProps = action.payload.modalProps || {};
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.modalProps = {};
    },
  },
});

export const useModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modals.isOpen);
  const modalType = useAppSelector((state) => state.modals.modalType);
  const modalProps = useAppSelector((state) => state.modals.modalProps);
  const openModal = (modalType: ReactNode) =>
    dispatch(modalsSlice.actions.openModal({ modalType }));
  const closeModal = () => dispatch(modalsSlice.actions.closeModal());
  return { isOpen, openModal, closeModal, modalType, modalProps };
};

export default modalsSlice.reducer;
