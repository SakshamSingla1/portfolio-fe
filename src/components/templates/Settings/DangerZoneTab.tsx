import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, InputAdornment } from "@mui/material";
import { AlertCircle, Trash2, Lock, ShieldAlert } from "lucide-react";
import TextField from "../../../components/atoms/TextField/TextField";
import Button from "../../../components/atoms/Button/Button";
import OtpPopup from "../../molecules/OtpPopup/OtpPopup";
import { useAuthService } from "../../../services/useAuthService";
import { HTTP_STATUS, type IUser } from "../../../utils/types";

interface DangerZoneTabProps {
  user: IUser | null;
  handleDeleteAccountSubmit: (values: any) => void;
  setFormStatus: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; message: string } | null>>;
  showSnackbar: (type: "success" | "error", message: string) => void;
  handleLogout: () => void;
}

const DangerZoneTab: React.FC<DangerZoneTabProps> = ({
  user,
  handleDeleteAccountSubmit,
  setFormStatus,
  showSnackbar,
  handleLogout,
}) => {
  const authService = useAuthService();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteOtpOpen, setDeleteOtpOpen] = useState(false);

  const deleteForm = useFormik({
    initialValues: { password: "", otp: "" },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is required"),
      otp: Yup.string().required("OTP is required")
    }),
    onSubmit: (values) => {
      try {
        handleDeleteAccountSubmit(values);
        handleLogout();
      } catch (error: any) {
        setFormStatus({ type: "error", message: error.message || "Error deleting account" });
      }
    },
  });

  const handleDeleteOtpSubmit = async () => {
    try {
      const response = await authService.requestDeleteAccountOtp();
      if (response.status === HTTP_STATUS.OK) {
        showSnackbar("success", "OTP sent to your email. Verify to complete account deletion.");
        setDeleteDialogOpen(true);
      } else throw new Error(response.data?.message || "OTP verification failed");
    } catch (error: any) {
      showSnackbar("error", error.message || "Error verifying OTP");
    }
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    deleteForm.resetForm();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Danger Zone</h3>
        </div>
        <p className="text-gray-500 text-sm">Permanently delete your account and all associated data.</p>
      </div>

      <div className="border border-red-200 rounded-xl overflow-hidden">
        <div className="p-6 bg-red-50 border-b border-red-100">
          <h4 className="text-lg font-semibold text-red-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Delete Account
          </h4>
          <p className="text-sm text-red-700 mt-1">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>
        
        <div className="p-6">
          <Button
            label={deleteForm.isSubmitting ? "Deleting..." : "Delete My Account"}
            variant="primaryContained"
            color="error"
            onClick={handleDeleteOtpSubmit}
            disabled={deleteForm.isSubmitting}
            startIcon={<Trash2 className="w-4 h-4" />}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <DialogTitle className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          Delete Your Account
        </DialogTitle>
        <Divider />
        <DialogContent className="pt-6">
          <Alert 
            severity="error" 
            icon={<AlertCircle className="w-5 h-5" />}
            className="mb-6 border border-red-200 bg-red-50"
          >
            <div className="text-sm">
              <p className="font-medium">This action cannot be undone</p>
              <p className="mt-1">All your data will be permanently deleted and you will be logged out immediately.</p>
            </div>
          </Alert>
          
          <Box component="form" onSubmit={deleteForm.handleSubmit} className="space-y-4">
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions className="px-6 py-4 bg-gray-50">
          <Button 
            label="Cancel" 
            variant="secondaryContained" 
            onClick={handleDeleteClose} 
            className="px-4"
          />
          <Button
            label="Delete Account"
            variant="primaryContained"
            onClick={() => setDeleteOtpOpen(true)}
            startIcon={<Trash2 className="w-4 h-4" />}
            disabled={deleteForm.isSubmitting}
          />
        </DialogActions>
      </Dialog>

      {deleteOtpOpen && (
        <OtpPopup
          open={deleteOtpOpen}
          onClose={handleDeleteClose}
          onVerify={(otp) => {
            deleteForm.setFieldValue("otp", otp);
            deleteForm.handleSubmit();
          }}
          resendOtp={handleDeleteOtpSubmit}
          phoneNumber={user?.phone}
        />
      )}
    </motion.div>
  );
};

export default DangerZoneTab;
