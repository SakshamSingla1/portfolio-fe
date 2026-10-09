import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useDashboardService, type IAnalyticsRangeKey } from "../../../services/useDashboardService";
import { HTTP_STATUS } from "../../../utils/types";
import AnalyticsTemplate from "../../templates/Analytics/Analytics.template";

const VALID_RANGE_KEYS: IAnalyticsRangeKey[] = ["7d", "30d", "90d", "custom"];

const AnalyticsPage: React.FC = () => {
    const dashboardService = useDashboardService();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("overview");

    const rawRange = searchParams.get("range");
    const range: IAnalyticsRangeKey = VALID_RANGE_KEYS.includes(rawRange as IAnalyticsRangeKey)
        ? (rawRange as IAnalyticsRangeKey)
        : "30d";
    const startDate = searchParams.get("start") ?? undefined;
    const endDate = searchParams.get("end") ?? undefined;

    const handleRangeChange = (next: { range: IAnalyticsRangeKey; startDate?: string; endDate?: string }) => {
        const params: Record<string, string> = { range: next.range };
        if (next.range === "custom") {
            if (next.startDate) params.start = next.startDate;
            if (next.endDate) params.end = next.endDate;
        }
        setSearchParams(params);
    };

    // Own range-aware query, separate from Dashboard.page.tsx's /dashboard fetch —
    // this page now needs range/comparison data that endpoint doesn't provide.
    const { data, isLoading } = useQuery({
        queryKey: ["analytics-view-stats", range, startDate, endDate],
        queryFn: async () => {
            const response = await dashboardService.getViewStats({ range, startDate, endDate });
            if (response?.status === HTTP_STATUS.OK) {
                return response.data.data;
            }
            return null;
        },
        refetchInterval: 30_000,
        refetchIntervalInBackground: false,
    });

    return (
        <AnalyticsTemplate
            overview={data ?? null}
            isLoading={isLoading}
            rangeValue={{ range, startDate, endDate }}
            onRangeChange={handleRangeChange}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        />
    );
};

export default AnalyticsPage;
