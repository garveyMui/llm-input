import { AnyAction, configureStore } from "@reduxjs/toolkit";
import messagesReducer, { MessageI } from "./Messages";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// 配置 Redux store
export const store = configureStore({
  reducer: {
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export interface RootState {
  messages: Array<MessageI>;
}

export type AppDispatch = typeof store.dispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
