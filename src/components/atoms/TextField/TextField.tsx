import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/system";
import { createUseStyles } from "react-jss";
import { useColors } from "../../../utils/types";

const useStyles = createUseStyles({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
        gap: "6px",
    },

    label: (colors: any) => ({
        color: colors.neutral700,
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "16px",
        marginLeft: "8px",
    }),

    textField: (colors: any) => ({
        "& .MuiInputBase-root": {
            backgroundColor: colors.neutral50,
            border: `1px solid ${colors.neutral200}`,
            borderRadius: "4px",
            fontSize: "16px",
            transition: "all 0.2s ease-in-out",

            "&:hover": {
                borderColor: colors.primary300,
            },

            "&:focus-within": {
                borderColor: colors.primary500,
                boxShadow: `0 0 0 3px ${colors.primary100}`,
            },

            "& .MuiInputBase-input": {
                padding: "13px 12px",
                color: colors.neutral900,

                "&::placeholder": {
                    color: colors.neutral400,
                },

                "&:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 1000px ${colors.neutral50} inset`,
                    WebkitTextFillColor: colors.neutral900,
                    borderRadius: "12px",
                },
            },

            "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
            },

            "&.Mui-disabled": {
                backgroundColor: colors.neutral100,
                borderColor: colors.neutral200,
                color: colors.neutral500,
                cursor: "not-allowed",
            },
        },

        /* Error State */
        "& .Mui-error": {
            borderColor: colors.error500,
            backgroundColor: colors.error50,
        },
    }),

    readOnlyInput: (colors: any) => ({
        "& .MuiInputBase-input[readonly]": {
            backgroundColor: colors.neutral100,
            color: `${colors.neutral700} !important`,
            cursor: "default",
        },
    }),

    helperText: (colors: any) => ({
        fontSize: "12px",
        marginLeft: "8px",
        color: colors.error600,
    }),
});

const TextField = styled((props: TextFieldProps) => {
    const colors = useColors();
    const classes = useStyles(colors);

    return (
        <div
            className={`${classes.wrapper} ${
                props.disabled ? "pointer-events-none select-none" : ""
            }`}
        >
            {props.label && (
                <label className={classes.label}>{props.label}</label>
            )}

            <MuiTextField
                {...props}
                label=""
                helperText={null}
                className={`${classes.textField} ${
                    props.InputProps?.readOnly ? classes.readOnlyInput : ""
                }`}
            />

            {props.error && props.helperText && (
                <p className={classes.helperText}>{props.helperText}</p>
            )}
        </div>
    );
})``;

export default TextField;
