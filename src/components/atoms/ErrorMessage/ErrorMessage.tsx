import React from "react";
import { createUseStyles } from "react-jss";
import { useColors } from "../../../utils/types";

const useStyles = createUseStyles({
    errorBig: (colors: any) => ({
        color: colors.error600,
        position: "absolute",
        marginTop: "95px",
        fontSize: "12px",
        lineHeight: "16px",
    }),

    errorSmall: (colors: any) => ({
        color: colors.error600,
        position: "absolute",
        marginTop: "70px",
        fontSize: "12px",
        lineHeight: "16px",
    }),

    "@media (max-width: 767px)": {
        errorSmall: (colors: any) => ({
            color: colors.error600,
            position: "relative",
            marginTop: "4px",
        }),
    },
});

interface ErrorMessageProps {
    message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    const colors = useColors();
    const classes = useStyles(colors);

    if (!message) return null;

    return <div className={classes.errorSmall}>{message}</div>;
};

export default ErrorMessage;
