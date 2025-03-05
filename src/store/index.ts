import { configureStore } from "@reduxjs/toolkit";
import messagesReducer, { RenderMessageI} from "./Messages";
import { TypedUseSelectorHook, useSelector } from "react-redux";

// 配置 Redux store
export const store = configureStore({
  reducer: {
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
