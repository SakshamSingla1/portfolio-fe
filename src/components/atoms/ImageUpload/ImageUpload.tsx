import React, { useRef, useState, useEffect } from "react";
import { useColors } from "../../../utils/types";
import { type ImageUploadResponse } from "../../../services/useProfileService";
import { FiUpload, FiX, FiImage, FiZoomIn, FiCheck, FiAlertCircle, FiInfo, FiTrash2 } from "react-icons/fi";

export interface ImageValue {
    url: string;
    publicId?: string;
}

interface ImageUploadProps {
    label?: string;
    value?: ImageValue | null;
    onChange: (value: ImageValue | null) => void;
    onUpload: (file: File) => Promise<ImageUploadResponse>;
    accept?: string;
    disabled?: boolean;
    maxSize?: number;
    showPreview?: boolean;
    aspectRatio?: "square" | "video" | "portrait" | "wide";
    className?: string;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    value,
    onChange,
    onUpload,
    accept = "image/*",
    disabled = false,
    maxSize = 5,
    showPreview = true,
    aspectRatio = "square",
    className = "",
    error = false,
    helperText,
    required = false,
    placeholder,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const colors = useColors();
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        setPreviewImage(value?.url || null);
    }, [value]);

    const aspectRatioClasses = {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]",
        wide: "aspect-[16/9]",
    };

    const validateFile = (file: File): boolean => {
        if (file.size > maxSize * 1024 * 1024) {
            setUploadError(`File size must be less than ${maxSize}MB`);
            return false;
        }

        if (!file.type.startsWith('image/')) {
            setUploadError('Only image files are allowed');
            return false;
        }

        setUploadError(null);
        return true;
    };

    const handleFileSelect = async (file: File) => {
        if (!file || disabled) return;
        if (!validateFile(file)) return;
        
        setLoading(true);
        setUploadError(null);
        setUploadSuccess(false);
        
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            const result = await onUpload(file);
            onChange({
                url: result.url,
                publicId: result.publicId
            });
            
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (err) {
            setUploadError('Upload failed. Please try again.');
            setPreviewImage(value?.url || null);
            setUploadSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        handleFileSelect(files[0]);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleRemove = () => {
        setPreviewImage(null);
        onChange(null);
        setUploadError(null);
        setUploadSuccess(false);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleZoom = () => {
        setShowZoomModal(true);
    };

    const hasError = error || !!uploadError;
    const displayHelperText = uploadError || helperText;

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label style={{
                    color: colors.neutral700,
                    fontSize: 14,
                    fontWeight: 500,
                    marginLeft: 8,
                }}>
                    {label}
                    {required && <span className="ml-1" style={{ color: colors.error500 }}>*</span>}
                </label>
            )}
            {!previewImage ? (
                <div
                    className={`relative rounded-xl border-2 transition-all duration-300 ${
                        disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    } ${
                        dragActive
                            ? 'border-primary500 bg-primary50 shadow-lg scale-[1.02]'
                            : loading
                            ? 'border-warning400 bg-warning50'
                            : hasError
                            ? 'border-error500 bg-error50'
                            : 'border-dashed hover:border-primary300'
                    }`}
                    style={{
                        borderColor: dragActive
                            ? undefined
                            : loading
                            ? colors.warning400
                            : hasError
                            ? colors.error500
                            : colors.neutral300,
                        backgroundColor: dragActive
                            ? undefined
                            : loading
                            ? colors.warning50
                            : hasError
                            ? colors.error50
                            : colors.neutral50,
                    }}
                    onClick={() => !disabled && inputRef.current?.click()}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        hidden
                        disabled={disabled}
                        onChange={(e) => handleSelect(e.target.files)}
                    />

                    <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 space-y-4">
                        <div
                            className={`relative rounded-full p-3 sm:p-4 transition-all duration-300 ${
                                loading ? 'animate-pulse' : dragActive ? 'animate-bounce' : ''
                            }`}
                            style={{
                                backgroundColor: loading
                                    ? colors.warning100
                                    : dragActive
                                    ? colors.primary100
                                    : hasError
                                    ? colors.error100
                                    : colors.neutral100,
                            }}
                        >
                            {loading ? (
                                <FiUpload className="w-6 h-6 sm:w-8 sm:h-8 animate-bounce" style={{ color: colors.warning500 }} />
                            ) : dragActive ? (
                                <FiImage className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: colors.primary600 }} />
                            ) : hasError ? (
                                <FiAlertCircle className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: colors.error500 }} />
                            ) : (
                                <FiUpload className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: colors.neutral400 }} />
                            )}
                        </div>

                        <div className="text-center space-y-2">
                            <p
                                className={`text-sm sm:text-base font-medium ${
                                    dragActive
                                        ? 'text-primary600'
                                        : loading
                                        ? 'text-warning500'
                                        : hasError
                                        ? 'text-error500'
                                        : ''
                                }`}
                                style={{
                                    color: dragActive
                                        ? colors.primary600
                                        : loading
                                        ? colors.warning500
                                        : hasError
                                        ? colors.error500
                                        : colors.neutral700,
                                }}
                            >
                                {loading
                                    ? 'Uploading...'
                                    : dragActive
                                    ? 'Drop image here'
                                    : placeholder || 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-xs sm:text-sm" style={{ color: colors.neutral500 }}>
                                {loading
                                    ? 'Please wait...'
                                    : hasError
                                    ? 'Try again or choose a different file'
                                    : `Accepts ${accept.replace('image/', '').toUpperCase()} files (Max ${maxSize}MB)`}
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <div className="absolute inset-0 rounded-xl bg-white bg-opacity-90 flex items-center justify-center backdrop-blur-sm">
                            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-2 h-2 sm:w-3 sm:h-3 bg-warning500 rounded-full animate-bounce"
                                        style={{ animationDelay: '0ms' }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 sm:w-3 sm:h-3 bg-warning500 rounded-full animate-bounce"
                                        style={{ animationDelay: '150ms' }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 sm:w-3 sm:h-3 bg-warning500 rounded-full animate-bounce"
                                        style={{ animationDelay: '300ms' }}
                                    ></div>
                                </div>
                                <p className="text-xs sm:text-sm font-medium" style={{ color: colors.warning500 }}>
                                    Uploading image...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="relative group">
                        <div
                            className={`rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                                aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses] ||
                                aspectRatioClasses.square
                            } ${hasError ? 'border-error500' : 'border-neutral200'}`}
                            style={{ borderColor: hasError ? colors.error500 : colors.neutral200 }}
                        >
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {uploadSuccess && (
                                <div className="absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-success500 text-white flex items-center justify-center animate-pulse z-10">
                                    <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                                </div>
                            )}

                            <div className="absolute bottom-2 right-2 flex space-x-1 sm:space-x-2 z-10">
                                {showPreview && (
                                    <button
                                        type="button"
                                        onClick={handleZoom}
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-neutral700 flex items-center justify-center hover:bg-neutral100 transition-all duration-200 shadow-lg hover:scale-110"
                                        title="View full size"
                                    >
                                        <FiZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                )}
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full text-white flex items-center justify-center hover:bg-error600 transition-all duration-200 shadow-lg hover:scale-110"
                                        title="Remove image"
                                    >
                                        <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center backdrop-blur-sm z-20">
                                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-2 h-2 sm:w-3 sm:h-3 bg-warning500 rounded-full animate-bounce"
                                            style={{ animationDelay: '0ms' }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 sm:w-3 sm:h-3 bg-warning500 rounded-full animate-bounce"
                                            style={{ animationDelay: '150ms' }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 sm:w-3 sm:h-3 bg-warning500 rounded-full animate-bounce"
                                            style={{ animationDelay: '300ms' }}
                                        ></div>
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium" style={{ color: colors.warning500 }}>
                                        Updating image...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {displayHelperText && (
                <div
                    className={`flex items-start space-x-2 text-xs sm:text-sm ${
                        hasError ? 'text-error500' : 'text-neutral500'
                    }`}
                >
                    {hasError ? (
                        <FiAlertCircle
                            className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0"
                            style={{ color: colors.error500 }}
                        />
                    ) : (
                        <FiInfo
                            className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0"
                            style={{ color: colors.neutral400 }}
                        />
                    )}
                    <span>{displayHelperText}</span>
                </div>
            )}

            {showZoomModal && previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm"
                    onClick={() => setShowZoomModal(false)}
                >
                    <div className="relative w-full max-w-4xl sm:max-w-6xl max-h-[90vh] sm:max-h-full animate-in zoom-in-95 duration-200">
                        <img
                            src={previewImage}
                            alt="Full size preview"
                            className="w-full h-full max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                        />
                        <button
                            type="button"
                            onClick={() => setShowZoomModal(false)}
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white text-neutral700 flex items-center justify-center hover:bg-neutral100 transition-all duration-200 shadow-lg hover:scale-110"
                        >
                            <FiX className="w-4 h-4 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;