import React, { memo } from "react";
import useChatItemActionsBar from "@/hooks/useChatItemActionsBar";
import {
  CheckOutlined,
  CopyOutlined,
  CopyTwoTone,
  DislikeOutlined,
  LikeOutlined,
  RedoOutlined,
} from "@ant-design/icons";
// 定义 props 类型
interface ActionsBarProps {
  text: string;
  index: number;
}

const ActionsBar: React.FC<ActionsBarProps> = memo((_ref: ActionsBarProps) => {
  const { text, index } = _ref; // 解构出 text 和 rest

  // 获取 actions
  const {
    isLiked,
    isDisliked,
    handleCopy,
    handleLikeClick,
    handleDislikeClick,
    copied,
    handleRetry,
  } = useChatItemActionsBar(text);

  return (
    <div>
      {copied ? (
        <CheckOutlined style={{ color: "gray" }} />
      ) : (
        <CopyOutlined
          onClick={() => handleCopy(text)}
          style={{ cursor: "pointer", color: "gray" }}
        />
      )}
      <RedoOutlined
        style={{
          color: "gray",
          cursor: "pointer",
        }}
        onClick={() => {
          handleRetry(index);
        }}
      />
      <LikeOutlined
        style={{
          color: isLiked ? "red" : "gray",
          cursor: "pointer",
        }}
        onClick={() => {
          handleLikeClick();
        }}
      />
      <DislikeOutlined
        style={{
          color: isDisliked ? "black" : "gray",
          cursor: "pointer",
        }}
        onClick={() => {
          handleDislikeClick();
        }}
      />
      {copied && (
        <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-sm rounded shadow-md">
          复制成功！
        </div>
      )}
    </div>
  );
});

export default ActionsBar;
