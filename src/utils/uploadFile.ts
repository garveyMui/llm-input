import {request} from "@/utils/request";
// import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';
// import { openAsBlob } from 'fs';

// const filesOperations = async () => {
//   const ai = new ZhipuAI()
//   const result = await ai.createFiles({
//     file: await openAsBlob("file path"),
//     purpose: "test"
//   })
//   console.log(result, "create file")
//
//   const fileList = await ai.findFiles(
//   );
//   console.log(fileList, "find file list")
// }

export const toUploadFile = async (file: File) => {
  if (file.type.split('/')[0] === 'image') {
    return Promise.reject(new Error('不支持上传图片'));
  }
  const formData = new FormData();
  formData.append('file', file);
  formData.append('purpose', 'file-extract');

  try {
    const res = await request.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(res, "upload file")
    const content = await getFileContent(res.data.id);
    console.log(content, "file content")
    return content; // 直接返回上传结果
  } catch (error) {
    console.error('文件上传失败:', error);
    return Promise.reject(error); // 让调用方自行处理错误
  }
};

export const getFileContent = async (file_id:string) => {
  try {
    const res = await request.get(`/files/${file_id}/content`);
    console.log(res, "upload file")
    return res.data; // 直接返回上传结果
  } catch (error) {
    console.error('文件上传失败:', error);
    return Promise.reject(error); // 让调用方自行处理错误
  }
};
