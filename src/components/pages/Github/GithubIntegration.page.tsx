import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useGithubIntegrationService, type GithubRepoItem, type GithubIntegration } from "../../../services/useGithubIntegrationService";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";
import {
    TbBrandGithub, TbRefresh, TbUnlink, TbLink, TbStar,
    TbGitFork, TbEye, TbEyeOff, TbCode, TbPin, TbExternalLink,
} from "react-icons/tb";
import { FiUser, FiUsers, FiBook } from "react-icons/fi";

const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f7df1e", Java: "#b07219",
    Python: "#3572A5", Go: "#00ADD8", Rust: "#dea584",
    "C++": "#f34b7d", "C#": "#178600", Ruby: "#701516",
    Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
};

const StatPill: React.FC<{ icon: React.ReactNode; label: string; value: number | string }> = ({ icon, label, value }) => {
    const colors = useColors();
    return (
        <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl"
            style={{ background: colors.neutral100, border: `1px solid ${colors.neutral200}` }}>
            <div className="flex items-center gap-1.5" style={{ color: colors.primary600 }}>
                {icon}
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: colors.neutral500 }}>{label}</span>
            </div>
            <span className="text-xl font-black tabular-nums" style={{ color: colors.neutral900 }}>{value}</span>
        </div>
    );
};

const RepoCard: React.FC<{
    repo: GithubRepoItem;
    onToggleVisible: (id: number, visible: boolean) => void;
    toggling: boolean;
}> = ({ repo, onToggleVisible, toggling }) => {
    const colors = useColors();
    const { isDark } = useTheme();
    const langColor = repo.language ? (LANG_COLORS[repo.language] ?? colors.primary500) : colors.neutral400;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 flex flex-col gap-2.5"
            style={{
                background: isDark ? colors.neutral100 : "#fafbff",
                border: `1.5px solid ${repo.isVisible ? colors.neutral300 : colors.neutral200}`,
                opacity: repo.isVisible ? 1 : 0.6,
                transition: "opacity 0.2s",
            }}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {repo.isPinned && (
                        <TbPin size={12} style={{ color: colors.warning500, flexShrink: 0 }} />
                    )}
                    <span className="font-bold text-sm truncate" style={{ color: colors.neutral800 }}>
                        {repo.name}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    {repo.url && (
                        <a href={repo.url} target="_blank" rel="noopener noreferrer"
                            className="p-1 rounded-md hover:bg-neutral-200/50 transition-colors"
                            style={{ color: colors.neutral500 }}>
                            <TbExternalLink size={13} />
                        </a>
                    )}
                    <button
                        onClick={() => onToggleVisible(repo.id, !repo.isVisible)}
                        disabled={toggling}
                        className="p-1 rounded-md transition-colors"
                        style={{
                            color: repo.isVisible ? colors.primary600 : colors.neutral400,
                            background: repo.isVisible ? `${colors.primary500}12` : "transparent",
                        }}
                        title={repo.isVisible ? "Hide from portfolio" : "Show in portfolio"}
                    >
                        {repo.isVisible ? <TbEye size={14} /> : <TbEyeOff size={14} />}
                    </button>
                </div>
            </div>

            {repo.description && (
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: colors.neutral500 }}>
                    {repo.description}
                </p>
            )}

            <div className="flex items-center gap-3 flex-wrap">
                {repo.language && (
                    <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: langColor }}>
                        <TbCode size={11} />
                        {repo.language}
                    </span>
                )}
                <span className="flex items-center gap-1 text-[11px]" style={{ color: colors.neutral500 }}>
                    <TbStar size={11} /> {repo.stars}
                </span>
                <span className="flex items-center gap-1 text-[11px]" style={{ color: colors.neutral500 }}>
                    <TbGitFork size={11} /> {repo.forks}
                </span>
            </div>
        </motion.div>
    );
};

