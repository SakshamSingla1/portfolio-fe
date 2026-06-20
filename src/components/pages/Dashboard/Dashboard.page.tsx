import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDashboardService } from '../../../services/useDashboardService';
import { HTTP_STATUS } from '../../../utils/types';
import DashboardTemplate from '../../templates/Dashboard/Dashboard.template';

const DashboardPage: React.FC = () => {
    const dashboardService = useDashboardService();

    const { data: dashboardData } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await dashboardService.getByProfile();
            if (response?.status === HTTP_STATUS.OK) {
                return response.data.data;
            }
            return null;
        },
        refetchInterval: 30_000,       // refresh view count every 30 s
        refetchIntervalInBackground: false,  // pause when tab is hidden
    });

    return (
        <div>
            <DashboardTemplate dashboardData={dashboardData ?? null} />
        </div>
    );
};

export default DashboardPage;
