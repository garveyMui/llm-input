import React, { memo } from 'react';
import ActionIconGroup from "../../ActionIconGroup";
import { useChatListActionsBar } from "../../hooks/useChatListActionsBar";
import { jsx as _jsx } from "react/jsx-runtime";

// 定义 props 类型
interface ActionsBarProps {
    text: string;
    [key: string]: any;  // 用于处理 `rest`，它将包含其他未解构的 props
}

const ActionsBar: React.FC<ActionsBarProps> = memo((_ref: ActionsBarProps) => {
    const { text, ...rest } = _ref;  // 解构出 text 和 rest

    // 获取 actions
    const { regenerate, edit, copy, divider, del } = useChatListActionsBar(text);

    return (
        <ActionIconGroup
            {...rest}  // 展开其他 props
            dropdownMenu={[edit, copy, regenerate, divider, del]}
            items={[regenerate, edit]}
            type="ghost"
        />
    );
});

export default ActionsBar;
