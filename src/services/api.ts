import { request } from "@/utils/request";
import { ChatCompletionResponse, MessagesList } from "@/store/Messages";
import { AxiosResponse } from "axios";

export const postMessages: (
  messages: MessagesList,
  streaming: boolean,
) => Promise<AxiosResponse<ChatCompletionResponse>> = (
  messages,
  streaming = false,
) => {
  console.log(messages);
  const dispatchMessage = {
    messages,
    model: "deepseek-chat",
    frequency_penalty: 0,
    max_tokens: 2048,
    presence_penalty: 0,
    response_format: {
      type: "text",
    },
    stop: null,
    stream: streaming,
    stream_options: null,
    temperature: 1,
    top_p: 1,
    tools: null,
    tool_choice: "none",
    logprobs: false,
    top_logprobs: null,
  };
  return request({
    method: "POST",
    url: "chat/completions",
    data: JSON.stringify(dispatchMessage),
  });
};
