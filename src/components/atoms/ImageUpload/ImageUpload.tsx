import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useColors } from "../../../utils/types";
import { type ImageUploadResponse } from "../../../services/useProfileService";
import { FiUpload, FiX, FiAlertCircle, FiInfo, FiTrash2, FiMaximize2 } from "react-icons/fi";
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
    maxWidth?: string | number;
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
    maxWidth = 260,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const colors = useColors();
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

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
        } catch (err) {
            setUploadError('Upload failed. Please try again.');
            setPreviewImage(value?.url || null);
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
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleZoom = () => setShowZoomModal(true);

    useEffect(() => {
        const root = document.getElementById('root');
        if (showZoomModal) {
            document.body.style.overflow = 'hidden';
            if (root) {
                root.style.filter = 'blur(6px)';
                root.style.transition = 'filter 0.4s ease';
            }
        } else {
            document.body.style.overflow = 'unset';
            if (root) {
                root.style.filter = 'none';
            }
        }
        return () => {
            document.body.style.overflow = 'unset';
            if (root) {
                root.style.filter = 'none';
            }
        };
    }, [showZoomModal]);

    const hasError = error || !!uploadError;
    const displayHelperText = uploadError || helperText;

    const currentRatioClass = aspectRatioClasses[aspectRatio] || aspectRatioClasses.square;
    const containerMaxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

    return (
        <div className={`flex flex-col space-y-3 ${className}`} style={{ width: '100%', maxWidth: containerMaxWidth }}>
            {label && (
                <label className="flex items-center gap-2 mb-1" style={{ color: colors.neutral700, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>
                    <span className="uppercase opacity-60">{label}</span>
                    {required && <span style={{ color: colors.error500 }}>*</span>}
                </label>
            )}

            <div className={`relative group/upload ${previewImage ? 'w-fit h-fit' : `w-full ${currentRatioClass}`} rounded-sm overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl`}>
                <AnimatePresence mode="wait">
                    {!previewImage ? (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className={`h-full w-full relative flex flex-col items-center justify-center border-2 transition-all duration-500 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                } ${dragActive ? 'scale-[1.02]' : ''
                                }`}
                            style={{
                                borderColor: dragActive ? colors.primary500 : hasError ? colors.error500 : `${colors.neutral200}60`,
                                backgroundColor: dragActive ? `${colors.primary500}08` : hasError ? `${colors.error500}05` : `${colors.neutral50}40`,
                                borderStyle: dragActive ? 'solid' : 'dashed',
                                backdropFilter: 'blur(12px)'
                            }}
                            onClick={() => !disabled && inputRef.current?.click()}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input ref={inputRef} type="file" accept={accept} hidden disabled={disabled} onChange={(e) => handleSelect(e.target.files)} />

                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

                            <div className="relative z-10 flex flex-col items-center gap-4 p-8 text-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary500}15, ${colors.primary600}05)`,
                                        border: `1px solid ${colors.primary500}20`
                                    }}
                                >
                                    <FiUpload style={{ fontSize: 22, color: colors.primary500 }} />
                                </motion.div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold tracking-tight" style={{ color: colors.neutral800 }}>
                                        {placeholder || 'Drop assets here'}
                                    </p>
                                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.15em]" style={{ color: colors.neutral500 }}>
                                        Click to browse
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`w-full relative overflow-hidden transition-all duration-500 rounded-2xl`}
                        >
                            <img src={previewImage} alt="Preview" className="max-w-full h-auto block object-contain transition-transform duration-1000 group-hover/upload:scale-105" />

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                                {showPreview && (
                                    <button
                                        type="button"
                                        onClick={handleZoom}
                                        className="p-3 rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/40 transition-all duration-300"
                                        title="Zoom view"
                                    >
                                        <FiMaximize2 size={20} />
                                    </button>
                                )}
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="p-3 rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/40 transition-all duration-300"
                                        title="Remove asset"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-20 bg-white/40 backdrop-blur-xl flex flex-col items-center justify-center gap-4"
                    >
                        <div className="relative h-12 w-12">
                            <div className="absolute inset-0 rounded-full border-2 border-primary-500/10" />
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-primary-500 border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: colors.primary600 }}>Syncing Asset</p>
                    </motion.div>
                )}
            </div>

            {displayHelperText && (
                <div className={`flex items-center gap-2 px-1 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${hasError ? 'text-red-500' : 'opacity-40'}`} style={{ color: hasError ? colors.error500 : colors.neutral500 }}>
                    {hasError ? <FiAlertCircle size={14} /> : <FiInfo size={14} />}
                    <span>{displayHelperText}</span>
                </div>
            )}

            {showZoomModal && previewImage && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/30 transition-opacity duration-300"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    onClick={() => setShowZoomModal(false)}
                >
                    <div
                        className="relative w-fit h-fit max-w-[95vw] max-h-[95vh] rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex items-center justify-center bg-black/20"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={previewImage}
                            alt="Full size"
                            className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain shadow-2xl"
                        />
                        <button
                            onClick={() => setShowZoomModal(false)}
                            className="absolute top-6 right-6 h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all flex items-center justify-center border border-white/10 group shadow-xl"
                        >
                            <FiX fontSize={24} className="transition-transform duration-300" />
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default React.memo(ImageUpload);