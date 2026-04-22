import React, { useRef, useState, useEffect } from "react";
import { useColors } from "../../../utils/types";
import { type ImageUploadResponse } from "../../../services/useProfileService";
import { FiUpload, FiX, FiCheck, FiAlertCircle, FiInfo, FiTrash2, FiMaximize } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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

    const handleZoom = () => setShowZoomModal(true);

    const hasError = error || !!uploadError;
    const displayHelperText = uploadError || helperText;

    const currentRatioClass = aspectRatioClasses[aspectRatio] || aspectRatioClasses.square;

    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            {label && (
                <label className="flex items-center gap-2 mb-1" style={{ color: colors.neutral700, fontSize: 13, fontWeight: 700, letterSpacing: '0.025em' }}>
                    <span className="uppercase opacity-50">{label}</span>
                    {required && <span style={{ color: colors.error500 }}>*</span>}
                </label>
            )}

            <div className={`relative group/upload w-full ${currentRatioClass}`}>
                <AnimatePresence mode="wait">
                    {!previewImage ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className={`h-full w-full relative rounded-[24px] border-2 transition-all duration-500 overflow-hidden flex flex-col items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                } ${dragActive ? 'shadow-2xl scale-[1.02]' : 'hover:shadow-lg'
                                }`}
                            style={{
                                borderColor: dragActive ? colors.primary500 : hasError ? colors.error500 : `${colors.neutral200}80`,
                                backgroundColor: dragActive ? `${colors.primary500}05` : hasError ? `${colors.error500}05` : `${colors.neutral50}50`,
                                borderStyle: dragActive ? 'solid' : 'dashed',
                                backdropFilter: 'blur(8px)'
                            }}
                            onClick={() => !disabled && inputRef.current?.click()}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input ref={inputRef} type="file" accept={accept} hidden disabled={disabled} onChange={(e) => handleSelect(e.target.files)} />

                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

                            <div className="relative z-10 flex flex-col items-center gap-4 p-6 text-center">
                                <div
                                    className="h-16 w-16 rounded-3xl flex items-center justify-center shadow-inner transition-transform duration-500"
                                    style={{ backgroundColor: `${colors.primary500}10` }}
                                >
                                    <FiUpload style={{ fontSize: 24, color: colors.primary500 }} />
                                </div>
                                <div>
                                    <p className="text-sm font-black m-0" style={{ color: colors.neutral800 }}>
                                        {placeholder || 'Drop assets here'}
                                    </p>
                                    <p className="text-[10px] mt-1 font-bold opacity-40 uppercase tracking-widest" style={{ color: colors.neutral500 }}>
                                        Click to browse or drag
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`h-full w-full relative rounded-[24px] border-2 overflow-hidden transition-all duration-500 shadow-xl`}
                            style={{ borderColor: hasError ? colors.error500 : `${colors.neutral200}80` }}
                        >
                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/upload:scale-110" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/upload:opacity-100 transition-opacity duration-300" />

                            <div className="absolute top-4 left-4 flex gap-2">
                                {uploadSuccess && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                                        <FiCheck />
                                    </motion.div>
                                )}
                            </div>

                            <div className="absolute bottom-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover/upload:translate-y-0 group-hover/upload:opacity-100 transition-all duration-300">
                                {showPreview && (
                                    <button
                                        type="button"
                                        onClick={handleZoom}
                                        className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur-md text-neutral-900 flex items-center justify-center hover:bg-white transition-all shadow-xl"
                                    >
                                        <FiMaximize />
                                    </button>
                                )}
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur-md text-red-600 flex items-center justify-center hover:bg-red-50 transition-all shadow-xl"
                                    >
                                        <FiTrash2 />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading && (
                    <div className="absolute inset-0 z-20 rounded-[24px] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                        <div className="relative h-12 w-12">
                            <div className="absolute inset-0 rounded-full border-4 border-primary-500/20" />
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.primary600 }}>Syncing Asset...</p>
                    </div>
                )}
            </div>

            {displayHelperText && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors ${hasError ? 'bg-red-50 text-red-600' : 'text-neutral-500'}`}>
                    {hasError ? <FiAlertCircle /> : <FiInfo className="opacity-40" />}
                    <span>{displayHelperText}</span>
                </div>
            )}

            <AnimatePresence>
                {showZoomModal && previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
                        onClick={() => setShowZoomModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="relative w-full max-w-5xl max-h-[85vh] rounded-[32px] overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <img src={previewImage} alt="Full size" className="w-full h-full object-contain" />
                            <button
                                onClick={() => setShowZoomModal(false)}
                                className="absolute top-6 right-6 h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all flex items-center justify-center"
                            >
                                <FiX fontSize={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageUpload;