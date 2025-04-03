import React, { useId, useRef } from "react";
import ReactDOM from "react-dom";
import { useInputContext } from "@/contexts/Input/Input";
import { toUploadFile } from "@/utils/uploadFile";
import { Send, ImageUp, Upload} from 'lucide-react';
import styles from "./Input.module.scss";
import classNames from "classnames";
interface InputProps {
  handleSend: (
    message: string,
    type: "text" | "image_url" | "video_url",
    url: string,
    extractContent: any | null,
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
  // // 判断是否为受控组件：传入 value 则视为受控
  //     const isControlled = value !== undefined;
  //     // 非受控模式下使用内部 state 保存输入值
  //     const [internalValue, setInternalValue] = useState(defaultValue);
  //     // 当前值由受控/非受控模式决定
  //     const currentValue = isControlled ? value : internalValue;
  //
  //     // 输入值改变时的处理
  //     const handleChange = (e) => {
  //         const newValue = e.target.value;
  //         if (!isControlled) {
  //             setInternalValue(newValue);
  //         }
  //         if (onChange) {
  //             onChange(e);
  //         }
  //     };
  //
  //     // 按下 Enter 键时的处理
  //     const handleKeyPress = (e) => {
  //         if (e.key === 'Enter' && onPressEnter) {
  //             onPressEnter(e);
  //         }
  //     };
  //
  //     // 清除图标点击时的处理（当 allowClear 为 true 且有内容时显示）
  //     const handleClear = () => {
  //         if (disabled) return;
  //         if (!isControlled) {
  //             setInternalValue('');
  //         }
  //         if (onChange) {
  //             // 模拟事件对象传递空值
  //             const event = { target: { value: '' } };
  //             onChange(event);
  //         }
  //     };
  //
  //     // 如果启用 allowClear 且有内容，则生成清除图标节点
  //     let clearIconNode = null;
  //     if (allowClear && currentValue && !disabled) {
  //         // 允许自定义清除图标
  //         const clearIcon =
  //             typeof allowClear === 'object' && allowClear.clearIcon ? allowClear.clearIcon : '×';
  //         clearIconNode = (
  //             <span className="input-clear-icon" onClick={handleClear} style={{ cursor: 'pointer' }}>
  //         {clearIcon}
  //       </span>
  //         );
  //     }
  //
  //     // 展示输入字数统计
  //     let countNode = null;
  //     if (showCount) {
  //         const count = currentValue ? currentValue.length : 0;
  //         if (typeof showCount === 'object' && showCount.formatter) {
  //             countNode = showCount.formatter({ value: currentValue, count, maxLength });
  //         } else {
  //             countNode = <span className="input-count">{maxLength ? `${count} / ${maxLength}` : count}</span>;
  //         }
  //     }
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
      extractContent || null,
    );
    // 清空输入
    setInputValue("");
    setUploadFile(null);
    setBase64String(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  async function handleFormSubmit(formData: FormData) {
    console.log(formData.get("message"));
    handleKeyPress();
  }
  const textareaId = useId();
  const fileUploadId = useId();
  const sendButtonId = useId();
  const sendButtonRef = useRef(null);
  return (
    <form
      className="box-border w-80 sm:w-3/4 md:w-4/5 lg:w-5/6 xl:w-6/7 max-w-160 mx-auto relative mt-4 mb-4 p-4 border border-gray-300 rounded-lg shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all"
      action={handleFormSubmit}
      onClick={()=>{
        textAreaRef.current?.focus();
      }}
    >
      <label htmlFor={textareaId} aria-label={"input"} />
      <textarea
        name={"message"}
        id={textareaId}
        required={true}
        ref={textAreaRef}
        className="p-2 resize-none focus:outline-none"
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
          if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            setInputValue((prev) => prev + "\n");
          }
          else if (e.key === "Enter") {
            e.preventDefault();
            handleKeyPress();
          }
        }}
      />
      <fieldset className="absolute bottom-2 left-2 flex items-center space-x-3">
        <legend className={"hidden"}>add attachment</legend>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id={fileUploadId}
        />
        <label htmlFor={fileUploadId} className="cursor-pointer">
          <ImageUp />
        </label>
        <label htmlFor={fileUploadId} className="cursor-pointer">
          <Upload />
        </label>
      </fieldset>
      <button
        className={classNames("absolute bottom-2 right-2 rounded-full flex justify-center items-center shadow-md transition-all", styles.sendButton)}
        type="submit"
        id={sendButtonId}
      >
      </button>
      <label ref={sendButtonRef} htmlFor={sendButtonId} className={classNames("absolute bottom-2 right-2", styles.sendLabel)}>
        <Send />
      </label>
    </form>
  );
};
