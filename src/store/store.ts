import { configureStore } from '@reduxjs/toolkit';
import modalsReducer from './modals';
import transactionsReducer from './transactions/reducer';

export const store = configureStore({
  reducer: {
    modals: modalsReducer,
    transactions: transactionsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
