import React, { useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { InputContextProvider } from "@/contexts/Input/Input";
import { ChatList } from "@/components/ui/ChatList";
import { AppDispatch, RootState, useTypedSelector } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  NetworkMessageI,
  postMessage,
  postMessageStreamingVision,
  postMessageStreamingDeepseek,
  pushMessage,
  RenderMessageI,
} from "@/store/Messages";
import { PayloadAction } from "@reduxjs/toolkit";
import { createMessageToPost } from "@/hooks/useCreateMessageToPost";
interface AppProps {
  className?: string;
  style?: React.CSSProperties;
  addonAfter?: any;
  addonBefore?: any;
  allowClear?: boolean;
  bordered?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  id?: string;
  maxLength?: number | null;
  showCount?: boolean;
  prefix?: string;
  suffix?: string;
  type?: string;
  value?: any;
  onChange?: (value: any) => void;
  onPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  [key: string]: any; // 用于支持 ...restProps
}
export const App: React.FC = (props: AppProps) => {
  const {
    className = "",
    style = {},
    addonAfter = null,
    addonBefore = null,
    allowClear = false,
    bordered = true,
    defaultValue = "",
    disabled = false,
    id = "",
    maxLength = null,
    showCount = false,
    prefix = "",
    suffix = "",
    type = "text",
    value,
    onChange,
    onPressEnter,
    ...restProps
  } = props;
  const { messagesList: history } = useTypedSelector(
    (state: RootState) => state.messages,
  );
  const dispatch = useDispatch();
  const handleSend = async (
    message: string,
    type: "text" | "image" | "video" | "application" = "text",
    url: string | null = null,
    extractContent: any | null = null,
  ) => {
    const messageToPost = createMessageToPost(
      type,
      message,
      url,
      extractContent,
    );
    // console.log(messageToPost);
    dispatch(
      pushMessage({
        content: message,
        role: "user",
        connecting: false,
        type,
        url: url || undefined,
        filename: extractContent?.filename || undefined,
      }),
    );
    dispatch(
      pushMessage({
        content: "",
        role: "assistant",
        connecting: true,
        type: "text",
      }),
    );
    if (type === "image" || type === "video") {
      dispatch(
        (await postMessageStreamingVision(
          history,
          messageToPost,
        )) as PayloadAction<RenderMessageI>,
      );
    } else {
      dispatch(
        (await postMessageStreamingDeepseek(
          history,
          messageToPost,
        )) as PayloadAction<RenderMessageI>,
      );
    }
  };
  return (
    <div className="App">
      {/*<meta*/}
      {/*  name={"viewport"}*/}
      {/*  content={`initial-scale=${1 / window.devicePixelRatio || 1}`}*/}
      {/*/>*/}
      <ChatList messages={history} />
      <Input handleSend={handleSend} />
    </div>
  );
};
