import React, { useRef, useState } from "react";
import { useInputContext } from "@/contexts/Input/Input";
import { FileAddTwoTone, PictureTwoTone } from "@ant-design/icons";
import { toUploadFile } from "@/utils/uploadFile";

interface InputProps {
  handleSend: (
      message: string,
      type: "text" | "image_url" | "video_url",
      url: string,
      extractContent: any | null
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

  const handleKeyPress = async () => {
    let extractContent;
    if (uploadFile && uploadFile.type.split("/")[0] === "application") {
      extractContent = await toUploadFile(uploadFile);
    }
    handleSend(
        inputValue,
        uploadFile?.type.split("/")[0] || "text",
        base64String || "",
        extractContent || null
    );
    // 清空输入
    setInputValue("");
    setUploadFile(null);
    setBase64String(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
      <div className="w-full flex justify-center">
        {/* 外层容器，可以根据需要控制宽度，这里示例为 60vw */}
        <form
            className="relative w-[60vw] m-4 p-4 border border-gray-300 rounded-lg shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all"
            onSubmit={(e) => {
              e.preventDefault();
              handleKeyPress();
            }}
        >
        <textarea
            ref={textAreaRef}
            className="w-full h-24 p-2 resize-none focus:outline-none"
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
              // 按下 Enter 发送
              if (e.key === "Enter") {
                e.preventDefault();
                handleKeyPress();
              }
            }}
        />

          {/* 左下角的文件上传图标区域 */}
          <div className="absolute bottom-2 left-2 flex items-center space-x-3">
            {/* 隐藏原生的 input[type=file]，用 label+图标触发 */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileAddTwoTone style={{ fontSize: "24px" }} />
            </label>
            <label htmlFor="file-upload" className="cursor-pointer">
              <PictureTwoTone style={{ fontSize: "24px" }} />
            </label>
          </div>

          {/* 右下角的发送按钮 */}
          <button
              className="absolute bottom-2 right-2 w-16 h-16 rounded-full flex justify-center items-center
                     shadow-md transition-all bg-blue-500 hover:bg-blue-700 text-white font-bold"
              type="submit"
          >
            send
          </button>
        </form>
      </div>
  );
};
