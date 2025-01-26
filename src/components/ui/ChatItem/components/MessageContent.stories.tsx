import React from 'react';
import { MessageContent } from './MessageContent';

// 默认导出，提供组件信息
export default {
    title: 'Components/MessageContent',  // 组件分类和名称
    component: MessageContent,
};

// 定义一个模板，用于展示组件
const Template = (args: any) => <MessageContent {...args} />;

// 导出不同的故事（展示不同的状态或用法）
export const Default = Template.bind({});
Default.args = {
    message: 'Hello, this is a test message!',
};

export const EmptyMessage = Template.bind({});
EmptyMessage.args = {
    message: '',
};

export const CustomMessage = Template.bind({});
CustomMessage.args = {
    message: 'Custom message from Storybook!',
};
