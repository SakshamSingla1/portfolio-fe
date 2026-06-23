import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useDashboardService } from "../../../services/useDashboardService";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { motion } from "framer-motion";
import { FiBarChart2 } from "react-icons/fi";
import { useTheme } from "../../../contexts/ThemeContext";
import ViewAnalyticsTemplate from "../../templates/Dashboard/ViewAnalytics.template";

const AnalyticsPage: React.FC = () => {
    const dashboardService = useDashboardService();
    const colors = useColors();
    const { isDark } = useTheme();

    const { data } = useQuery({
        queryKey: ["analytics"],
        queryFn: async () => {
            const response = await dashboardService.getByProfile();
            if (response?.status === HTTP_STATUS.OK) {
                return response.data.data;
            }
            return null;
        },
        refetchInterval: 30_000,
        refetchIntervalInBackground: false,
    });

    const cardShadow = isDark
        ? "0 2px 8px rgba(0,0,0,0.4)"
        : "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)";

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            style={{ padding: "16px 16px 24px" }}
        >
            <div
                className="rounded-2xl overflow-hidden mb-4"
                style={{
                    background: colors.neutral0,
                    border: `1.5px solid ${colors.neutral300}`,
                    boxShadow: cardShadow,
                }}
            >
                <div style={{ height: 3, background: `linear-gradient(90deg, ${colors.primary600} 0%, ${colors.primary400}28 100%)` }} />
                <div className="px-5 py-4 flex items-center gap-3">
                    <div
                        className="flex items-center justify-center rounded-xl"
                        style={{ width: 38, height: 38, background: `${colors.primary500}12`, color: colors.primary600 }}
                    >
                        <FiBarChart2 size={17} />
                    </div>
                    <div>
                        <h1
                            className="font-black tracking-tight"
                            style={{ fontSize: 20, color: colors.neutral900, letterSpacing: "-0.025em", margin: 0 }}
                        >
                            Analytics
                        </h1>
                        <p className="text-xs mt-0.5" style={{ color: colors.neutral400 }}>
                            Portfolio views, visitor trends, and device breakdown
                        </p>
                    </div>
                </div>
            </div>

            <ViewAnalyticsTemplate viewStats={data?.viewStats ?? null} />
        </motion.div>
    );
};

export default AnalyticsPage;
