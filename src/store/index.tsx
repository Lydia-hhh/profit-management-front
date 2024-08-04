import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import portfolioReducer from './features/portfolioSlice';
export const store=configureStore({
    reducer:{portfolioReducer}
})
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;