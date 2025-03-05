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

export const App: React.FC = () => {
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
      <ChatList messages={history} />
      <InputContextProvider values={handleSend}>
        <Input handleSend={handleSend} />
      </InputContextProvider>
    </div>
  );
};
