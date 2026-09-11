import React, { useEffect, useState } from "react";
import { type SubscriptionPlanResponseDTO, type SubscriptionPlanRequestDTO, useSubscriptionPlanService } from "../../../services/useSubscriptionPlanService";
import SubscriptionPlanFormTemplate from "../../templates/SubscriptionPlans/SubscriptionPlanForm.template";
import { useNavigate, useParams } from "react-router-dom";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";

const EditSubscriptionPlanPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const subscriptionPlanService = useSubscriptionPlanService();
    const { showSnackbar } = useSnackbar();

    const [planDetails, setPlanDetails] = useState<SubscriptionPlanResponseDTO | null>(null);

    const handleSubmit = async (values: SubscriptionPlanRequestDTO, navLinkIds: number[]) => {
        try {
            const planId = id ? Number(id) : null;
            const response = await subscriptionPlanService.updatePlan(planId, values);
            if (response.status === HTTP_STATUS.OK) {
                await subscriptionPlanService.updatePlanNavLinks(planId, navLinkIds);
                navigate(makeRoute(ADMIN_ROUTES.SUBSCRIPTION_PLAN, {}));
            }
        } catch {
            showSnackbar("error", "Failed to update subscription plan");
        }
    };

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
            mode={MODE.EDIT}
            onSubmit={handleSubmit}
            planDetails={planDetails}
        />
    );
};

export default EditSubscriptionPlanPage;
