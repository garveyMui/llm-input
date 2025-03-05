import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postMessages } from "@/services/api";
import { AppDispatch, RootState } from "@/store/index";
import llmService from "@/assets/APIKey.json";
import {createMessagesToPost, createMessageToPost} from "@/hooks/useCreateMessageToPost";

const messagesSlice = createSlice({
  name: "messages",
  initialState: { messagesList: [] as MessagesList }, // 初始状态
  reducers: {
    pushMessage: (state, action: PayloadAction<RenderMessageI>) => {
      state.messagesList.push(action.payload);
    },
    updateLastMessage: (state, action: PayloadAction<RenderMessageI>) => {
      const length = state.messagesList.length;
      if (length === 0) {
        state.messagesList.push(action.payload);
      } else {
        state.messagesList[length - 1].content += action.payload.content;
        state.messagesList[length - 1].connecting = false;
      }
    },
    retryMessage: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.messagesList = state.messagesList.slice(0, index + 1);
      state.messagesList[index].content = "";
      state.messagesList[index].connecting = true;
    },
  },
});

export const { pushMessage, updateLastMessage, retryMessage } =
  messagesSlice.actions;
export const retryPostMessageStreaming = (
  index: number,
  history: MessagesList,
) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(retryMessage(index));
      const history = getState().messages.messagesList;
      const{ type, content, url } = history[index-1];
      const messageToPost = createMessageToPost(type, content, url || null);
      if (type === 'text'){
        dispatch(
            (await postMessageStreamingDeepseek(
                history.slice(0, index),
                messageToPost,
            )) as PayloadAction<RenderMessageI>,
        );
      }else{
        dispatch(
            (await postMessageStreamingVision(
                history.slice(0, index),
                messageToPost,
            )) as PayloadAction<RenderMessageI>,
        );
      }
    } catch (error) {
      console.error("Error retry posting message: ", error);
    }
  };
};
export const postMessage = async (messages: MessagesList) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await postMessages(messages, false);
      const message: NetworkMessageI = response.data.choices[0].message;
      dispatch({
        type: "messages/pushMessage",
        payload: message,
      } as PayloadAction<NetworkMessageI>);
    } catch (error) {
      console.error("Error posting message: ", error);
    }
  };
};

