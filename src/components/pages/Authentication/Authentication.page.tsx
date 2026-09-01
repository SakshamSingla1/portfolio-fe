import React, { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AUTH_STATE } from "../../../utils/types";

import AuthenticationTemplate from "../../templates/Authentication/Authentication.template";

const LoginWithEmailTemplate = lazy(() => import("../../templates/Authentication/LoginWithEmail.template"));
const LoginWithPhoneTemplate = lazy(() => import("../../templates/Authentication/LoginWithPhone.template"));
const OtpVerificationTemplate = lazy(() => import("../../templates/Authentication/OtpVerification.template"));
const ForgotPasswordTemplate = lazy(() => import("../../templates/Authentication/ForgotPassword.template"));
const ResetPasswordTemplate = lazy(() => import("../../templates/Authentication/ResetPassword.template"));
const RegistrationTemplate = lazy(() => import("../../templates/Authentication/Registration.template"));
const TwoFactorVerificationTemplate = lazy(() => import("../../templates/Authentication/TwoFactorVerification.template"));

const Authentication: React.FC = () => {
  const [authState, setAuthState] = useState<AUTH_STATE | null>(null);
  const [searchParams] = useSearchParams();

  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isRegisterFlow, setIsRegisterFlow] = useState(false);
  const [pendingToken, setPendingToken] = useState<string>("");

  useEffect(() => {
    try {
      const token = searchParams.get("token");
      const nextState = token ? AUTH_STATE.RESET_PASSWORD : AUTH_STATE.LOGIN_WITH_EMAIL;
      setAuthState(nextState);
    } catch {
      setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
    }
  }, [searchParams]);

  const renderAuthView = () => {
    switch (authState) {
      case AUTH_STATE.REGISTER:
        return (
          <RegistrationTemplate
            setEmail={setEmail}
            setAuthState={setAuthState}
            setIsRegisterFlow={setIsRegisterFlow}
          />
        );

      case AUTH_STATE.LOGIN_WITH_EMAIL:
        return <LoginWithEmailTemplate setAuthState={setAuthState} setPendingToken={setPendingToken} />;

      case AUTH_STATE.LOGIN_WITH_PHONE:
        return (
          <LoginWithPhoneTemplate
            setPhone={setPhone}
            setAuthState={setAuthState}
            setIsRegisterFlow={setIsRegisterFlow}
          />
        );

      case AUTH_STATE.OTP_VERIFICATION:
        return (
          <OtpVerificationTemplate
            phone={phone || ""}
            email={email || ""}
            setAuthState={setAuthState}
            isRegisterFlow={isRegisterFlow}
            setIsRegisterFlow={setIsRegisterFlow}
          />
        );

      case AUTH_STATE.TWO_FACTOR_VERIFY:
        return (
          <TwoFactorVerificationTemplate
            pendingToken={pendingToken}
            setAuthState={setAuthState}
          />
        );

      case AUTH_STATE.FORGOT_PASSWORD:
        return <ForgotPasswordTemplate setAuthState={setAuthState} />;

      case AUTH_STATE.RESET_PASSWORD:
        return <ResetPasswordTemplate setAuthState={setAuthState} />;

      default:
        return <LoginWithEmailTemplate setAuthState={setAuthState} setPendingToken={setPendingToken} />;
    }
  };

  return (
    <AuthenticationTemplate setAuthState={setAuthState}>
      <Suspense fallback={null}>{renderAuthView()}</Suspense>
    </AuthenticationTemplate>
  );
};

export default Authentication;
