import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postMessages } from "@/services/api";
import { AppDispatch } from "@/store/index";
import llmService from "@/assets/APIKey.json";

const messagesSlice = createSlice({
  name: "messages",
  initialState: { messagesList: [] as MessagesList }, // 初始状态
  reducers: {
    pushMessage: (state, action: PayloadAction<MessageI>) => {
      state.messagesList.push(action.payload);
    },
    updateLastMessage: (state, action: PayloadAction<MessageI>) => {
      const length = state.messagesList.length;
      if (length === 0) {
        state.messagesList.push(action.payload);
      } else {
        state.messagesList[length - 1].content += action.payload.content;
      }
    },
  },
});

export const { pushMessage, updateLastMessage } = messagesSlice.actions;
export const postMessage = async (messages: MessagesList) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await postMessages(messages, false);
      const message: MessageI = response.data.choices[0].message;
      dispatch({
        type: "messages/pushMessage",
        payload: message,
      } as PayloadAction<MessageI>);
    } catch (error) {
      console.error("Error posting message: ", error);
    }
  };
};

export const postMessageStreaming = async (messages: MessagesList) => {
  const messageBody = {
    messages,
    model: "deepseek-chat",
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
  return async (dispatch: AppDispatch) => {
    try {
      fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${llmService.apiKey}`,
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
              let first = true;
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
                      if (first) {
                        first = false;
                        dispatch(
                          pushMessage({
                            content: "".concat(
                              ...match.map((item) => {
                                return item
                                  .toString()
                                  .substring(12, item.length - 2);
                              }),
                            ),
                            role: "assistant",
                          }),
                        );
                      } else {
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
                          }),
                        );
                      }
                    } else {
                      dispatch(
                        updateLastMessage({
                          content: "not match",
                          role: "assistant",
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

export default messagesSlice.reducer;

interface SystemMessageI {
  content: string;
  role: "system";
  name?: string;
}

interface UserMessageI {
  content: string;
  role: "user";
  name?: string;
}

interface AssistantMessageI {
  content: string;
  role: "assistant";
  name?: string;
  prefix?: boolean;
  reasoning_content?: string;
}

interface ToolMessagesI {
  role: "tool";
  content: string;
  tool_call_id: string;
}
export type MessageI =
  | SystemMessageI
  | UserMessageI
  | AssistantMessageI
  | ToolMessagesI;
export type MessagesList = Array<MessageI>;
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
    message: MessageI;
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
