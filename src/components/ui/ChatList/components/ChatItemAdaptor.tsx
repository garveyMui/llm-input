import { App } from 'antd';
import { memo, useCallback, useMemo, useState } from 'react';
import ChatItem from "../ChatItem";
import { copyToClipboard } from "../../utils/copyToClipboard";
import ActionsBar from "./ActionsBar";

// Define prop types for the component
interface ItemProps {
    renderMessagesExtra?: Record<string, React.ComponentType<any>>;
    showTitle?: boolean;
    onActionsClick?: (action: { key: string }, data: any) => void;
    onAvatarsClick?: () => void;
    onMessageChange?: (message: string) => void;
    type?: string;
    text?: { copySuccess: string };
    renderMessages?: Record<string, React.ComponentType<any>>;
    renderErrorMessages?: Record<string, { Render: React.ComponentType<any> }>;
    renderActions?: Record<string, React.ComponentType<any>>;
    loading?: boolean;
    groupNav?: any;
    renderItems?: Record<string, React.ComponentType<any>>;
    item: any;
}

const Item: React.FC<ItemProps> = memo((props) => {
    const {
        renderMessagesExtra,
        showTitle,
        onActionsClick,
        onAvatarsClick,
        onMessageChange,
        type,
        text,
        renderMessages,
        renderErrorMessages,
        renderActions,
        loading,
        groupNav,
        renderItems,
        item
    } = props;

    const [editing, setEditing] = useState(false);
    const { message } = App.useApp();

    // Memoize the renderItems function based on role
    const RenderItem = useMemo(() => {
        if (!renderItems || !item?.role) return;
        const renderFunction = renderItems[item.role] || renderItems['default'];
        if (!renderFunction) return;
        return renderFunction;
    }, [renderItems, item.role]);

    // Callback for rendering messages
    const RenderMessage = useCallback(
        ({ editableContent, data }: { editableContent: boolean; data: any }) => {
            if (!renderMessages || !item?.role) return;
            const RenderFunction = renderMessages[item.role] || renderMessages['default'];
            if (!RenderFunction) return;
            return <RenderFunction {...data} editableContent={editableContent} />;
        },
        [renderMessages, item.role]
    );

    // Callback for rendering message extras
    const MessageExtra = useCallback(
        ({ data }: { data: any }) => {
            if (!renderMessagesExtra || !item?.role) return;
            const RenderFunction = renderMessagesExtra[item.role] || renderMessagesExtra['default'];
            if (!RenderFunction) return;
            return <RenderFunction {...data} />;
        },
        [renderMessagesExtra, item.role]
    );

    // Callback for rendering error messages
    const ErrorMessage = useCallback(
        ({ data }: { data: any }) => {
            if (!renderErrorMessages || !item?.error?.type) return;
            const RenderFunction = renderErrorMessages[item.error.type]?.Render || renderErrorMessages['default']?.Render;
            if (!RenderFunction) return;
            return <RenderFunction {...data} />;
        },
        [renderErrorMessages]
    );

    // Callback for handling actions
    const Actions = useCallback(
        ({ data }: { data: any }) => {
            if (!renderActions || !item?.role) return;
            let RenderFunction = renderActions[item.role] || renderActions['default'] || ActionsBar;

            const handleActionClick = async (action: { key: string }, data: any) => {
                switch (action.key) {
                    case 'copy':
                        await copyToClipboard(data.content);
                        message.success(text?.copySuccess || 'Copy Success');
                        break;
                    case 'edit':
                        setEditing(true);
                        break;
                }
                onActionsClick?.(action, data);
            };

            return <RenderFunction {...data} onActionClick={handleActionClick} text={text} />;
        },
        [renderActions, item.role, text, onActionsClick]
    );

    const error = useMemo(() => {
        if (!item.error) return;
        const message = item.error.message || '';
        return message;
    }, [item.error]);

    return (
        <div>
            {/* Render logic can go here */}
            <ChatItem />
            {RenderItem && <RenderItem />}
            {RenderMessage && <RenderMessage editableContent={editing} data={item} />}
            {MessageExtra && <MessageExtra data={item} />}
            {ErrorMessage && <ErrorMessage data={item} />}
            {Actions && <Actions data={item} />}
        </div>
    );
});

export default Item;
