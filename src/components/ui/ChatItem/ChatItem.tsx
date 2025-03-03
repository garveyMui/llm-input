import { useMarkdownProcessor } from "@/hooks/useMarkdownProcessor";
import React from "react";
import { read } from "node:fs";
import { LoadingOutlined } from "@ant-design/icons";

interface ChatItemProps {
  messageContent: string;
  connecting: boolean;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  messageContent,
  connecting,
}) => {
  try {
    const rendered = useMarkdownProcessor({
      content: messageContent.replace(/\\n/g, "\n"),
    });
    return (connecting && <LoadingOutlined />) || rendered;
  } catch (e) {
    console.error(e);
  } finally {
  }
};
