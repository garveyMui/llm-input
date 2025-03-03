import React from "react";
import { useInputContext } from "@/contexts/Input/Input";
import { FileAddTwoTone, PictureTwoTone } from "@ant-design/icons";

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
          e.preventDefault();
          handleSend(inputValue);
          setInputValue("");
        }}
      >
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              handleSend(inputValue);
              setInputValue("");
            }
          }}
        />
        <button type={"submit"}>send</button>
        <FileAddTwoTone />
        <PictureTwoTone />
      </form>
    </div>
  );
};

// export default Input;
