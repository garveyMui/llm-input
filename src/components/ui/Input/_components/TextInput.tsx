import React from 'react';

interface TextInputProps {
    value: string;
    ref: React.RefObject<HTMLTextAreaElement> | null;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
    styles?: object;
    [key: string]: any;  // 索引签名，index signature
}

export default function TextInput({value, ref, onChange, onKeyDown,placeholder="Let's chat!😍", className="p-2 resize-none focus:outline-none", styles, ...restProps}: TextInputProps) {
    return (
        <textarea
            ref={ref}
            className={className}
            name={"plaintext"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={(e)=>{
                const len = e.target.value.length;
                e.target.setSelectionRange(len, len);
            }}
            placeholder={placeholder}
            style={styles}
        />
    );
}