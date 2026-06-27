import React, { useRef, useState } from "react";
import { FiUploadCloud, FiTrash2, FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import useFileService, { type IFileAsset, type IFileUploadOptions } from "../../../services/useFileService";

interface FileUploaderProps {
    resourceId: string;
    resourceType: string;
    initialAssets?: IFileAsset[];
    multiple?: boolean;
    accept?: string;
    maxSizeMb?: number;
    options?: IFileUploadOptions;
    onAssetsChange?: (assets: IFileAsset[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    resourceId,
    resourceType,
    initialAssets = [],
    multiple = false,
    accept = "image/*",
    maxSizeMb = 10,
    options = {},
    onAssetsChange,
}) => {
    const colors = useColors();
    const service = useFileService();
    const inputRef = useRef<HTMLInputElement>(null);

    const [assets, setAssets] = useState<IFileAsset[]>(initialAssets);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const notify = (updated: IFileAsset[]) => {
        setAssets(updated);
        onAssetsChange?.(updated);
    };

    const handleFiles = async (files: FileList) => {
        const list = multiple ? Array.from(files) : [files[0]];
        for (const file of list) {
            if (!file) continue;
            if (file.size > maxSizeMb * 1024 * 1024) {
                showToast(`"${file.name}" exceeds ${maxSizeMb} MB limit.`, false);
                continue;
            }
            setUploading(true);
            const isPrimary = assets.length === 0 && !options.isPrimary;
            const res = await service.upload(file, resourceId, resourceType, {
                ...options,
                isPrimary: options.isPrimary ?? isPrimary,
                sortOrder: options.sortOrder ?? assets.length,
            });
            setUploading(false);
            if (res?.status === HTTP_STATUS.OK) {
                const asset: IFileAsset = res.data.data;
                notify([...assets, asset]);
                showToast(`"${file.name}" uploaded.`, true);
            } else {
                showToast(`Failed to upload "${file.name}".`, false);
            }
        }
    };

    const handleDelete = async (id: string | number | null) => {
        setDeletingId(String(id));
        const res = await service.deleteFile(id);
        setDeletingId(null);
        if (res?.status === HTTP_STATUS.OK) {
            notify(assets.filter((a) => a.id !== id));
            showToast("File removed.", true);
        } else {
            showToast("Delete failed.", false);
        }
    };

    const border = `1.5px solid ${colors.neutral300}`;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        style={{
                            padding: "9px 14px",
                            borderRadius: 8,
                            fontSize: 12.5,
                            fontWeight: 600,
                            background: toast.ok ? `${colors.success500}14` : `${colors.error500}14`,
                            color: toast.ok ? colors.success600 : colors.error600,
                            border: `1px solid ${toast.ok ? colors.success500 : colors.error500}30`,
                        }}
                    >
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Asset list */}
            {assets.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "8px 10px",
                                borderRadius: 10,
                                border,
                                background: colors.neutral50,
                            }}
                        >
                            {asset.path && asset.mimeType?.startsWith("image/") && (
                                <img
                                    src={asset.path}
                                    alt=""
                                    style={{
                                        width: 48,
                                        height: 48,
                                        objectFit: "cover",
                                        borderRadius: 6,
                                        flexShrink: 0,
                                        border,
                                    }}
                                />
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        fontSize: 12.5,
                                        fontWeight: 600,
                                        color: colors.neutral800,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {asset.path.split("/").pop()}
                                </div>
                                <div style={{ fontSize: 11, color: colors.neutral400, marginTop: 2 }}>
                                    {asset.mimeType ?? "—"}
                                </div>
                            </div>
                            {asset.isPrimary && (
                                <FiStar
                                    size={13}
                                    style={{ color: colors.warning500, flexShrink: 0 }}
                                    title="Primary"
                                />
                            )}
                            <button
                                onClick={() => handleDelete(asset.id)}
                                disabled={deletingId === String(asset.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 30,
                                    height: 30,
                                    borderRadius: 7,
                                    border: "none",
                                    background: `${colors.error500}12`,
                                    color: colors.error500,
                                    cursor: "pointer",
                                    flexShrink: 0,
                                    opacity: deletingId === String(asset.id) ? 0.5 : 1,
                                }}
                            >
                                <FiTrash2 size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Drop zone — hidden when single file already uploaded */}
            {(multiple || assets.length === 0) && (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
                    }}
                    onClick={() => inputRef.current?.click()}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "32px 20px",
                        borderRadius: 12,
                        border: `2px dashed ${dragOver ? colors.primary500 : colors.neutral300}`,
                        background: dragOver ? `${colors.primary500}06` : colors.neutral50,
                        cursor: uploading ? "default" : "pointer",
                        transition: "border-color 0.2s, background 0.2s",
                        opacity: uploading ? 0.65 : 1,
                        pointerEvents: uploading ? "none" : "auto",
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: `${colors.primary500}12`,
                            color: colors.primary500,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {uploading ? (
                            <div
                                style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    border: `2px solid ${colors.primary400}`,
                                    borderTopColor: "transparent",
                                    animation: "fu-spin 0.8s linear infinite",
                                }}
                            />
                        ) : (
                            <FiUploadCloud size={20} />
                        )}
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: colors.neutral800 }}>
                            {uploading ? "Uploading…" : "Drop file here or click to browse"}
                        </div>
                        <div style={{ fontSize: 11.5, color: colors.neutral400, marginTop: 3 }}>
                            {accept.replace("image/*", "Images")} · Max {maxSizeMb} MB
                        </div>
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                style={{ display: "none" }}
                onChange={(e) => {
                    if (e.target.files?.length) handleFiles(e.target.files);
                    e.target.value = "";
                }}
            />

            <style>{`@keyframes fu-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default FileUploader;
