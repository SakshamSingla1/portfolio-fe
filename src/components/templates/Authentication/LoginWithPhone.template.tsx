import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import TextField from "../../atoms/TextField/TextField";
import { type AuthLoginDTO, useAuthService } from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiMail, FiPhone } from "react-icons/fi";
import { AUTH_STATE, HTTP_STATUS, useColors } from "../../../utils/types";
import Button from "../../atoms/Button/Button";
import { useState } from "react";
import { InputAdornment } from "@mui/material";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { motion } from "framer-motion";

interface LoginWithPhoneProps {
  setPhone: (phone: string) => void;
  setAuthState: (authState: AUTH_STATE) => void;
  setIsRegisterFlow: (isRegisterFlow: boolean) => void;
}

const validationSchema = Yup.object({
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .required("Phone Number is required"),
});

const LoginWithPhone: React.FC<LoginWithPhoneProps> = ({
  setAuthState, setPhone, setIsRegisterFlow,
}) => {
  const colors = useColors();
  const authService = useAuthService();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<AuthLoginDTO>({
    initialValues: { phone: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await authService.sendOtp(values);
        if (response.status === HTTP_STATUS.OK) {
          setPhone(String(values.phone));
          setIsRegisterFlow(false);
          setAuthState(AUTH_STATE.OTP_VERIFICATION);
        }
      } catch (err) {
        console.error(err);
        showSnackbar("error", "Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="px-8 py-10">
        <div className="mb-8">
          <motion.div
            className="inline-flex items-center justify-center p-3 rounded-2xl mb-5 text-white text-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.primary500}, ${colors.primary700})`,
              boxShadow: `0 8px 24px -4px ${colors.primary500}50`,
            }}
            whileHover={{ scale: 1.05, rotate: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <FiPhone />
          </motion.div>
          <h2 className="text-2xl font-black tracking-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
            Sign in with Phone
          </h2>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            We'll send a one-time code to your number
          </p>
        </div>

        <div className="mb-6">
          <ToggleButtonGroup
            fullWidth exclusive value="phone"
            onChange={(_e, v) => v === "email" && setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL)}
            sx={{
              backgroundColor: "rgba(255,255,255,0.05)",
              padding: "4px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.07)",
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: "10px !important",
                padding: "9px 16px",
                fontSize: "0.875rem",
                textTransform: "none",
                fontWeight: 600,
                color: "rgba(255,255,255,0.45)",
                "&.Mui-selected": {
                  backgroundColor: "rgba(255,255,255,0.10)",
                  color: colors.primary400,
                  boxShadow: `0 2px 8px ${colors.primary500}30`,
                },
              },
            }}
          >
            <ToggleButton value="email" className="flex items-center gap-2">
              <FiMail size={15} /> Email
            </ToggleButton>
            <ToggleButton value="phone" className="flex items-center gap-2">
              <FiPhone size={15} /> Phone
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className="space-y-4">
          <TextField
            fullWidth name="phone" label="Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange} onBlur={formik.handleBlur}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <FiPhone size={15} /> +91
                  </div>
                </InputAdornment>
              ),
            }}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone ? String(formik.errors.phone) : ""}
          />
        </div>

        <div className="mt-6">
          <Button
            variant="primaryContained" size="large" fullWidth
            onClick={() => formik.handleSubmit()}
            label={isLoading ? "Sending OTP…" : "Send OTP"}
            disabled={isLoading || !formik.values.phone}
          />
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.22)" }}>OR</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
        </div>

        <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.45)" }}>
          Don't have an account?{" "}
          <span
            className="font-semibold cursor-pointer hover:underline"
            style={{ color: colors.primary400 }}
            onClick={() => setAuthState(AUTH_STATE.REGISTER)}
          >
            Create one
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginWithPhone;
