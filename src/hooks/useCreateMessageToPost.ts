import { MessagesList } from "@/store/Messages";

export const createMessagesToPost = (
  messages: MessagesList,
  llm = "deepseek",
) => {
  console.log(llm);
  const messagesToPost = [];
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    let messageToPost = {};
    if (llm === "chatglm") {
      console.log(messages);
      if (message.type === "image") {
        messageToPost = {
          role: message.role,
          content: [
            {
              type: message.type,
              image_url: {
                url: message.url,
              },
            },
            {
              type: "text",
              text: message.content,
            },
          ],
        };
      } else if (message.type === "video") {
        messageToPost = {
          role: message.role,
          content: [
            {
              type: message.type,
              video_url: {
                url: message.url,
              },
            },
            {
              type: "text",
              text: message.content,
            },
          ],
        };
      } else if (message.type === "text") {
        messageToPost = {
          role: message.role,
          content: [
            {
              type: "text",
              text: message.content,
            },
          ],
        };
      }
    }else if(llm === "deepseek"){
      messageToPost = {
        role: message.role,
        content: message.content,
      };
    }
    console.log('converted', messageToPost);
    messagesToPost.push(messageToPost);
  }
  return messagesToPost;
};
export const createMessageToPost = (
  type: "text" | "image" | "video" | "application",
  text: string | null,
  url: string | null,
  extractContent: any | null,
) => {
  if (type === "text") {
    return {
      role: "user",
      content: text,
    };
  } else if (type === "image") {
    return {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url,
          },
        },
        {
          type: "text",
          text: text==='' ? '描述这幅图': text,
        },
      ],
    };
  } else if (type === "video") {
    return {
      role: "user",
      content: [
        {
          type: "video_url",
          video_url: {
            url,
          },
        },
        {
          type: "text",
          text: text==='' ? '描述这幅图': text,
        },
      ],
    };
  }else {
    return {
      role: "user",
      content: text+'\n文档中的内容为：'+extractContent.content,
    };
  }
};
