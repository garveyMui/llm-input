import { useMarkdownProcessor } from "@/hooks/useMarkdownProcessor";
import React from "react";
import { read } from "node:fs";
import { LoadingOutlined } from "@ant-design/icons";

interface ChatItemProps {
  messageContent: string;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  messageContent,
}) => {
  try {
    const rendered = useMarkdownProcessor({
      content: messageContent.replace(/\\n/g, "\n"),
    });
    return rendered;
  } catch (e) {
    console.error(e);
  } finally {
  }
};
