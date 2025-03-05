import React, { memo, useCallback, useMemo, useState } from "react";
import { ChatItem } from "@/components/ui/ChatItem";
import { LoadingOutlined } from "@ant-design/icons";
import { RenderMessageI } from "@/store/Messages";
import ActionsBar from "@/components/ui/ChatList/components/ActionsBar";

interface ItemProps {
  item: RenderMessageI;
  index: number;
}
const ItemRender: React.FC<ItemProps> = memo((props) => {
  const { item, index } = props;
  if (item.connecting) {
    return <LoadingOutlined />;
  } else if (item.role === "user") {
    console.log(item);
    if (item.type === "image") {
      return (
        <div>
          <img className={'max-w-[50%]'} src={item.url} alt="" />{" "}
          {item.content !== "" && <ChatItem messageContent={item.content} />}
        </div>
      );
    } else if (item.type === "video") {
      return <video src={item.url} controls />;
    } else {
      return <ChatItem messageContent={item.content} />;
    }
  } else if (item.role === "assistant") {
    return (
      <div>
        <ChatItem messageContent={item.content} />
        <ActionsBar text={item.content} index={index} />
      </div>
    );
  } else {
    return <div>err</div>;
  }
});
const Item: React.FC<ItemProps> = memo((props) => {
  const { item, index } = props;
  const [editing, setEditing] = useState(false);
  const containerClass = `max-w-[75%] p-3 rounded-lg 
    ${item.role === "user" ? "self-end bg-gray-200 text-white" : "self-start bg-sky-50 text-black"} 
    ${item.connecting ? "connecting-class" : ""}`;
  return (
    <div className={containerClass}>
      {<ItemRender item={item} index={index} />}
    </div>
  );
});

export default Item;
