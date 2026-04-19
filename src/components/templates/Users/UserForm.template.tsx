import { useState } from "react";
import Button from "../../atoms/Button/Button";
import TextField from "../../atoms/TextField/TextField";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { Status, RoleOptions } from "../../../utils/types";
import { useProfileService, type UserResponse } from "../../../services/useProfileService";
import { makeRoute } from "../../../utils/helper";
import { useSnackbar } from "../../../hooks/useSnackBar";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    role: Yup.string()
        .required('Role is required'),
    status: Yup.string()
        .required('Status is required'),
});

interface UserFormTemplateProps {
    mode: string;
    user?: UserResponse | null;
}

const UserFormTemplate: React.FC<UserFormTemplateProps> = ({
    mode,
    user,
}) => {
    const navigate = useNavigate();
    const profileService = useProfileService();
    const { showSnackbar } = useSnackbar();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onClose = () => navigate(makeRoute(ADMIN_ROUTES.USER, {}));

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
            
            setIsSubmitting(true);
            setSubmitting(true);
            
            try {
                const hasChanges = values.status !== user.status || values.roleId !== user.roleId;
                
                if (!hasChanges) {
                    showSnackbar('info', 'No changes detected');
                    onClose();
                    return;
                }

                if (values.status !== user.status) {
                    await profileService.updateUserStatus(user.id, { status: values.status });
                    showSnackbar('success', 'User status updated successfully');
                }
                
                if (values.roleId !== user.roleId) {
                    await profileService.updateUserRole(user.id, { roleId: values.roleId });
                    showSnackbar('success', 'User role updated successfully');
                }
                
                onClose();
            } catch (error) {
                console.error("Update failed:", error);
                showSnackbar('error', 'Failed to update user. Please try again.');
            } finally {
                setIsSubmitting(false);
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="mb-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.EDIT ? "Edit User" : "User Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.EDIT ? "Update user information and permissions" : "View user details and permissions"}
                </p>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        User Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Full Name"
                            {...formik.getFieldProps("fullName")}
                            disabled={true}
                            fullWidth
                        />
                        <TextField
                            label="Username"
                            {...formik.getFieldProps("userName")}
                            disabled={true}
                            fullWidth
                        />
                        <TextField
                            label="Email Address"
                            {...formik.getFieldProps("email")}
                            disabled={true}
                            fullWidth
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Role & Permissions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <CustomRadioGroup
                                name="roleId"
                                options={RoleOptions}
                                value={formik.values.roleId}
                                onChange={(e) =>
                                    formik.setFieldValue("roleId", e.target.value)
                                }
                                disabled={mode === MODE.VIEW}
                            />
                            {formik.touched.roleId && formik.errors.roleId && (
                                <div className="text-red-500 text-xs mt-1">
                                    {formik.errors.roleId as string}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        Account Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <CustomRadioGroup
                                name="status"
                                options={Object.values(Status).map((s) => ({
                                    value: s,
                                    label: s.charAt(0) + s.slice(1).toLowerCase(),
                                }))}
                                value={formik.values.status}
                                onChange={(e) =>
                                    formik.setFieldValue("status", e.target.value)
                                }
                                disabled={mode === MODE.VIEW}
                            />
                            {formik.touched.status && formik.errors.status && (
                                <div className="text-red-500 text-xs mt-1">
                                    {formik.errors.status as string}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between gap-3">
                    <Button 
                        label="Cancel" 
                        variant="tertiaryContained" 
                        onClick={onClose}
                        disabled={isSubmitting}
                    />
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
        </div>
    );
};

export default UserFormTemplate;