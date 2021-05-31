import { configureStore } from '@reduxjs/toolkit';
import configReducer from './config';
import modalsReducer from './modals';
import cruciblesReducer from './crucibles';
import featureFlagReducer from './featureFlag';
import rewardProgramsReducer from './rewardPrograms';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    config: configReducer,
    modals: modalsReducer,
    crucibles: cruciblesReducer,
    featureFlag: featureFlagReducer,
    rewardPrograms: rewardProgramsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['crucibles/getOwnedCrucibles/fulfilled'],
      },
    }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
