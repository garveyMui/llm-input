import React from 'react';
import { Input } from './Input';
import { Meta, StoryObj } from '@storybook/react';
import { InputContextProvider } from '@/contexts/Input/Input';
// 模拟 handleSend 函数
const mockHandleSend = (message: string, type: 'text' | 'image_url' | 'video_url', url: string, extractContent: any | null) => {
  console.log('handleSend called with:', message, type, url, extractContent);
};

const withInputContext = (Story: React.FC) => (
    <InputContextProvider values={mockHandleSend}>
      <Story />
    </InputContextProvider>
);


const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  decorators: [withInputContext],
  args: {
    handleSend: mockHandleSend,
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

// 默认故事
export const Default: Story = {};

// 不同设备尺寸的故事
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
