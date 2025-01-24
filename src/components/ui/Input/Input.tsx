import React from "react";
import { useInputContext } from "@/contexts/Input/Input";

interface InputProps {
  handleSend: (message: string) => void;
}
export const Input: React.FC<InputProps> = ({ handleSend }) => {
  const { inputValue, setInputValue, handleChange, isChineseInput } =
    useInputContext();
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // 阻止默认表单提交行为
          handleSend(inputValue); // 调用传入的 handleSend 方法
          setInputValue("");
        }}
      >
        <textarea
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
              handleSend(inputValue);
              setInputValue("");
            }
          }}
        />
        <button type={"submit"}>send</button>
      </form>
    </div>
  );
};

// export default Input;
