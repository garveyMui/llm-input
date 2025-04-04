import React, { useId, useRef, useState } from "react";
import { LoaderPinwheel, Send } from "lucide-react";
import { useInputUtils } from "@/components/ui/Input/hooks/useInputUtils";
import TextInput from "@/components/ui/Input/_components/TextInput";
import { FileUpload } from "@/components/ui/Input/_components/FileUpload";
import { useSubmitForm } from "@/components/ui/Input/hooks/useSubmitForm";
import ButtonSend from "@/components/ui/Input/_components/ButtonSend";

interface InputProps {
  handleSend: (
    message: string,
    type: "text" | "image_url" | "video_url",
    url: string,
    extractContent: any | null,
  ) => Promise<void>;
  className?: string;
  style?: React.CSSProperties;
  addonAfter?: any;
  addonBefore?: any;
  allowClear?: boolean;
  bordered?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  id?: string;
  maxLength?: number | null;
  showCount?: boolean;
  prefix?: string;
  suffix?: string;
  type?: string;
  value?: any;
  onChange?: (value: any) => void;
  onPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  [key: string]: any; // 索引签名
}

export const Input: React.FC<InputProps> = ({ handleSend }) => {
  const { setBase64String, setUploadFile } = useInputUtils();

  const [inputValue, setInputValue] = useState("你好");
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = useId();
  const resetState = () => {
    setUploadFile(null);
    setBase64String(null);
    setInputValue("");
  };
  const { state, formAction, isPending } = useSubmitForm(
    handleSend,
    resetState,
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setInputValue((prev) => prev + "\n");
    } else if (e.key === "Enter") {
      e.preventDefault();
      sendButtonRef.current?.click();
    }
  };

  return (
    <form
      className="box-border w-80 sm:w-3/4 md:w-4/5 lg:w-5/6 xl:w-6/7 max-w-160 mx-auto relative mt-4 mb-4 p-4 border border-gray-300 rounded-lg shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all"
      action={formAction}
      onClick={() => {
        textAreaRef.current?.focus();
      }}
    >
      <label htmlFor={textareaId} aria-label="input" />
      <TextInput
        value={inputValue}
        ref={textAreaRef}
        onChange={setInputValue}
        onKeyDown={handleKeyDown}
        className="p-2 resize-none focus:outline-none"
      />
      <FileUpload
        onFileChange={(file, fileType) => {
          if (textAreaRef.current) textAreaRef.current.focus();
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result;
          };
          reader.readAsDataURL(file);
        }}
      />
      <ButtonSend ref={sendButtonRef}>
        {isPending ? <Send /> : <LoaderPinwheel />}
      </ButtonSend>
    </form>
  );
};
