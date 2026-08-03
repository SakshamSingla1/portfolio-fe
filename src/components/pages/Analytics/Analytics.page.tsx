import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useDashboardService } from "../../../services/useDashboardService";
import { HTTP_STATUS } from "../../../utils/types";
import AnalyticsTemplate from "../../templates/Analytics/Analytics.template";

const AnalyticsPage: React.FC = () => {
    const dashboardService = useDashboardService();

    // Same queryKey/queryFn as Dashboard.page.tsx so both pages share one
    // cached request instead of independently polling /dashboard every 30s.
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard"],
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

    return <AnalyticsTemplate dashboardData={data ?? null} isLoading={isLoading} />;
};

export default AnalyticsPage;
