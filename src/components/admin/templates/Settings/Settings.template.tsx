import React, { useState } from "react";
import { useSnackbar } from "../../../../contexts/SnackbarContext";
import { useAuthenticatedUser } from "../../../../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Lock, Email, ErrorOutline } from "@mui/icons-material";
import Button from "../../../../components/atoms/Button/Button";
import TextField from "../../../../components/atoms/TextField/TextField";
import { AuthDeleteAccountRequest, useAuthService } from "../../../../services/useAuthService";
import OtpFloatingPopup from "../../../atoms/OtpTaker/OtpInput";
import { HTTP_STATUS } from "../../../../utils/constant";
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

interface SettingsTemplateProps {
  user: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  handleChangePasswordSubmit: (values: { oldPassword: string; newPassword: string }) => void;
  handleEmailOtpSubmit: (otp: string, newEmail: string) => void;
  handleDeleteAccountSubmit: (values: AuthDeleteAccountRequest) => void;
}

interface TabType {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  content: React.ReactNode;
}

const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  user,
  handleChangePasswordSubmit,
  handleEmailOtpSubmit,
  handleDeleteAccountSubmit,
}) => {
  const { showSnackbar } = useSnackbar();
  const { setAuthenticatedUser } = useAuthenticatedUser();
  const navigate = useNavigate();
  const authService = useAuthService();

  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailOtpOpen, setEmailOtpOpen] = useState(false);
  const [deleteOtpOpen, setDeleteOtpOpen] = useState(false);

  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Formik forms
  const passwordForm = useFormik({
    initialValues: { oldPassword: "", newPassword: "" },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string().required("New password is required"),
    }),
    onSubmit: (values) => {
      try {
        handleChangePasswordSubmit(values);
        setFormStatus({ type: "success", message: "Password updated successfully" });
        passwordForm.resetForm();
      } catch (error: any) {
        setFormStatus({ type: "error", message: error.message || "Error changing password" });
      }
    },
  });

  const emailForm = useFormik({
    initialValues: { email: "", otp: "" },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required").email("Invalid email format"),
      otp: Yup.string().required("OTP is required")
    }),
    onSubmit: (values) => {
      try {
        handleEmailOtpSubmit(values.otp, values.email);
        setFormStatus({ type: "success", message: "Email updated successfully" });
        emailForm.resetForm();
      } catch (error: any) {
        setFormStatus({ type: "error", message: error.message || "Error changing email" });
      }
    },
  });
  
  const deleteForm = useFormik({
    initialValues: { password: "", otp: "" },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is required"),
      otp: Yup.string().required("OTP is required"),
    }),
    onSubmit: (values: AuthDeleteAccountRequest) => {
      try {
        handleDeleteAccountSubmit(values);
        handleLogout();
      } catch (error: any) {
        setFormStatus({ type: "error", message: error.message || "Error deleting account" });
      }
    },
  });

  // OTP handlers
  const handleEmailChangeOtpSubmit = async (email: string) => {
    try {
      const response = await authService.changeEmail(user?.id || "", { email });
      if (response.status === HTTP_STATUS.OK) {
        showSnackbar("success", response.data?.message || "OTP sent to new email. Verify to complete email change.");
      } else throw new Error(response.data?.message || "OTP verification failed");
    } catch (error: any) {
      showSnackbar("error", error.message || "Error verifying OTP");
    }
  };

  const handleDeleteOtpSubmit = async () => {
    try {
      const response = await authService.requestDeleteAccountOtp(user?.id || "");
      if (response.status === HTTP_STATUS.OK) {
        showSnackbar("success", "OTP sent to your email. Verify to complete account deletion.");
      } else throw new Error(response.data?.message || "OTP verification failed");
    } catch (error: any) {
      showSnackbar("error", error.message || "Error verifying OTP");
    }
  };

  const handleDeleteClick = () => {
    setDeleteOtpOpen(true);
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    deleteForm.resetForm();
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setFormStatus(null);
  };

  // Tabs config
  const tabs: TabType[] = [
    {
      id: "password",
      label: "Change Password",
      icon: <Lock />,
      description: "Update your account password",
      content: (
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Lock className="mr-3 text-blue-600" />
              Change Password
            </h3>
            <p className="text-gray-600">Update your account password for enhanced security</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="space-y-6">
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                name="oldPassword"
                value={passwordForm.values.oldPassword}
                onChange={passwordForm.handleChange}
                onBlur={passwordForm.handleBlur}
                error={passwordForm.touched.oldPassword && Boolean(passwordForm.errors.oldPassword)}
                helperText={passwordForm.touched.oldPassword && passwordForm.errors.oldPassword}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordForm.values.newPassword}
                onChange={passwordForm.handleChange}
                onBlur={passwordForm.handleBlur}
                error={passwordForm.touched.newPassword && Boolean(passwordForm.errors.newPassword)}
                helperText={passwordForm.touched.newPassword && passwordForm.errors.newPassword}
              />
              <div className="flex justify-end pt-4">
                <Button
                  label={passwordForm.isSubmitting ? "Updating..." : "Update Password"}
                  variant="primaryContained"
                  disabled={passwordForm.isSubmitting}
                  onClick={() => passwordForm.handleSubmit()}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "email",
      label: "Email Settings",
      icon: <Email />,
      description: "Update your email address",
      content: (
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Email className="mr-3 text-green-600" />
              Change Email Address
            </h3>
            <p className="text-gray-600">Update your primary email address</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <div className="space-y-6">
              <TextField
                fullWidth
                label="New Email Address"
                type="email"
                name="email"
                value={emailForm.values.email}
                onChange={emailForm.handleChange}
                onBlur={emailForm.handleBlur}
                error={emailForm.touched.email && Boolean(emailForm.errors.email)}
                helperText={emailForm.touched.email && emailForm.errors.email}
              />
              <div className="flex justify-end pt-4">
                <Button
                  label={emailForm.isSubmitting ? "Updating..." : "Update Email"}
                  variant="primaryContained"
                  disabled={emailForm.isSubmitting}
                  onClick={() => {
                    handleEmailChangeOtpSubmit(emailForm.values.email);
                    setEmailOtpOpen(true);
                  }}
                />
              </div>
            </div>
            {emailOtpOpen && (
              <OtpFloatingPopup
                open={emailOtpOpen}
                onClose={() => setEmailOtpOpen(false)}
                onSubmit={async (otp) => {
                  try {
                    await handleEmailOtpSubmit(otp, emailForm.values.email);
                    setEmailOtpOpen(false);
                    setFormStatus({ type: 'success', message: 'Email updated successfully' });
                  } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                    setFormStatus({ type: 'error', message: errorMessage });
                  }
                }}
                title="Verify Email"
                description="Enter the OTP sent to your new email to confirm the change."
                loading={emailForm.isSubmitting}
              />
            )}
          </div>
        </div>
      ),
    },
    {
      id: "danger",
      label: "Danger Zone",
      icon: <ErrorOutline color="error" />,
      description: "Manage your account security",
      content: (
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-red-900 mb-2 flex items-center">
              <ErrorOutline className="mr-3 text-red-600" />
              Danger Zone
            </h3>
            <p className="text-gray-600">Irreversible actions that affect your account</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
            <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <ErrorOutline className="text-red-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-red-900">Warning</h4>
                  <p className="text-red-800 text-sm">
                    These actions are irreversible. Please be certain before proceeding.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                label={deleteForm.isSubmitting ? "Deleting..." : "Delete Account"}
                variant="primaryContained"
                color="error"
                onClick={() => {
                    handleDeleteOtpSubmit();
                    setDeleteDialogOpen(true);
                }}
                disabled={deleteForm.isSubmitting}
              />
            </div>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteClose}
                aria-labelledby="delete-account-dialog"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                            '& .MuiAlert-icon': {
                                color: '#D32F2F'
                            }
                        }}
                    >
                        This action cannot be undone. All your data will be permanently deleted.
                    </Alert>
                    <Box component="form" onSubmit={deleteForm.handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Enter your password to confirm"
                            type="password"
                            name="password"
                            value={deleteForm.values.password}
                            onChange={deleteForm.handleChange}
                            onBlur={deleteForm.handleBlur}
                            error={deleteForm.touched.password && Boolean(deleteForm.errors.password)}
                            helperText={deleteForm.touched.password && deleteForm.errors.password}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        label="Cancel"
                        variant="secondaryContained"
                        onClick={handleDeleteClose}
                        disabled={deleteForm.isSubmitting}
                    />
                    <Button
                        label="Delete Account"
                        onClick={handleDeleteClick}
                        disabled={deleteForm.isSubmitting}
                        variant="primaryContained"
                        color="error"
                    />
                </DialogActions>
            </Dialog>
            {deleteOtpOpen && (
              <OtpFloatingPopup
                open={deleteOtpOpen}
                onClose={() => setDeleteOtpOpen(false)}
                onSubmit={async (otp) => {
                    await handleDeleteAccountSubmit({
                      password: deleteForm.values.password, // include password
                      otp,
                    });
                    setDeleteOtpOpen(false);
                    handleLogout();
                  }}
                title="Confirm Account Deletion"
                description="Enter the OTP sent to your email to permanently delete your account."
                loading={deleteForm.isSubmitting}
              />
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></div>
            Navigation
          </h2>
          <div className="space-y-2">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                onClick={() => handleTabChange(index)}
                className={`group cursor-pointer p-4 rounded-xl transition-all duration-300 hover:shadow-md ${
                  activeTab === index
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm"
                    : "bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      activeTab === index ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold transition-colors ${activeTab === index ? "text-blue-900" : "text-gray-900"}`}>
                      {tab.label}
                    </h3>
                    <p className="text-sm text-gray-600">{tab.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {formStatus && (
            <div
              className={`mb-6 p-4 rounded-xl border-l-4 ${
                formStatus.type === "success" ? "bg-green-50 border-green-400 text-green-800" : "bg-red-50 border-red-400 text-red-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{formStatus.message}</span>
                <button onClick={() => setFormStatus(null)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">{tabs[activeTab].content}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTemplate;
