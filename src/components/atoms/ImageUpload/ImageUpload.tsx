import React, { useRef, useState } from "react";
import { useColors } from "../../../utils/types";

export interface UploadResult {
    url: string;
    publicId: string;
}

interface ImageUploaderProps {
    label?: string;
    multiple?: boolean;
    value?: UploadResult | UploadResult[] | null;
    onUpload: (files: File[]) => Promise<UploadResult | UploadResult[]>;
    onChange: (value: UploadResult | UploadResult[]) => void;
    accept?: string;
    disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    label,
    multiple = false,
    value,
    onUpload,
    onChange,
    accept = "image/*",
    disabled = false,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const colors = useColors();
    const [loading, setLoading] = useState(false);

    const previews = Array.isArray(value) ? value : value ? [value] : [];

    const handleSelect = async (files: FileList | null) => {
        if (!files || disabled) return;

        setLoading(true);
        try {
            const result = await onUpload(Array.from(files));
            onChange(result);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <label
                    className="text-sm font-medium"
                    style={{ color: colors.neutral800 }}
                >
                    {label}
                </label>
            )}

            <div
                className="rounded-lg border-2 border-dashed p-4 cursor-pointer transition flex flex-col items-center justify-center"
                style={{
                    borderColor: colors.primary300,
                    backgroundColor: colors.primary50,
                }}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    hidden
                    onChange={(e) => handleSelect(e.target.files)}
                />

                <span
                    className="text-sm"
                    style={{ color: colors.primary700 }}
                >
                    {loading
                        ? "Uploading..."
                        : previews.length > 0
                        ? "Click to replace"
                        : "Click to upload"}
                </span>
            </div>

            {previews.length > 0 && (
                <div className="flex gap-3 flex-wrap mt-2">
                    {previews.map((item, index) => (
                        <div
                            key={index}
                            className="h-20 w-20 rounded overflow-hidden border"
                            style={{ borderColor: colors.neutral300 }}
                        >
                            <img
                                src={item.url}
                                alt="preview"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
