import React, { useContext, useRef, createContext } from "react";

interface InputContextType {
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  isChineseInput: React.RefObject<boolean>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const InputContext = createContext<InputContextType | undefined>(undefined);

export const InputContextProvider: React.FC<{
  children: React.ReactNode;
  values: any;
}> = ({ children, values }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isChineseInput = useRef(false);
  const [inputValue, setInputValue] = React.useState("你好");
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const context = {
    textAreaRef,
    isChineseInput,
    setInputValue,
    inputValue,
    handleChange,
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
