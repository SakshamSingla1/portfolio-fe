import React, { useEffect, useRef, useState } from "react";
import { FiUploadCloud, FiTrash2, FiImage } from "react-icons/fi";
import { motion } from "framer-motion";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import usePlatformSettingsService, { type IPlatformSettings } from "../../../services/usePlatformSettingsService";
import useFileService from "../../../services/useFileService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { Card, SectionLabel } from "../Dashboard/shared/DashboardUI";

const BANNER_RESOURCE_TYPE = "BANNER";
// Must match the backend's hardcoded PlatformSettingsServiceImpl.BANNER_RESOURCE_ID —
// this is a singleton platform-wide asset, not tied to any real profile/resource row.
const PLATFORM_RESOURCE_ID = -1;

const BannerTab: React.FC = () => {
    const colors = useColors();
    const settingsService = usePlatformSettingsService();
    const fileService = useFileService();
    const { showSnackbar } = useSnackbar();
    const inputRef = useRef<HTMLInputElement>(null);

    const [settings, setSettings] = useState<IPlatformSettings | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        settingsService.getSettings().then((res: any) => {
            if (res?.status === HTTP_STATUS.OK) setSettings(res.data.data);
        });
    }, [settingsService]);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            showSnackbar("error", "Please select an image file.");
            return;
        }
        const previousAssetId = settings?.bannerAssetId ?? null;
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        const res = await fileService.upload(file, PLATFORM_RESOURCE_ID, BANNER_RESOURCE_TYPE, {
            isPrimary: true,
            sortOrder: 0,
        });
        setUploading(false);
        if (res?.status === HTTP_STATUS.OK) {
            const asset = res.data.data;
            // Delete the old asset from Cloudinary after successful upload
            if (previousAssetId) fileService.deleteFile(previousAssetId);
            setSettings({ bannerImageUrl: asset.path, bannerAssetId: asset.id });
            setPreview(null);
            showSnackbar("success", "Banner uploaded successfully.");
        } else {
            setPreview(null);
            showSnackbar("error", "Upload failed. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!settings?.bannerAssetId) return;
        setDeleting(true);
        const res = await fileService.deleteFile(settings.bannerAssetId);
        setDeleting(false);
        if (res?.status === HTTP_STATUS.OK) {
            setSettings(null);
            showSnackbar("success", "Banner removed.");
        } else {
            showSnackbar("error", "Delete failed.");
        }
    };

    const currentImage = preview ?? settings?.bannerImageUrl ?? null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: 680, margin: "0 auto" }}
        >
            <Card hero>
                <SectionLabel accent={colors.primary600}>Platform Banner</SectionLabel>
                {currentImage ? (
                <div
                    style={{
                        borderRadius: 14,
                        overflow: "hidden",
                        border: `1px solid ${colors.neutral200}`,
                        marginBottom: 16,
                        position: "relative",
                    }}
                >
                    <img
                        src={currentImage}
                        alt="Landing banner"
                        style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block" }}
                    />
                    {uploading && (
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "rgba(0,0,0,0.45)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 14, fontWeight: 600, gap: 8,
                        }}>
                            <div style={{
                                width: 18, height: 18, borderRadius: "50%",
                                border: `2px solid ${colors.primary400}`,
                                borderTopColor: "transparent",
                                animation: "spin 0.8s linear infinite",
                            }} />
                            Uploading…
                        </div>
                    )}
                    {!uploading && settings?.bannerImageUrl && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{
                                position: "absolute", top: 10, right: 10,
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "7px 14px", borderRadius: 8,
                                background: "rgba(0,0,0,0.55)",
                                backdropFilter: "blur(8px)",
                                color: "#fff", border: "none", cursor: "pointer",
                                fontSize: 12, fontWeight: 600,
                            }}
                        >
                            {deleting ? "Removing…" : <><FiTrash2 size={13} /> Remove</>}
                        </button>
                    )}
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        const f = e.dataTransfer.files[0];
                        if (f) handleFile(f);
                    }}
                    onClick={() => inputRef.current?.click()}
                    style={{
                        borderRadius: 14,
                        border: `2px dashed ${dragOver ? colors.primary500 : colors.neutral300}`,
                        background: dragOver ? `${colors.primary500}06` : colors.neutral50,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        gap: 12, padding: "48px 24px", cursor: "pointer",
                        transition: "border-color 0.2s, background 0.2s",
                        marginBottom: 16,
                    }}
                >
                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: `${colors.primary500}12`, color: colors.primary500,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <FiImage size={24} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: colors.neutral800, marginBottom: 4 }}>
                            Drop an image here or click to browse
                        </div>
                        <div style={{ fontSize: 12, color: colors.neutral400 }}>
                            PNG, JPG, WebP · Recommended 1600×900 or wider
                        </div>
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                    e.target.value = "";
                }}
            />

            {currentImage && !uploading && (
                <button
                    onClick={() => inputRef.current?.click()}
                    style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "10px 20px", borderRadius: 10,
                        background: `${colors.primary500}12`,
                        color: colors.primary600,
                        border: `1px solid ${colors.primary500}25`,
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.primary500}20`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = `${colors.primary500}12`; }}
                >
                    <FiUploadCloud size={15} /> Replace image
                </button>
            )}

            <p style={{ fontSize: 11.5, color: colors.neutral400, marginTop: 14 }}>
                This image appears in the hero section of the Portfolios Builder landing page. It is stored on Cloudinary and served via CDN.
            </p>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </Card>
        </motion.div>
    );
};

export default BannerTab;
