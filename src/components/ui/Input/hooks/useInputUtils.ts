import React, { useRef } from "react";
import { cutFile } from "@/utils/cutFile";

export function useInputUtils() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isChineseInput = useRef(false);
  const [inputValue, setInputValue] = React.useState("你好");
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [base64String, setBase64String] = React.useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
    if (!file) return;
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
    console.time("cutFile");
    const chunks = await cutFile(file);
    console.timeEnd("cutFile");
    console.log(chunks);
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64String = e.target?.result;
      setBase64String(base64String as string);
    };

    reader.onerror = function (error) {};

    // 读取文件为 Data URL（Base64 编码）
    reader.readAsDataURL(file);
  };
  const context = {
    textAreaRef,
    isChineseInput,
    setInputValue,
    inputValue,
    handleChange,
    handleFileChange,
    uploadFile,
    base64String,
    setBase64String,
    setUploadFile,
  };
  return context;
}
