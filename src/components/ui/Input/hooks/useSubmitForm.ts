import { useActionState } from "react";
import { toUploadFile } from "@/utils/uploadFile";

export function useSubmitForm(handleSend, resetState) {
  async function submitFunction(previousState, formData) {
    const inputValue = formData.get("plaintext");
    let imageFile = formData.getAll("imageFile")[0];
    if (imageFile.name === "") {
      imageFile = null;
    }
    let docFile = formData.getAll("docFile")[0];
    if (docFile.name === "") {
      docFile = null;
    }
    console.log(docFile);
    console.log(imageFile);
    let imageFileBase64 = null;
    if (imageFile) {
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            imageFileBase64 = e.target?.result as string;
            resolve(imageFileBase64);
          };
          reader.onerror = (e) => {
            reject(new Error("Error reading image"));
          };
          reader.readAsDataURL(file);
        });
      };
      imageFileBase64 = await fileToBase64(imageFile);
    }
    let extractContent;
    if (docFile) {
      extractContent = await toUploadFile(docFile);
    }
    let attachType = null;
    if (imageFile) {
      attachType = imageFile.type.split("/")[0];
    } else if (docFile) {
      attachType = docFile.type.split("/")[0];
    }
    try {
      await handleSend(
        inputValue,
        attachType || "text",
        imageFileBase64 || "",
        extractContent || null,
      );
      resetState();
      return {
        success: true,
        error: null,
      };
    } catch (error: Error) {
      console.error("Error submitting form:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  const [state, formAction, isPending] = useActionState(submitFunction, {
    success: null,
    error: null,
  });
  return { state, formAction, isPending };
}
