import React, { useContext, useRef, createContext } from "react";
import {cutFile} from "@/utils/cutFile";

interface InputContextType {
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  isChineseInput: React.RefObject<boolean>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadFile: File | null;
  base64String: string | null;
  setBase64String: React.Dispatch<React.SetStateAction<string | null>>;
  setUploadFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const InputContext = createContext<InputContextType | undefined>(undefined);

export const InputContextProvider: React.FC<{
  children: React.ReactNode;
  values: any;
}> = ({ children, values }) => {
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
    console.time('cutFile');
    const chunks = await cutFile(file);
    console.timeEnd('cutFile');
    console.log(chunks);
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64String = e.target?.result;
      setBase64String(base64String as string);
    };

    reader.onerror = function (error) {

    };

    // 读取文件为 Data URL（Base64 编码）
    reader.readAsDataURL(file);
  }
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
    ...values,
  };
  return (
    <InputContext.Provider value={context}>{children}</InputContext.Provider>
  );
};

export const useInputContext = (): InputContextType => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error("InputContext not found");
  }
  return context;
};
