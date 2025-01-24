import React, { useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { InputContextProvider } from "@/contexts/Input/Input";
import { ChatList } from "@/components/ui/ChatList";
import { AppDispatch, RootState, useTypedSelector } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageI,
  postMessage,
  postMessageStreaming,
  pushMessage,
} from "@/store/Messages";
import { PayloadAction } from "@reduxjs/toolkit";

export const App: React.FC = () => {
  const { messagesList } = useTypedSelector(
    (state: RootState) => state.messages,
  );
  console.log(messagesList);
  const dispatch = useDispatch();
  const handleSend = async (message: string) => {
    const messageToPost: MessageI = {
      content: message,
      role: "user",
      name: "wanger",
    };
    dispatch(
      pushMessage({
        content: message,
        role: "user",
      }),
    );
    dispatch(
      (await postMessageStreaming([messageToPost])) as PayloadAction<MessageI>,
    );
  };
  return (
    <div className="App">
      <ChatList messages={messagesList} />
      <InputContextProvider values={handleSend}>
        <Input handleSend={handleSend} />
      </InputContextProvider>
    </div>
  );
};
