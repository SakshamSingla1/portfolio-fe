import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiCreditCard, FiCheck } from "react-icons/fi";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useColors, HTTP_STATUS, Status } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { formatCurrency } from "../../../utils/helper";
import Button from "../../atoms/Button/Button";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import AdvancedCheckbox from "../../atoms/AdvancedCheckbox/AdvancedCheckbox";
import ConfirmDialog from "../../molecules/ConfirmDialog/ConfirmDialog";
import { useSubscriptionPlanService, type SubscriptionPlanResponseDTO } from "../../../services/useSubscriptionPlanService";
import { BillingCycle, useProfileSubscriptionService, type ProfileSubscriptionResponseDTO } from "../../../services/useProfileSubscriptionService";

const PlanBillingTab: React.FC = () => {
    const isMobile = useIsMobile();
    const colors = useColors();
    const { showSnackbar } = useSnackbar();
    const subscriptionPlanService = useSubscriptionPlanService();
    const profileSubscriptionService = useProfileSubscriptionService();

    const [plans, setPlans] = useState<SubscriptionPlanResponseDTO[]>([]);
    const [subscription, setSubscription] = useState<ProfileSubscriptionResponseDTO | null>(null);
    const [billingCycle, setBillingCycle] = useState<string>(BillingCycle.MONTHLY);
    const [autoRenew, setAutoRenew] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<SubscriptionPlanResponseDTO | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [plansRes, subRes] = await Promise.all([
                subscriptionPlanService.getAllPlans({ size: 100, status: Status.ACTIVE, sortBy: "sortOrder", sortDir: "ASC" }),
                profileSubscriptionService.getMySubscription(),
            ]);
            setPlans(plansRes?.data?.data?.content ?? []);
            const current: ProfileSubscriptionResponseDTO | null = subRes?.status === HTTP_STATUS.OK ? subRes?.data?.data : null;
            setSubscription(current);
            setBillingCycle(current?.billingCycle || BillingCycle.MONTHLY);
            setAutoRenew(current?.autoRenew ?? false);
        } catch {
            showSnackbar("error", "Failed to load subscription plans");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentPlanId = subscription?.planId;

    const priceFor = (plan: SubscriptionPlanResponseDTO) =>
        billingCycle === BillingCycle.YEARLY ? plan.priceYearly : plan.priceMonthly;

    const applyPlanChange = async () => {
        if (!pendingPlan?.id) return;
        setIsSaving(true);
        try {
            const response = await profileSubscriptionService.changeMyPlan({
                planId: pendingPlan.id,
                billingCycle,
                autoRenew,
            });
            if (response?.status === HTTP_STATUS.OK) {
                setSubscription(response.data?.data ?? null);
                showSnackbar("success", `Switched to the ${pendingPlan.name} plan`);
            } else {
                showSnackbar("error", "Failed to update subscription");
            }
        } catch {
            showSnackbar("error", "Failed to update subscription");
        } finally {
            setIsSaving(false);
            setPendingPlan(null);
        }
    };

    const sortedPlans = useMemo(
        () => [...plans].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        [plans]
    );

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ padding: isMobile ? "16px 12px" : "24px", width: "100%" }}
            >
                <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        className="flex items-center justify-center p-2 rounded-xl"
                        style={{ backgroundColor: colors.primary100, color: colors.primary600 }}
                    >
                        <FiCreditCard size={20} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: "22px", fontWeight: 700, color: colors.neutral900 }}>Plan & Billing</h2>
                        <p style={{ fontSize: "14px", color: colors.neutral500 }}>
                            View your current plan and switch to a different tier at any time.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <CustomRadioGroup
                        name="billingCycle"
                        options={Object.values(BillingCycle).map((c) => ({
                            value: c,
                            label: c.charAt(0) + c.slice(1).toLowerCase(),
                        }))}
                        value={billingCycle}
                        onChange={(e) => setBillingCycle(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-64 rounded-xl animate-pulse"
                                style={{ background: colors.neutral100, border: `1.5px solid ${colors.neutral200}` }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sortedPlans.map((plan) => {
                            const isCurrent = plan.id === currentPlanId;
                            return (
                                <div
                                    key={plan.id}
                                    className="rounded-xl p-6 flex flex-col shadow-sm"
                                    style={{
                                        border: isCurrent ? `2px solid ${colors.primary500}` : `1.5px solid ${colors.neutral200}`,
                                        background: colors.neutral0,
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold" style={{ color: colors.neutral900 }}>
                                            {plan.name}
                                        </h3>
                                        {isCurrent && (
                                            <span
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                                                style={{ background: `${colors.primary500}15`, color: colors.primary600 }}
                                            >
                                                <FiCheck size={11} /> Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm mb-4" style={{ color: colors.neutral500 }}>
                                        {plan.description}
                                    </p>
                                    <div className="mb-6">
                                        <span className="text-2xl font-bold" style={{ color: colors.neutral900 }}>
                                            {formatCurrency(priceFor(plan), plan.currency)}
                                        </span>
                                        <span className="text-sm" style={{ color: colors.neutral500 }}>
                                            {" "}/ {billingCycle === BillingCycle.YEARLY ? "year" : "month"}
                                        </span>
                                    </div>
                                    <div className="mt-auto">
                                        <Button
                                            label={isCurrent ? "Current Plan" : `Switch to ${plan.name}`}
                                            variant={isCurrent ? "tertiaryContained" : "primaryContained"}
                                            disabled={isCurrent || isSaving}
                                            onClick={() => setPendingPlan(plan)}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6">
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <AdvancedCheckbox
                            name="autoRenew"
                            checked={autoRenew}
                            onChange={() => setAutoRenew(!autoRenew)}
                            size="small"
                            variant="primary"
                        />
                        <span className="text-sm font-medium" style={{ color: colors.neutral900 }}>
                            Auto-renew my plan
                        </span>
                    </label>
                    {subscription?.endDate && (
                        <p className="text-xs mt-2" style={{ color: colors.neutral500 }}>
                            Current cycle renews/expires on {new Date(subscription.endDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </motion.div>

            <ConfirmDialog
                open={!!pendingPlan}
                title="Confirm plan change"
                message={
                    <>
                        Switch to the <strong>{pendingPlan?.name}</strong> plan, billed{" "}
                        <strong>{billingCycle.toLowerCase()}</strong> at{" "}
                        <strong>{pendingPlan ? formatCurrency(priceFor(pendingPlan), pendingPlan.currency) : ""}</strong>.
                    </>
                }
                confirmLabel="Confirm"
                loading={isSaving}
                onConfirm={applyPlanChange}
                onClose={() => setPendingPlan(null)}
            />
        </>
    );
};

export default PlanBillingTab;
