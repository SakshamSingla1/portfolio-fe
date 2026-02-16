import React, { useEffect, useState } from 'react';
import { type IDashboardSummary, useDashboardService } from '../../../services/useDashboardService';
import { HTTP_STATUS } from '../../../utils/types';
import DashboardTemplate from '../../templates/Dashboard/Dashboard.template';

const DashboardPage: React.FC = () => {
    const dashboardService = useDashboardService();

const [dashboardData, setDashboardData] = useState<IDashboardSummary | null>(null);
    const loadDashboardData = async () => {
        try {
            const response = await dashboardService.getByProfile();
            if (response?.status === HTTP_STATUS.OK) {
                setDashboardData(response?.data?.data);
            }
        } catch (err) {
            console.error("Dashboard error:", err);
        }
    };

    useEffect(() => {
        loadDashboardData();
    },[])

    return (
        <div>
            <DashboardTemplate dashboardData={dashboardData} />
        </div>
    )
}

export default DashboardPage;