const GithubIntegrationPage: React.FC = () => {
    const service = useGithubIntegrationService();
    const queryClient = useQueryClient();
    const colors = useColors();
    const { isDark } = useTheme();
    const { showSnackbar } = useSnackbar();
    const [searchParams, setSearchParams] = useSearchParams();
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const cardShadow = isDark
        ? "0 2px 8px rgba(0,0,0,0.4)"
        : "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)";

    // Show success snackbar when redirected back from GitHub OAuth
    useEffect(() => {
        if (searchParams.get("connected") === "true") {
            showSnackbar("success", "GitHub connected successfully!");
            setSearchParams({}, { replace: true });
            queryClient.invalidateQueries({ queryKey: ["github-integration"] });
        }
    }, [searchParams, setSearchParams, queryClient, showSnackbar]);

    const { data: integration, isLoading } = useQuery({
        queryKey: ["github-integration"],
        queryFn: async (): Promise<GithubIntegration | null> => {
            const res = await service.getIntegration();
            return res?.status === HTTP_STATUS.OK ? (res.data.data as GithubIntegration) : null;
        },
    });

    const connectMutation = useMutation({
        mutationFn: async () => {
            const res = await service.getOAuthUrl();
            if (res?.status === HTTP_STATUS.OK) {
                window.location.href = res.data.data.url;
            }
        },
        onError: () => showSnackbar("error", "Failed to start GitHub connection"),
    });

    const syncMutation = useMutation({
        mutationFn: () => service.sync(),
        onSuccess: () => {
            showSnackbar("success", "Repos synced!");
            queryClient.invalidateQueries({ queryKey: ["github-integration"] });
        },
        onError: () => showSnackbar("error", "Sync failed"),
    });

    const disconnectMutation = useMutation({
        mutationFn: () => service.disconnect(),
        onSuccess: () => {
            showSnackbar("success", "GitHub disconnected");
            queryClient.invalidateQueries({ queryKey: ["github-integration"] });
        },
        onError: () => showSnackbar("error", "Failed to disconnect GitHub"),
    });

    const handleToggleVisible = async (id: number, visible: boolean) => {
        setTogglingId(id);
        try {
            await service.updateRepo(id, visible);
            queryClient.invalidateQueries({ queryKey: ["github-integration"] });
        } catch {
            showSnackbar("error", "Failed to update repo visibility");
        } finally {
            setTogglingId(null);
        }
    };

    const panelStyle: React.CSSProperties = {
        background: colors.neutral0,
        border: `1.5px solid ${colors.neutral300}`,
        borderRadius: 16,
        boxShadow: cardShadow,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "16px 16px 32px" }}
        >
            <div className="rounded-2xl overflow-hidden mb-5" style={panelStyle}>
                <div style={{ height: 3, background: `linear-gradient(90deg, ${colors.primary600} 0%, ${colors.primary400}28 100%)` }} />
                <div className="px-5 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-xl"
                            style={{ width: 38, height: 38, background: `${colors.primary500}12`, color: colors.primary600 }}>
                            <TbBrandGithub size={19} />
                        </div>
                        <div>
                            <h1 className="font-black tracking-tight" style={{ fontSize: 20, color: colors.neutral900, letterSpacing: "-0.025em", margin: 0 }}>
                                GitHub Integration
                            </h1>
                            <p className="text-xs" style={{ color: colors.neutral500, margin: 0 }}>
                                Auto-sync pinned repos and contribution stats
                            </p>
                        </div>
                    </div>

                    {!isLoading && integration && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => syncMutation.mutate()}
                                disabled={syncMutation.isPending}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                style={{ background: `${colors.primary500}12`, color: colors.primary700, border: `1px solid ${colors.primary500}25` }}
                            >
                                <TbRefresh size={13} className={syncMutation.isPending ? "animate-spin" : ""} />
                                {syncMutation.isPending ? "Syncing…" : "Sync now"}
                            </button>
                            <button
                                onClick={() => disconnectMutation.mutate()}
                                disabled={disconnectMutation.isPending}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                style={{ background: `${colors.error500}10`, color: colors.error600, border: `1px solid ${colors.error500}20` }}
                            >
                                <TbUnlink size={13} />
                                Disconnect
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 rounded-full animate-spin"
                        style={{ border: `3px solid ${colors.primary500}`, borderTopColor: "transparent" }} />
                </div>
            ) : !integration ? (
                /* Not connected */
                <div className="rounded-2xl p-10 flex flex-col items-center gap-5 text-center" style={panelStyle}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: `${colors.neutral200}`, color: colors.neutral500 }}>
                        <TbBrandGithub size={32} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg" style={{ color: colors.neutral800, margin: "0 0 6px" }}>
                            Connect your GitHub
                        </h2>
                        <p className="text-sm" style={{ color: colors.neutral500 }}>
                            Sync pinned repos and contribution stats automatically. Stats update every 6 hours.
                        </p>
                    </div>
                    <button
                        onClick={() => connectMutation.mutate()}
                        disabled={connectMutation.isPending}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                        style={{ background: colors.neutral900, color: "#fff" }}
                    >
                        <TbLink size={15} />
                        {connectMutation.isPending ? "Redirecting…" : "Connect GitHub"}
                    </button>
                </div>
            ) : (
                /* Connected */
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                        <StatPill icon={<FiBook size={13} />} label="Repos" value={integration.cachedPublicRepos} />
                        <StatPill icon={<TbStar size={13} />} label="Stars" value={integration.cachedTotalStars} />
                        <StatPill icon={<FiUsers size={13} />} label="Followers" value={integration.cachedFollowers} />
                        <StatPill icon={<FiUser size={13} />} label="Username" value={`@${integration.githubUsername}`} />
                    </div>

                    {integration.lastSyncedAt && (
                        <p className="text-[11px] mb-4" style={{ color: colors.neutral400 }}>
                            Last synced: {new Date(integration.lastSyncedAt).toLocaleString()}
                        </p>
                    )}

                    <div className="rounded-2xl overflow-hidden" style={panelStyle}>
                        <div className="px-5 py-3.5" style={{ borderBottom: `1px solid ${colors.neutral200}` }}>
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.neutral500 }}>
                                Repositories · {integration.repos?.length ?? 0}
                            </span>
                            <p className="text-[11px] mt-0.5" style={{ color: colors.neutral400, margin: 0 }}>
                                Toggle the eye icon to show or hide a repo in your public portfolio.
                            </p>
                        </div>
                        <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <AnimatePresence>
                                {(integration.repos ?? []).map((repo: GithubRepoItem) => (
                                    <RepoCard
                                        key={repo.id}
                                        repo={repo}
                                        onToggleVisible={handleToggleVisible}
                                        toggling={togglingId === repo.id}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default GithubIntegrationPage;
