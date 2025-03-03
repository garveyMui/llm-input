import React from "react";
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

const converter = new showdown.Converter();

interface ChatListProps {
  messages: Array<RenderMessageI>;
}

export const ChatList: React.FC<ChatListProps> = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => {
        return (
          <div>
            <ChatItem
              messageContent={message.content}
              connecting={message.connecting}
            />
            <CopyTwoTone />
            <RedoOutlined />
            <LikeOutlined />
            <DislikeOutlined />
          </div>
        );
      })}
    </div>
  );
};
