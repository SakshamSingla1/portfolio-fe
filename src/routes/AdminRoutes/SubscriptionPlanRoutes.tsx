import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingSubscriptionPlanPage = lazy(() => import("../../components/pages/SubscriptionPlans/ListingSubscriptionPlan.page"));
const AddSubscriptionPlanPage = lazy(() => import("../../components/pages/SubscriptionPlans/AddSubscriptionPlan.page"));
const EditSubscriptionPlanPage = lazy(() => import("../../components/pages/SubscriptionPlans/EditSubscriptionPlan.page"));
const ViewSubscriptionPlanPage = lazy(() => import("../../components/pages/SubscriptionPlans/ViewSubscriptionPlan.page"));

const SubscriptionPlanRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingSubscriptionPlanPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddSubscriptionPlanPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditSubscriptionPlanPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewSubscriptionPlanPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default SubscriptionPlanRoutes;
