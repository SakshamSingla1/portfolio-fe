import React, { useEffect, useState } from "react";
import Button from "../../atoms/Button/Button";
import TextField from "../../atoms/TextField/TextField";
import CustomRadioGroup, { type RadioOption } from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import ConfirmDialog from "../../molecules/ConfirmDialog/ConfirmDialog";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { Status, useColors } from "../../../utils/types";
import { useProfileService, type UserResponse } from "../../../services/useProfileService";
import { useRoleService } from "../../../services/useRoleService";
import { makeRoute } from "../../../utils/helper";
import { useSnackbar } from "../../../hooks/useSnackBar";
import * as Yup from "yup";
import FormShell from '../Shared/FormShell.template';

const validationSchema = Yup.object().shape({
    // Must match Formik's actual field names below ("roleId"/"status") — a
    // schema keyed on "role" (which formik.values never has) always failed
    // validation silently, permanently blocking the Update button.
    roleId: Yup.string()
        .required('Role is required'),
    status: Yup.string()
        .required('Status is required'),
});

interface UserFormTemplateProps {
    mode: string;
    user?: UserResponse | null;
    isLoading?: boolean;
}

const UserFormTemplate: React.FC<UserFormTemplateProps> = ({
    mode,
    user,
    isLoading = false,
}) => {
    const navigate = useNavigate();
    const profileService = useProfileService();
    const roleService = useRoleService();
    const { showSnackbar } = useSnackbar();
    const colors = useColors();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roleOptions, setRoleOptions] = useState<RadioOption[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const onClose = () => navigate(makeRoute(ADMIN_ROUTES.USER, {}));

    useEffect(() => {
        // Role radio options must be real {id, name} pairs from the backend — the
        // roleId this form saves is an actual role row id, not a fixed enum string.
        roleService.getAllRolesByCriteria({ size: 100 }).then((res: any) => {
            const roles = res?.data?.data?.content ?? [];
            setRoleOptions(roles.map((r: any) => ({ value: String(r.id), label: r.name })));
        }).catch(() => setRoleOptions([]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fullName: user?.fullName || "",
            userName: user?.userName || "",
            email: user?.email || "",
            emailVerified: user?.emailVerified || false,
            phoneVerified: user?.phoneVerified || false,
            roleId: user?.roleId || "",
            roleName: user?.roleName || "",
            status: user?.status || Status.ACTIVE,
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            if (!user?.id) return;

            const hasChanges = values.status !== user.status || String(values.roleId) !== String(user.roleId ?? "");
            if (!hasChanges) {
                showSnackbar('info', 'No changes detected');
                onClose();
                return;
            }

            setConfirmOpen(true);
            setSubmitting(false);
        },
    });

    const applyChanges = async () => {
        if (!user?.id) return;
        const values = formik.values;

        setIsSubmitting(true);
        try {
            if (values.status !== user.status) {
                await profileService.updateUserStatus(user.id, { status: values.status });
                showSnackbar('success', 'User status updated successfully');
            }

            if (String(values.roleId) !== String(user.roleId ?? "")) {
                await profileService.updateUserRole(user.id, { role: String(values.roleId) });
                showSnackbar('success', 'User role updated successfully');
            }

            setConfirmOpen(false);
            onClose();
        } catch {
            showSnackbar('error', 'Failed to update user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const cardStyle: React.CSSProperties = { background: colors.neutral0, border: `1.5px solid ${colors.neutral300}` };
    const sectionTitleStyle: React.CSSProperties = { color: colors.neutral800 };

    const roleChanged = !!user && String(formik.values.roleId) !== String(user.roleId ?? "");
    const statusChanged = !!user && formik.values.status !== user.status;
    const newRoleLabel = roleOptions.find((r) => r.value === String(formik.values.roleId))?.label;

    if (isLoading) {
        return (
            <FormShell
                title={mode === MODE.EDIT ? "Edit User" : "User Details"}
                subtitle="Loading user details…"
                breadcrumb="Users"
                onBack={onClose}
            >
                <div className="px-3 py-4 sm:p-6 space-y-6 sm:space-y-8">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="px-3 py-4 sm:p-6 rounded-xl shadow-sm animate-pulse" style={cardStyle}>
                            <div className="h-4 w-40 rounded mb-4" style={{ background: colors.neutral200 }} />
                            <div className="h-10 w-full rounded" style={{ background: colors.neutral100 }} />
                        </div>
                    ))}
                </div>
            </FormShell>
        );
    }

    return (
        <>
        <FormShell
            title={mode === MODE.EDIT ? "Edit User" : "User Details"}
            subtitle={mode === MODE.EDIT ? "Update user role and account status" : "View user details and current permissions"}
            breadcrumb="Users"
            onBack={onClose}
        >
            <div className="px-3 py-4 sm:p-6 space-y-6 sm:space-y-8">
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                        User Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField label="Full Name" {...formik.getFieldProps("fullName")} disabled={true} fullWidth />
                        <TextField label="Username" {...formik.getFieldProps("userName")} disabled={true} fullWidth />
                        <TextField label="Email Address" {...formik.getFieldProps("email")} disabled={true} fullWidth />
                    </div>
                </div>
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.success500 }} />
                        Role & Permissions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <CustomRadioGroup
                                name="roleId"
                                options={roleOptions}
                                value={formik.values.roleId ? String(formik.values.roleId) : ""}
                                onChange={(e) => formik.setFieldValue("roleId", e.target.value)}
                                disabled={mode === MODE.VIEW}
                            />
                            {formik.touched.roleId && formik.errors.roleId && (
                                <div className="text-xs mt-1" style={{ color: colors.error500 }}>
                                    {formik.errors.roleId as string}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.warning500 }} />
                        Account Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <CustomRadioGroup
                                name="status"
                                options={Object.values(Status).map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }))}
                                value={formik.values.status}
                                onChange={(e) => formik.setFieldValue("status", e.target.value)}
                                disabled={mode === MODE.VIEW}
                            />
                            {formik.touched.status && formik.errors.status && (
                                <div className="text-xs mt-1" style={{ color: colors.error500 }}>
                                    {formik.errors.status as string}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    <Button label="Cancel" variant="tertiaryContained" onClick={onClose} disabled={isSubmitting} />
                    {mode !== MODE.VIEW && (
                        <Button
                            label="Update"
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting || isSubmitting}
                        />
                    )}
                </div>
            </div>
        </FormShell>
        <ConfirmDialog
            open={confirmOpen}
            title="Confirm account changes"
            message={
                <>
                    {statusChanged && <div>Change status to <strong>{formik.values.status}</strong>.</div>}
                    {roleChanged && <div>Change role to <strong>{newRoleLabel ?? formik.values.roleId}</strong>.</div>}
                    <div className="mt-2">This takes effect immediately for {user?.fullName}.</div>
                </>
            }
            confirmLabel="Apply changes"
            danger={statusChanged && formik.values.status !== Status.ACTIVE}
            loading={isSubmitting}
            onConfirm={applyChanges}
            onClose={() => setConfirmOpen(false)}
        />
        </>
    );
};

export default UserFormTemplate;
