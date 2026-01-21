import React from "react";
import { styled } from "@mui/system";
import { useColors } from "../../../utils/types";

interface ErrorMessageProps {
  message?: string;
}

const ErrorText = styled("div")<{ colors: any }>(({ colors }) => ({
  fontSize: 12,
  lineHeight: "16px",
  color: colors.error600,
  marginTop: 4,

  "@media (max-width: 767px)": {
    marginTop: 4,
  },
}));

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const colors = useColors();

  if (!message) return null;

  return <ErrorText colors={colors}>{message}</ErrorText>;
};

export default ErrorMessage;
