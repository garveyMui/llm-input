import React from "react";
import {useInputContext} from "@/contexts/Input/Input";

export const Input: React.FC = () => {
    const {
        inputValue,
        handleChange,
        isChineseInput,
    } = useInputContext();
    return (
        <div>
            <h1>Input</h1>
            <textarea
                placeholder="Digite o valor"
                value={inputValue}
                onChange={handleChange}
                onCompositionStart={()=>{
                    isChineseInput.current = true;
                }}
                onCompositionEnd={()=>{
                    isChineseInput.current = false;
                }}
            />
        </div>
    );
};

// export default Input;