import React, { useEffect, useState } from "react";
import { type SubscriptionPlanResponseDTO, useSubscriptionPlanService } from "../../../services/useSubscriptionPlanService";
import SubscriptionPlanFormTemplate from "../../templates/SubscriptionPlans/SubscriptionPlanForm.template";
import { useParams } from "react-router-dom";
import { MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";

const ViewSubscriptionPlanPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { showSnackbar } = useSnackbar();

    const subscriptionPlanService = useSubscriptionPlanService();

    const [planDetails, setPlanDetails] = useState<SubscriptionPlanResponseDTO | null>(null);

    useEffect(() => {
        const loadPlanDetails = async (planId: number | null) => {
            try {
                const response = await subscriptionPlanService.getPlanById(planId);
                if (response.status === HTTP_STATUS.OK) {
                    setPlanDetails(response.data.data);
                }
            } catch {
                showSnackbar("error", "Failed to load subscription plan details");
            }
        };
        if (id) {
            loadPlanDetails(Number(id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <SubscriptionPlanFormTemplate
            mode={MODE.VIEW}
            planDetails={planDetails}
            onSubmit={() => { }}
        />
    );
};

export default ViewSubscriptionPlanPage;
