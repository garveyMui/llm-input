import React, {useState} from "react";
import { NetworkMessageI, RenderMessageI } from "@/store/Messages";
import {
  CopyTwoTone,
  DislikeOutlined,
  LikeOutlined,
  LoadingOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import showdown from "showdown";
import { useMarkdownProcessor } from "@/hooks/useMarkdownProcessor";
import { ChatItem } from "@/components/ui/ChatItem/ChatItem";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import ActionsBar from "@/components/ui/ChatList/components/ActionsBar";
import ChatItemAdaptor from "@/components/ui/ChatList/components/ChatItemAdaptor";

const converter = new showdown.Converter();

interface ChatListProps {
  messages: Array<RenderMessageI>;
}

export const ChatList: React.FC<ChatListProps> = ({ messages }) => {

  return (
    <div className='flex flex-col space-y-4 p-4 max-w-md mx-auto'>
      {messages.map((message, index) => {
        return (
          <ChatItemAdaptor item={message} index={index} key={index} />
        );
      })}
    </div>
  );
};
