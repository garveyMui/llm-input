import React from "react";

export const Input: React.FC = () => {
    const [inputValue, setInputValue] = React.useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }
    return (
        <div>
            <h1>Input</h1>
            <input
                type="text"
                placeholder="Digite o valor"
                value={inputValue}
                onChange={handleChange}
            />
        </div>
    );
};

// export default Input;