import React, { useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { InputContextProvider } from "@/contexts/Input/Input";
import { ChatList } from "@/components/ui/ChatList";
import { AppDispatch, RootState, useTypedSelector } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  NetworkMessageI,
  postMessage,
  postMessageStreaming,
  pushMessage,
} from "@/store/Messages";
import { PayloadAction } from "@reduxjs/toolkit";

export const App: React.FC = () => {
  const { messagesList: history } = useTypedSelector(
    (state: RootState) => state.messages,
  );
  const dispatch = useDispatch();
  const handleSend = async (message: string) => {
    const messageToPost: NetworkMessageI = {
      content: message,
      role: "user",
      name: "wanger",
    };
    dispatch(
      pushMessage({
        content: message,
        role: "user",
        connecting: false,
      }),
    );
    dispatch(
      pushMessage({
        content: "",
        role: "assistant",
        connecting: true,
      }),
    );
    dispatch(
      (await postMessageStreaming([
        ...history,
        messageToPost,
      ])) as PayloadAction<NetworkMessageI>,
    );
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