export const postMessageStreamingVision = async (
  history: MessagesList,
  current: any,
) => {
  // const convertedHistory = createMessagesToPost(history, "chatglm");
  const convertedHistory = [];
  const model_config = {
    model: "deepseek-chat",
    base_url: "https://api.deepseek.com/chat/completions",
    api_key: llmService.deepseek.apiKey,
  };
  if (
    current.content[0].type === "image_url" ||
    current.content[0].type === "video_url"
  ) {
    model_config.model = "glm-4v";
    model_config.base_url =
      "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    model_config.api_key = llmService.chatglm.apiKey;
  }
  let messageBody = {};
  console.log('current', current);
  messageBody = {
    messages: [...convertedHistory, current],
    model: model_config.model,
    max_tokens: 2048,
    stream: true,
    temperature: 1,
    top_p: 1,
  };
  console.log('message body', messageBody);
  return async (dispatch: AppDispatch) => {
    try {
      fetch(model_config.base_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${model_config.api_key}`,
        },
        body: JSON.stringify(messageBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.status);
          }
          const reader = response.body.getReader();
          const stream = new ReadableStream({
            start(controller) {
              function push() {
                reader
                  .read()
                  .then(({ done, value }) => {
                    if (done) {
                      controller.close();
                      return;
                    }
                    const chunk = new TextDecoder().decode(value);
                    // console.log(chunk);
                    // accumulatedText += chunk;
                    const match = chunk.match(
                      /{"role":"assistant","content":".*?"}/g,
                    );
                    if (match) {
                      dispatch(
                        updateLastMessage({
                          content: "".concat(
                            ...match.map((item) => {
                              return item
                                .toString()
                                .substring(31, item.length - 2);
                            }),
                          ),
                          role: "assistant",
                          connecting: false,
                          type: "text",
                        }),
                      );
                    } else {
                      dispatch(
                        updateLastMessage({
                          content: "not match",
                          role: "assistant",
                          connecting: false,
                          type: "text",
                        }),
                      );
                    }
                    controller.enqueue(value);
                    push();
                  })
                  .catch((error) => {
                    console.error("Stream read error: ", error);
                    controller.error(error);
                  });
              }
              push();
            },
          });
          return new Response(stream).text();
        })
        .then((text) => {
          console.log(text.substring(text.length - 400));
        })
        .catch((error) => {
          console.error("Fetch error: ", error);
        });
    } catch (error) {
      console.error("Error posting message: ", error);
    }
  };
};

export const postMessageStreamingDeepseek = async (
  history: MessagesList,
  current: any,
) => {
  const convertedHistory = createMessagesToPost(history, "deepseek");
  const model_config = {
    model: "deepseek-chat",
    base_url: "https://api.deepseek.com/chat/completions",
    api_key: llmService.deepseek.apiKey,
  };
  if (
    current.content[0].type === "image_url" ||
    current.content[0].type === "video_url"
  ) {
    model_config.model = "glm-4v";
    model_config.base_url =
      "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    model_config.api_key = llmService.chatglm.apiKey;
  }
  let messageBody = {};
  if (
    current.content.type === "image_url" ||
    current.content.type === "video_url"
  ) {
    console.log(current);
    messageBody = {
      messages: [...convertedHistory, current],
      model: model_config.model,
      max_tokens: 2048,
      stream: true,
      temperature: 1,
      top_p: 1,
    };
  } else {
    messageBody = {
      messages: [...history, current],
      model: model_config.model,
      frequency_penalty: 0,
      max_tokens: 2048,
      presence_penalty: 0,
      response_format: {
        type: "text",
      },
      stop: null,
      stream: true,
      stream_options: null,
      temperature: 1,
      top_p: 1,
      tools: null,
      tool_choice: "none",
      logprobs: false,
      top_logprobs: null,
    };
  }

  return async (dispatch: AppDispatch) => {
    try {
      fetch(model_config.base_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${model_config.api_key}`,
        },
        body: JSON.stringify(messageBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.status);
          }
          const reader = response.body.getReader();
          const stream = new ReadableStream({
            start(controller) {
              function push() {
                reader
                  .read()
                  .then(({ done, value }) => {
                    if (done) {
                      controller.close();
                      return;
                    }
                    const chunk = new TextDecoder().decode(value);
                    // accumulatedText += chunk;
                    const match = chunk.match(/{"content":".*?"}/g);
                    if (match) {
                      dispatch(
                        updateLastMessage({
                          content: "".concat(
                            ...match.map((item) => {
                              return item
                                .toString()
                                .substring(12, item.length - 2);
                            }),
                          ),
                          role: "assistant",
                          connecting: false,
                          type: "text",
                        }),
                      );
                    } else {
                      dispatch(
                        updateLastMessage({
                          content: "not match",
                          role: "assistant",
                          connecting: false,
                          type: "text",
                        }),
                      );
                    }
                    controller.enqueue(value);
                    push();
                  })
                  .catch((error) => {
                    console.error("Stream read error: ", error);
                    controller.error(error);
                  });
              }
              push();
            },
          });
          return new Response(stream).text();
        })
        .then((text) => {
          console.log(text.substring(text.length - 400));
        })
        .catch((error) => {
          console.error("Fetch error: ", error);
        });
    } catch (error) {
      console.error("Error posting message: ", error);
    }
  };
};

export const postMessageStremingConversation = async (
  messages: MessagesList,
) => {
  postMessageStreaming(messages);
};

interface SystemMessageI extends BaseMessageI {
  role: "system";
  name?: string;
}

interface UserMessageI extends BaseMessageI {
  role: "user";
  name?: string;
}

interface AssistantMessageI extends BaseMessageI {
  role: "assistant";
  name?: string;
  prefix?: boolean;
  reasoning_content?: string;
}

interface ToolMessagesI extends BaseMessageI {
  role: "tool";
  tool_call_id: string;
}

interface BaseMessageI {
  content: string;
  role: "system" | "user" | "assistant" | "tool";
  type: "text" | "image" | "video";
  url?: string;
}
export type NetworkMessageI =
  | SystemMessageI
  | UserMessageI
  | AssistantMessageI
  | ToolMessagesI;
export interface RenderMessageI extends BaseMessageI {
  connecting: boolean;
}
export type MessagesList = Array<RenderMessageI>;
export interface ChatCompletionResponse {
  id: string;
  choices: {
    finish_reason:
      | "stop"
      | "length"
      | "content_filter"
      | "tool_calls"
      | "insufficient_system_resource";
    index: number;
    message: NetworkMessageI;
    logprobs?: {
      content: {
        token: string;
        logprob: number;
        bytes: number[];
        top_logprobs: {
          token: string;
          logprob: number;
          bytes: number[];
        }[];
      }[];
    };
  }[];
  created: number;
  model: string;
  system_fingerprint: string;
  object: "chat.completion";
  usage?: {
    completion_tokens: number;
  };
}

export default messagesSlice.reducer;
