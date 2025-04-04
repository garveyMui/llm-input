import React, { ChangeEvent, useRef } from "react";
import { ImageUp, Upload } from "lucide-react";

interface FileUploadProps {
    onFileChange: (file: File, fileType: "doc" | "image") => void;
    children?: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, children, ...restProps }) => {
    const docInputRef = useRef<HTMLInputElement>(null);
    const imgInputRef = useRef<HTMLInputElement>(null);

    const handleDocChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileChange(file, "doc");
        }
    };

    const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileChange(file, "image");
        }
    };

    return (
        <fieldset className="absolute bottom-2 left-2 flex items-center space-x-3">
            <legend className="hidden">Add Attachment</legend>
            <input
                name="docFile"
                type="file"
                accept=".pdf"
                onChange={handleDocChange}
                className="hidden"
                id="docUploadId"
                ref={docInputRef}
            />
            <input
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImgChange}
                className="hidden"
                id="imgUploadId"
                ref={imgInputRef}
            />
            <label htmlFor="imgUploadId" className="cursor-pointer">
                <ImageUp />
            </label>
            <label htmlFor="docUploadId" className="cursor-pointer">
                <Upload />
            </label>
            {children}
        </fieldset>
    );
};