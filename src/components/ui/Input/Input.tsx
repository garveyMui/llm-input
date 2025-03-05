import React, { useRef, useState } from "react";
import { useInputContext } from "@/contexts/Input/Input";
import { FileAddTwoTone, PictureTwoTone } from "@ant-design/icons";

interface InputProps {
  handleSend: (
    message: string,
    type: "text" | "image_url" | "video_url",
    url: string,
  ) => void;
}
export const Input: React.FC<InputProps> = ({ handleSend }) => {
  const {
    textAreaRef,
    inputValue,
    setInputValue,
    handleChange,
    isChineseInput,
    handleFileChange,
    base64String,
    uploadFile,
    setBase64String,
    setUploadFile,
  } = useInputContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(
            inputValue,
            uploadFile?.type.split("/")[0] || "text",
            base64String,
          );
          setInputValue("");
          setUploadFile(null);
          setBase64String(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // 直接清空 input
          }
        }}
      >
        <textarea
          ref={textAreaRef}
          className="w-[60vw] m-4 p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          style={{ resize: "none" }}
          placeholder="Let's chat!😍"
          value={inputValue}
          onChange={handleChange}
          onCompositionStart={() => {
            isChineseInput.current = true;
          }}
          onCompositionEnd={() => {
            isChineseInput.current = false;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              console.log(uploadFile);
              handleSend(
                inputValue,
                uploadFile?.type.split("/")[0] || "text",
                base64String,
              );
              setInputValue("");
              setUploadFile(null);
              setBase64String(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = ""; // 直接清空 input
              }
            }
          }}
        />
        <button
          className="w-16 h-16 rounded-full flex justify-center items-center shadow-md transition-all bg-blue-500 hover:bg-blue-700 text-white font-bold"
          type={"submit"}
        >
          send
        </button>
        <input type={"file"} ref={fileInputRef} onChange={handleFileChange} />
        <FileAddTwoTone />
        <PictureTwoTone />
      </form>
    </div>
  );
};

// export default Input;
