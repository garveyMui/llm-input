import { uploadFile } from './uploadFile';
import { request } from '@/utils/request';
import { describe, test, expect, vi } from 'vitest'
import '@testing-library/jest-dom'

// 模拟 request 对象
vi.mock('@/utils/request', () => ({
  request: {
    post: vi.fn(),
  },
}));

describe('uploadFile', () => {
  test('should call request.post with correct arguments', async () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', file);

    await uploadFile(file);

    expect(request.post).toHaveBeenCalledWith(formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  });
});
