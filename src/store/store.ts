import { configureStore } from '@reduxjs/toolkit';
import modalsReducer from './modals';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from './modals';

export const store = configureStore({
  reducer: {
    modals: modalsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modals.isOpen);
  const openModal = () => dispatch(openModalAction());
  const closeModal = () => dispatch(closeModalAction());
  return { isOpen, openModal, closeModal };
};
