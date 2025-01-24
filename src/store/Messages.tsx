import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postMessages } from "@/services/api";
import { AppDispatch } from "@/store/index";

const messagesSlice = createSlice({
  name: "messages",
  initialState: { messagesList: [] as MessagesList }, // 初始状态
  reducers: {
    pushMessage: (state, action: PayloadAction<MessageI>) => {
      state.messagesList.push(action.payload);
    },
  },
});

export const { pushMessage } = messagesSlice.actions;
export const postMessage = async (messages: MessagesList) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await postMessages(messages);
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
