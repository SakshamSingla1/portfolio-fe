import React, { useMemo } from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { createUseStyles, useTheme } from "react-jss";
import whiteRightArrow from '../../../assets/icons/whiteRightArrow.svg';
import rightArrow from '../../../assets/icons/rightArrowButton.svg';

type CustomVariant = "primaryContained" | "secondaryContained" | "tertiaryContained" | "primaryText" | "secondaryText" | "tertiaryText" | "viewBtn";
type CustomSize = "small" | "medium" | "large";

interface StyleProps {
    theme: any;
    iconPosition?: string;
    label?: string | null;
}

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
    primaryContained: (props: StyleProps) => ({
        color: 'white',
        borderRadius: "8px",
        border: `1px solid ${props.theme.palette.background.primary.primary500}`,
        backgroundColor: props.theme.palette.background.primary.primary500,
        position: 'relative',
        overflow: 'hidden',
        paddingLeft: '20px',
        transition: 'padding-left 0.3s ease',
        "&::before": {
            content: `''`,
            position: 'absolute',
            left: props.iconPosition || '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: props.label ? `url(${whiteRightArrow}) no-repeat center center` : 'none',
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.2s ease, left 0.2s ease',
        },
        "&:hover": {
            paddingLeft: props.label ? '40px' : '20px',
            backgroundColor: props.theme.palette.background.primary.primary700,
        },
        "&:hover::before": {
            left: props.iconPosition || '10px',
            opacity: 1,
        },
        "&:disabled": {
            color: props.theme.palette.text.neutral.neutral400,
            backgroundColor: props.theme.palette.background.neutral.neutral50,
            border: "none"
        },
        '&:focus': {
            backgroundColor: props.theme.palette.background.primary.primary700,
        },
        '&:active': {
            backgroundColor: props.theme.palette.background.primary.primary800,
        },
    }),
    secondaryContained: (props: StyleProps) => ({
        color: props.theme.palette.background.primary.primary500,
        backgroundColor: props.theme.palette.background.primary.primary100,
        borderRadius: "8px",
        borderColor: "white",
        border: '1px solid',
        position: 'relative',
        overflow: 'hidden',
        paddingLeft: '20px',
        transition: 'padding-left 0.3s ease',
        "&::before": {
            content: `''`,
            position: 'absolute',
            left: props.iconPosition || "10px",
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: props.label ? `url(${rightArrow}) no-repeat center center` : 'none',
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.2s ease, left 0.2s ease',
        },
        "&:hover": {
            paddingLeft: props.label ? '40px' : '20px',
            backgroundColor: props.theme.palette.background.primary.primary200
        },
        "&:hover::before": {
            left: props.iconPosition || "10px",
            opacity: 1,
        },
        "&:disabled": {
            color: props.theme.palette.text.neutral.neutral400,
            backgroundColor: props.theme.palette.background.neutral.neutral50,
        },
        '&:focus': {
            backgroundColor: props.theme.palette.background.primary.primary200,
            border: `1px solid ${props.theme.palette.border.primary.primary400}`
        },
        '&:active': {
            backgroundColor: props.theme.palette.background.primary.primary200,
        },
    }),
    tertiaryContained: (props: StyleProps) => ({
        color: props.theme.palette.background.primary.primary500,
        borderRadius: "8px",
        borderColor: props.theme.palette.border.primary.primary800,
        border: '1px solid',
        backgroundColor: "white",
        position: 'relative',
        overflow: 'hidden',
        paddingLeft: '20px',
        transition: 'padding-left 0.3s ease',
        "&::before": {
            content: `''`,
            position: 'absolute',
            left: props.iconPosition || '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: props.label ? `url(${rightArrow}) no-repeat center center` : 'none',
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.2s ease, left 0.2s ease',
        },
        "&:hover": {
            paddingLeft: props.label ? '40px' : '20px',
            backgroundColor: "white",
        },
        "&:hover::before": {
            left: props.iconPosition || '10px',
            opacity: 1,
        },
        "&:disabled": {
            color: props.theme.palette.text.neutral.neutral300,
            border: `1px solid ${props.theme.palette.border.neutral.neutral300}`
        },
        '&:focus': {
            backgroundColor: props.theme.palette.background.primary.primary50,
        },
        '&:active': {
            backgroundColor: props.theme.palette.background.primary.primary50,
        },
    }),
    primaryText: (props: StyleProps) => ({
        color: props.theme.palette.background.primary.primary500,
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
            left: props.iconPosition || '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: props.label ? `url(${rightArrow}) no-repeat center center` : 'none',
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.3s ease, left 0.3s ease',
        },
        "&:hover": {
            paddingLeft: props.label ? '40px' : '20px',
            color: props.theme.palette.background.primary.primary500,
            textDecoration: "underline",
            backgroundColor: "white",
        },
        "&:hover::before": {
            left: props.iconPosition || '40px',
            opacity: 1,
        },
        "&:disabled": {
            color: props.theme.palette.text.neutral.neutral300,
        },
        '&:focus': {
            color: props.theme.palette.background.primary.primary500,
        },
        '&:active': {
            color: props.theme.palette.background.primary.primary500,
            backgroundColor: props.theme.palette.background.primary.primary50,
        },
    }),
    secondaryText: (props: StyleProps) => ({
        color: props.theme.palette.text.primary.primary500,
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
            left: props.iconPosition || '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: props.label ? `url(${rightArrow}) no-repeat center center` : 'none',
            backgroundSize: 'contain',
            opacity: 0,
            padding: "12px",
            transition: 'opacity 0.3s ease, left 0.3s ease',
        },
        "&:hover": {
            paddingLeft: props.label ? '40px' : '20px',
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            color: props.theme.palette.background.primary.primary500,
            backgroundColor: "inherit",
        },
        "&:hover::before": {
            left: props.iconPosition || '40px',
            opacity: 1,
        },
        "&:disabled": {
            color: props.theme.palette.text.neutral.neutral300,
        },
        '&:focus': {
            color: props.theme.palette.text.primary.primary900,
            backgroundColor: props.theme.palette.background.primary.primary50,
        },
        '&:active': {
            color: props.theme.palette.text.primary.primary800,
        },
    }),
    tertiaryText: (props: StyleProps) => ({
        color: props.theme.palette.text.neutral.neutral500,
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
            background: props.label ? `url(${rightArrow}) no-repeat center center` : 'none',
            backgroundSize: 'contain',
            opacity: 0,
            transition: 'opacity 0.3s ease, left 0.3s ease',
        },
        "&:hover": {
            paddingLeft: props.label ? '40px' : '20px',
            color: props.theme.palette.text.primary.primary700,
            textDecoration: "underline",
            backgroundColor: "white",
        },
        "&:hover::before": {
            left: '10px',
            opacity: 1,
        },
        "&:disabled": {
            color: props.theme.palette.text.neutral.neutral300,
        },
        '&:focus': {
            color: props.theme.palette.text.neutral.neutral800,
        },
        '&:active': {
            color: props.theme.palette.text.primary.primary700,
            backgroundColor: props.theme.palette.background.neutral.neutral50,
        },
    }),
    viewBtn: (props: StyleProps) => ({
        position: 'relative',
        color: props.theme.palette.text.primary.primary500,
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
            color: props.theme.palette.text.primary.primary950,
        },
        "&:hover::before": {
            left: '0',
            opacity: 1,
        },
    }),
    label: {
        textTransform: "none",
    },
    small: (props: StyleProps) => ({
        height: "fit-content",
        fontSize: "14px",
        padding: props.label ? "8px 16px" : "8px",
    }),
    medium: (props: StyleProps) => ({
        height: "fit-content",
        fontSize: "16px",
        padding: props.label ? "10px 20px" : "10px",
    }),
    large: (props: StyleProps) => ({
        height: "fit-content",
        fontSize: "18px",
        lineHeight: "22px",
        padding: props.label ? "12px 24px" : "12px",
    }),
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
    className = '',
    disabled,
    ...props
}) => {
    const theme = useTheme();
    const styles = useStyles({ theme, iconPosition, label });

    const getIconStyle = (size: string) => {
        switch (size) {
            case "small":
                return styles.smallIcon;
            case "medium":
                return styles.mediumIcon;
            case "large":
            default:
                return styles.largeIcon;
        }
    };

    const buttonView = useMemo(
        () => iconButton ? (
            <img className={getIconStyle(size)} src={iconButton} alt="" />
        ) : (
            label
        ),
        [iconButton, label, size]
    );

    return (
        <MuiButton
            variant="contained"
            disabled={disabled || isLoading}
            className={`${styles[variant]} ${styles[size]} ${className} ${styles.label} font-medium`}
            classes={{ root: styles.root }}
            {...props}
        >
            {isLoading ? <CircularProgress size={20} /> : buttonView}
        </MuiButton>
    );
};

export default Button;
