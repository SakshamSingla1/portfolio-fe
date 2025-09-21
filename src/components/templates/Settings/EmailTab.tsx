import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { InputAdornment } from "@mui/material";
import TextField from "../../../components/atoms/TextField/TextField";
import Button from "../../../components/atoms/Button/Button";
import OtpPopup from "../../molecules/OtpPopup/OtpPopup";
import { useAuthService } from "../../../services/useAuthService";
import { HTTP_STATUS } from "../../../utils/types";

interface EmailTabProps {
  handleEmailOtpSubmit: (values: any) => void;
  setFormStatus: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; message: string } | null>>;
  showSnackbar: (type: "success" | "error", message: string) => void;
}

const EmailTab: React.FC<EmailTabProps> = ({ handleEmailOtpSubmit, setFormStatus, showSnackbar }) => {
  const authService = useAuthService();
  const [emailOtpOpen, setEmailOtpOpen] = useState(false);

  const emailForm = useFormik({
    initialValues: { newEmail: "", otp: "" },
    validationSchema: Yup.object({
      newEmail: Yup.string().required("Email is required").email("Invalid email format"),
      otp: Yup.string().required("OTP is required")
    }),
    onSubmit: (values, { resetForm }) => {
      try {
        handleEmailOtpSubmit(values);
        setFormStatus({ type: "success", message: "Email updated successfully" });
        resetForm();
        setEmailOtpOpen(false);
      } catch (error: any) {
        setFormStatus({ type: "error", message: error.message || "Error changing email" });
      }
    },
  });

  const handleEmailChangeOtpSubmit = async (email: string) => {
    try {
      const response = await authService.changeEmail({ email });
      if (response.status === HTTP_STATUS.OK) {
        showSnackbar("success", "OTP sent to new email. Verify to complete email change.");
        setEmailOtpOpen(true);
      } else throw new Error(response.data?.message || "OTP verification failed");
    } catch (error: any) {
      showSnackbar("error", error.message || "Error verifying OTP");
    }
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
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Change Email Address</h3>
        </div>
        <p className="text-gray-500 text-sm">Update the email address associated with your account.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleEmailChangeOtpSubmit(emailForm.values.newEmail); }} className="space-y-6">
        <div className="space-y-1">
          <TextField
            label="New Email Address"
            name="newEmail"
            type="email"
            value={emailForm.values.newEmail}
            onChange={emailForm.handleChange}
            onBlur={emailForm.handleBlur}
            error={emailForm.touched.newEmail && Boolean(emailForm.errors.newEmail)}
            helperText={emailForm.touched.newEmail && emailForm.errors.newEmail}
            className="bg-gray-50"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail className="text-gray-400" />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="pt-2">
          <Button
            label="Send Verification Code"
            variant="primaryContained"
            onClick={() => handleEmailChangeOtpSubmit(emailForm.values.newEmail)}
            endIcon={<ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />}
            disabled={emailForm.isSubmitting}
          />
        </div>
      </form>

      {emailOtpOpen && (
        <OtpPopup
          open={emailOtpOpen}
          onClose={() => setEmailOtpOpen(false)}
          onVerify={(otp) => {
            emailForm.setFieldValue("otp", otp);
            emailForm.handleSubmit();
          }}
          resendOtp={() => handleEmailChangeOtpSubmit(emailForm.values.newEmail)}
          phoneNumber={emailForm.values.newEmail}
        />
      )}
    </motion.div>
  );
};

export default EmailTab;
