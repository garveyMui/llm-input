// import { useResponsive } from 'antd-style';
import { Flexbox } from 'react-layout-kit';
import React from 'react';

interface MessageContentProps {
    message: string;
    render?: (message: string) => React.ReactNode;
}

export const MessageContent: React.FC<MessageContentProps> = ({message,
                                                              render}) => {
    return (
        <Flexbox>
            {render ? render(message) : message}
        </Flexbox>
    )
};
