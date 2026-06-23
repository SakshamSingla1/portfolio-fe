import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiCheck, FiAlertCircle, FiExternalLink } from "react-icons/fi";
import { useColors, HTTP_STATUS } from "../../../utils/types";
import { useSocialLinkService, type SocialLinkResponse } from "../../../services/useSocialLinkService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";

const GITHUB_BASE = "https://github.com/";

const extractUsername = (url: string): string =>
    url.replace(/^https?:\/\/(www\.)?github\.com\/?/i, "").replace(/\/$/, "").trim();

const GitHubTab: React.FC = () => {
    const colors = useColors();
    const socialService = useSocialLinkService();
    const { showSnackbar } = useSnackbar();

    const [githubLink, setGithubLink] = useState<SocialLinkResponse | null>(null);
    const [username, setUsername] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socialService.getAll({ size: "100" }).then((res: any) => {
            if (res?.status === HTTP_STATUS.OK) {
                const all: SocialLinkResponse[] = res.data.data?.content ?? res.data.data ?? [];
                const gh = all.find((l) => l.platform === "GITHUB");
                if (gh) {
                    setGithubLink(gh);
                    setUsername(extractUsername(gh.url));
                }
            }
        }).finally(() => setLoading(false));
    }, []);

    const isConfigured = !!githubLink;
    const isDirty = username !== (githubLink ? extractUsername(githubLink.url) : "");

    const handleSave = async () => {
        const trimmed = username.trim();
        if (!trimmed) {
            showSnackbar("error", "GitHub username cannot be empty");
            return;
        }
        const url = `${GITHUB_BASE}${trimmed}`;
        try {
            setSaving(true);
            if (githubLink?.id) {
                await socialService.update(githubLink.id, {
                    platform: "GITHUB",
                    url,
                    order: githubLink.order,
                    status: githubLink.status,
                });
                setGithubLink({ ...githubLink, url });
            } else {
                const res = await socialService.create({
                    platform: "GITHUB",
                    url,
                    order: "99",
                    status: "ACTIVE",
                });
                if (res?.data?.data) setGithubLink(res.data.data);
            }
            showSnackbar("success", "GitHub username saved");
        } catch {
            showSnackbar("error", "Failed to save GitHub username");
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async () => {
        if (!githubLink?.id) return;
        try {
            setSaving(true);
            await socialService.deleteSocialLink(githubLink.id);
            setGithubLink(null);
            setUsername("");
            showSnackbar("success", "GitHub link removed");
        } catch {
            showSnackbar("error", "Failed to remove GitHub link");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "24px", width: "100%" }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                <div
                    className="flex items-center justify-center p-2 rounded-xl"
                    style={{ background: colors.neutral200, color: colors.neutral900 }}
                >
                    <FiGithub size={20} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: colors.neutral900 }}>
                    GitHub
                </h3>
            </div>
            <p className="text-sm mb-6" style={{ color: colors.neutral500 }}>
                Your GitHub profile URL powers the GitHub stats section on your public portfolio.
            </p>

            {/* Status card */}
            <div
                className="flex items-center gap-3 rounded-2xl p-4 mb-6"
                style={{
                    background: isConfigured ? `${colors.primary500}0d` : colors.neutral100,
                    border: `1.5px solid ${isConfigured ? colors.primary300 : colors.neutral200}`,
                }}
            >
                <div
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{
                        width: 36, height: 36,
                        background: isConfigured ? `${colors.primary500}18` : colors.neutral200,
                        color: isConfigured ? colors.primary600 : colors.neutral500,
                    }}
                >
                    {isConfigured ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: colors.neutral900 }}>
                        {isConfigured ? "GitHub connected" : "GitHub not configured"}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: colors.neutral500 }}>
                        {isConfigured
                            ? `github.com/${extractUsername(githubLink!.url)}`
                            : "Add your GitHub username to show stats on your portfolio"}
                    </p>
                </div>
                {isConfigured && (
                    <a
                        href={githubLink!.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium shrink-0"
                        style={{ color: colors.primary500 }}
                    >
                        <FiExternalLink size={12} /> View
                    </a>
                )}
            </div>

            {/* Input */}
            <div className="flex flex-col gap-4">
                <TextField
                    label="GitHub Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                    placeholder="e.g. torvalds"
                    disabled={saving}
                    helperText={username.trim() ? `Profile URL: ${GITHUB_BASE}${username.trim()}` : ""}
                    InputProps={{
                        startAdornment: (
                            <span className="text-sm mr-1" style={{ color: colors.neutral400, whiteSpace: "nowrap" }}>
                                github.com/
                            </span>
                        ),
                    }}
                    fullWidth
                />

                <div className="flex items-center gap-3 justify-end flex-wrap">
                    {isConfigured && (
                        <Button
                            label="Remove"
                            variant="tertiaryContained"
                            size="small"
                            disabled={saving}
                            onClick={handleRemove}
                        />
                    )}
                    <Button
                        label={saving ? "Saving…" : isConfigured ? "Update Username" : "Connect GitHub"}
                        variant="primaryContained"
                        startIcon={<FiGithub size={14} />}
                        disabled={saving || !username.trim() || !isDirty}
                        onClick={handleSave}
                    />
                </div>
            </div>

            {/* Info box */}
            <div
                className="rounded-xl px-4 py-3 mt-6"
                style={{ background: colors.neutral50, border: `1px solid ${colors.neutral200}` }}
            >
                <p className="text-xs leading-relaxed" style={{ color: colors.neutral500 }}>
                    Setting your GitHub username displays public stats — total repositories, stars, followers, and recent activity — in the GitHub section of your public portfolio. Stats are fetched live from the GitHub API on each public page load.
                </p>
            </div>
        </motion.div>
    );
};

export default GitHubTab;
