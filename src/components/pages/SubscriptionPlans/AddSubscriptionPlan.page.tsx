import React from "react";
import { useSubscriptionPlanService, type SubscriptionPlanRequestDTO } from "../../../services/useSubscriptionPlanService";
import SubscriptionPlanFormTemplate from "../../templates/SubscriptionPlans/SubscriptionPlanForm.template";
import { useNavigate } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";

const AddSubscriptionPlanPage: React.FC = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const subscriptionPlanService = useSubscriptionPlanService();

    const handleCreatePlan = async (values: SubscriptionPlanRequestDTO, navLinkIds: number[]) => {
        try {
            const response = await subscriptionPlanService.createPlan(values);
            if (response.status === HTTP_STATUS.OK) {
                const createdId = response.data?.data?.id;
                if (createdId) {
                    await subscriptionPlanService.updatePlanNavLinks(createdId, navLinkIds);
                }
                navigate(makeRoute(ADMIN_ROUTES.SUBSCRIPTION_PLAN, {}));
            }
        } catch {
            showSnackbar("error", "Failed to create subscription plan");
        }
    };

    return (
        <div>
            <SubscriptionPlanFormTemplate
                mode={MODE.ADD}
                onSubmit={handleCreatePlan}
            />
        </div>
    );
};

export default AddSubscriptionPlanPage;
