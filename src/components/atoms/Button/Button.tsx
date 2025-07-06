import React, { useMemo } from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { createUseStyles, useTheme } from "react-jss";
import whiteRightArrow from '../../../assets/icons/whiteRightArrow.svg';
import rightArrow from '../../../assets/icons/rightArrowButton.svg';

type CustomVariant = "primaryContained" | "secondaryContained" | "tertiaryContained" | "primaryText" | "secondaryText" | "tertiaryText" | "viewBtn";
type CustomSize = "small" | "medium" | "large";

const useStyles = createUseStyles({
    largeIcon: {
        width: "22px",
        height: "22px",
    },
    mediumIcon: {
        width: "20px",
        height: "20px",
    },
    smallIcon: {
        width: "16px",
        height: "16px",
    },
    root: {
        minWidth: "auto",
        padding: "0px",
        lineHeight: "1 !important",
        "&:hover": {
            backgroundColor: "none",
        },
    },
    primaryContained: {
        color: 'white',
        borderRadius: "8px",
        borderColor: ({ theme }: any) => theme.palette.background.primary.primary500,
        border: '1px solid',
        backgroundColor: ({ theme }: any) => theme.palette.background.primary.primary500,
        position: 'relative',
        overflow: 'hidden',
        paddingLeft: '20px',
        transition: 'padding-left 0.3s ease',
        "&::before": {
            content: `''`,
            position: 'absolute',
            left: ({ iconPosition }: any) => iconPosition || '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: ({ label }: any) => label && `url(${whiteRightArrow}) no-repeat center center`,
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.2s ease, left 0.2s ease',
        },

        "&:hover": {
            paddingLeft: ({ label }: any) => label && '40px',
            borderRadius: "0px",
            backgroundColor: ({ theme }: any) => theme.palette.background.primary.primary700,
        },
        "&:hover::before": {
            left: ({ iconPosition }: any) => iconPosition || '10px',
            opacity: 1,
        },
        "&:disabled": {
            color: ({ theme }: any) => theme.palette.text.neutral.neutral400,
            backgroundColor: ({ theme }: any) => theme.palette.background.neutral.neutral50,
            border: "none"
        },

        '&:focus': {
            backgroundColor: ({ theme }: any) => theme.palette.button.primaryContained.background.primary700,
        },
        '&:active': {
            backgroundColor: ({ theme }: any) => theme.palette.button.primaryContained.background.primary800,
        },
    },
    secondaryContained: {
        color: ({ theme }: any) => theme.palette.text.primary.primary800,
        backgroundColor: ({ theme }: any) => theme.palette.background.primary.primary100,
        borderRadius: "8px",
        borderColor: ({ theme }: any) => "white",
        border: '1px solid',
        position: 'relative',
        overflow: 'hidden',
        paddingLeft: '20px',
        transition: 'padding-left 0.3s ease',

        "&::before": {
            content: `''`,
            position: 'absolute',
            left: ({ iconPosition }: any) => iconPosition || "10px",
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: ({ label }: any) => label && `url(${rightArrow}) no-repeat center center`,
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.2s ease, left 0.2s ease',
        },

        "&:hover": {
            paddingLeft: ({ label }: any) => label && '40px',
            borderRadius: "0px",
            backgroundColor: ({ theme }: any) => theme.palette.background.primary.primary200
        },

        "&:hover::before": {
            left: ({ iconPosition }: any) => iconPosition || "10px",
            opacity: 1,
        },

        "&:disabled": {
            color: ({ theme }: any) => theme.palette.text.neutral.neutral400,
            backgroundColor: ({ theme }: any) => theme.palette.background.neutral.neutral50,
        },

        '&:focus': {
            backgroundColor: ({ theme }: any) => theme.palette.background.primary.primary200,
            border: ({ theme }: any) => `1px solid ${theme.palette.border.primary.primary400}`
        },

        '&:active': {
            backgroundColor: ({ theme }: any) => theme.palette.background.primary.primary200,
        },
    },

    tertiaryContained: {
        color: ({ theme }: any) => theme.palette.text.primary.primary800,
        borderRadius: "8px",
        borderColor: ({ theme }: any) => theme.palette.border.primary.primary800,
        border: '1px solid',
        backgroundColor: "white",
        position: 'relative',
        overflow: 'hidden',
        paddingLeft: '20px',
        transition: 'padding-left 0.3s ease',

        "&::before": {
            content: `''`,
            position: 'absolute',
            left: ({ iconPosition }: any) => iconPosition || '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: ({ label }: any) => label && `url(${rightArrow}) no-repeat center center`,
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.2s ease, left 0.2s ease',
        },

        "&:hover": {
            paddingLeft: ({ label }: any) => label && '40px',
            borderRadius: "0px",
            backgroundColor: "white",
        },

        "&:hover::before": {
            left: ({ iconPosition }: any) => iconPosition || '10px',
            opacity: 1,
        },

        "&:disabled": {
            color: ({ theme }: any) => theme.palette.text.neutral.neutral300,
            border: ({ theme }: any) => `1px solid ${theme.palette.border.neutral.neutral300}`
        },

        '&:focus': {
            backgroundColor: ({ theme }: any) => theme.palette.background.primary.primary50,
        },

        '&:active': {
            backgroundColor: ({ theme }: any) => theme.palette.background.primary.primary50,
        },
    },
    primaryText: {
        color: ({ theme }: any) => theme.palette.text.complementary.complementary200,
        borderRadius: "10px",
        border: 'none',
        backgroundColor: "transparent",
        textDecoration: "underline",
        position: 'relative',
        overflow: 'hidden',
        transition: 'padding-left 0.3s ease',
        paddingLeft: '20px',
        "&::before": {
            content: `''`,
            position: 'absolute',
            left: ({ iconPosition }: any) => iconPosition || '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: ({ label }: any) => label && `url(${rightArrow}) no-repeat center center`,
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.3s ease, left 0.3s ease',
        },

        "&:hover": {
            paddingLeft: ({ label }: any) => label && '40px',
            borderRadius: "0px",
            color: ({ theme }: any) => theme.palette.text.complementary.complementary400,
            textDecoration: "underline",
            backgroundColor: "white",
        },

        "&:hover::before": {
            left: ({ iconPosition }: any) => iconPosition || '40px',
            opacity: 1,
        },

        "&:disabled": {
            color: ({ theme }: any) => theme.palette.text.neutral.neutral300,
        },

        '&:focus': {
            color: ({ theme }: any) => theme.palette.text.complementary.complementary500,
        },

        '&:active': {
            color: ({ theme }: any) => theme.palette.text.complementary.complementary700,
            backgroundColor: ({ theme }: any) => theme.palette.background.complementary.complementary50,
        },
    },
    secondaryText: {
        color: ({ theme }: any) => theme.palette.text.primary.primary500,
        borderRadius: "10px",
        border: 'none',
        backgroundColor: "inherit",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        position: 'relative',
        overflow: 'hidden',
        transition: 'padding-left 0.3s ease',
        paddingLeft: '20px',
        "&::before": {
            content: `''`,
            position: 'absolute',
            left: ({ iconPosition }: any) => iconPosition || '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: ({ label }: any) => label && `url(${rightArrow}) no-repeat center center`,
            backgroundSize: 'contain',
            opacity: 0,
            padding: "12px",
            transition: 'opacity 0.3s ease, left 0.3s ease',
        },

        "&:hover": {
            paddingLeft: ({ label }: any) => label && '40px',
            borderRadius: "0px",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            color: ({ theme }: any) => theme.palette.text.primary.primary800,
            backgroundColor: "inherit",
        },

        "&:hover::before": {
            left: ({ iconPosition }: any) => iconPosition || '40px',
            opacity: 1,
        },

        "&:disabled": {
            color: ({ theme }: any) => theme.palette.text.neutral.neutral300,
        },

        '&:focus': {
            color: ({ theme }: any) => theme.palette.text.primary.primary900,
            backgroundColor: ({ theme }: any) => theme.palette.background.primary.primary50,
        },

        '&:active': {
            color: ({ theme }: any) => theme.palette.text.primary.primary800,
        },
    },
    tertiaryText: {
        color: ({ theme }: any) => theme.palette.text.neutral.neutral500,
        borderRadius: "10px",
        border: 'none',
        backgroundColor: "transparent",
        textDecoration: "underline",
        position: 'relative',
        overflow: 'hidden',
        transition: 'padding-left 0.3s ease',
        paddingLeft: '20px',
        "&::before": {
            content: `''`,
            position: 'absolute',
            left: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: ({ label }: any) => label && `url(${rightArrow}) no-repeat center center`,
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.3s ease, left 0.3s ease',
        },

        "&:hover": {
            paddingLeft: ({ label }: any) => label && '40px',
            color: ({ theme }: any) => theme.palette.text.primary.primary700,
            textDecoration: "underline",
            backgroundColor: "white",
        },

        "&:hover::before": {
            left: '10px',
            opacity: 1,
        },

        "&:disabled": {
            color: ({ theme }: any) => theme.palette.text.neutral.neutral300,
        },

        '&:focus': {
            color: ({ theme }: any) => theme.palette.text.neutral.neutral800,
        },

        '&:active': {
            color: ({ theme }: any) => theme.palette.text.primary.primary700,
            backgroundColor: ({ theme }: any) => theme.palette.background.neutral.neutral50,
        },
    },
    viewBtn: {
        position: 'relative',
        color: ({ theme }: any) => theme.palette.text.primary.primary500,
        cursor: 'pointer',
        backgroundColor: "inherit",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        transition: 'color 0.3s ease, padding-left 0.3s ease',
        padding: "12px 12px 12px 24px !important",
        "&::before": {
            content: `''`,
            position: 'absolute',
            left: '25px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: `url(${rightArrow}) no-repeat center center`,
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.3s ease, left 0.3s ease',
        },
        "&:hover": {
            paddingLeft: '25px',
            backgroundColor: "inherit",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            color: ({ theme }: any) => theme.palette.text.primary.primary950,
        },
        "&:hover::before": {
            left: '0',
            opacity: 1,
        },

    },
    label: {
        textTransform: "none",
    },
    small: {
        height: "fit-content",
        fontSize: "14px",
        padding: ({ label }: any) => label ? "8px 16px" : "8px",
    },
    medium: {
        height: "fit-content",
        fontSize: "16px",
        padding: ({ label }: any) => label ? "10px 20px" : "10px",
    },
    large: {
        height: "fit-content",
        fontSize: "18px",
        lineHeight: "22px",
        padding: ({ label }: any) => label ? "12px 24px" : "12px",
    },
});

interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
    variant: CustomVariant;
    label?: string | null;
    isLoading?: boolean;
    iconButton?: string;
    size?: CustomSize;
    iconPosition?: string;
}

const Button: React.FC<ButtonProps> = ({
    variant,
    label,
    iconPosition = "10px",
    isLoading,
    iconButton,
    size = "large",
    ...props
}) => {

    const theme = useTheme<Jss.Theme>();
    const styles = useStyles({ theme, iconPosition, label });
    const getIconStyle = (size: string) => {
        if (size === "small") {
            return styles.smallIcon
        }
        if (size === "medium") {
            return styles.mediumIcon
        }
        if (size === "large") {
            return styles.largeIcon
        }
    }
    const buttonView = useMemo(
        () => iconButton ?
            <img className={getIconStyle(size)} src={iconButton} alt="" />
            : label,
        [iconButton, label, size]
    )
    return (
        <MuiButton
            {...props}
            className={`${styles[variant]} ${styles[size]} ${props.className ? props.className : ''} ${styles.label} font-medium`}
            disabled={props.disabled || !!isLoading}
            classes={{ root: styles.root }}
        >
            {isLoading ? <CircularProgress size={20} /> : buttonView}
        </MuiButton>
    );
};
export default Button;
