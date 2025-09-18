import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import { styled } from "@mui/system";
import { createUseStyles } from "react-jss";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
const useStyles = createUseStyles((theme: any) => ({
    label: {
        color: theme.palette.text.neutral.neutral700,
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "16px"
    },
    textField: {
        "& .MuiInputBase-root": {
            border: `1px solid`,
            borderColor: theme.palette.background.neutral.neutral200,
            fontSize: "16px",
            fontWeight: 400,
            borderRadius: "12px",
            "&:hover": {
                borderColor: theme.palette.background.primary.primary300,
                borderWidth: "1px",
                outline: "none",
            },
            "& .MuiInputBase-input": {
                padding: "13px 12px",
                "&::placeholder": {
                    color: `${theme.palette.text.neutral.neutral900} !important`,
                    fontWeight: 400,
                },
                "&:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 1000px inherit inset !important`,
                    WebkitTextFillColor: `${theme.palette.text.neutral.neutral700} !important`,
                    borderRadius: "12px",
                    transition: "background-color 5000s ease-in-out 0s",
                    // height:"0px"
                }
            },
            "& .MuiOutlinedInput-notchedOutline": {
                outline: "none",
                borderWidth: 0,
                borderColor: theme.palette.background.primary.primary300,
            },
            "&:focus-within": {
                outline: "none",
                borderColor: theme.palette.background.primary.primary300,
                borderWidth: 2,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                outline: "none",
                borderWidth: 0,
                borderColor: theme.palette.background.primary.primary300,
            },
            "& .Mui-disabled": {
                color: `${theme.palette.text.neutral.neutral900} !important`,
                fontWeight: 400,
                borderColor: theme.palette.background.neutral.neutral200,
                borderRadius: "12px",
                fontSize: "16px"
            },
        },
        "& .Mui-error": {
            border: "1px solid",
            borderColor: theme.palette.background.secondary.secondary200,
            fontSize: "16px",
            fontWeight: 400,
            borderRadius: "12px",
            backgroundColor: theme.palette.background.secondary.secondary50,
            color:theme.palette.text.secondary.secondary400 
        },
    },
    readOnlyInput: {
        "& .MuiInputBase-input[readonly]": {
          backgroundColor: theme.palette.background.neutral.neutral50,
          color: `${theme.palette.text.neutral.neutral900} !important`,
        },
    },

    "@media (max-width: 767px)": {
        textField: {
            "& .MuiInputBase-root": {
                border: "1px solid",
                borderColor: theme.palette.background.neutral.neutral200,
                fontSize: "14px",
                fontWeight: 400,
                borderRadius: "6px",
                "&:hover": {
                    borderColor: theme.palette.background.primary.primary300,
                    borderWidth: 1,
                    outline: "none",
                },
                "& .MuiInputBase-input": {
                    // padding: "16px",
                    padding:"13px 12px",
                    "&::placeholder": {
                        color: `${theme.palette.text.neutral.neutral400} !important`,
                        fontWeight: 400
                    },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                    outline: "none",
                    borderWidth: 0,
                    borderColor: theme.palette.background.primary.primary300,
                },
                "&:focus-within": {
                    outline: "none",
                    borderColor: theme.palette.background.primary.primary300,
                    borderWidth: 2,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    outline: "none",
                    borderWidth: 0,
                    borderColor: theme.palette.background.primary.primary300,
                },
                "& .Mui-disabled": {
                    fontWeight: 400,
                    borderColor: theme.palette.background.neutral.neutral200,
                    borderRadius: "6px",
                    color: `${theme.palette.text.neutral.neutral900} !important`,
                    fontSize: "14px",
                },
            },
            "& .Mui-error": {
                border: "1px solid",
                borderColor: theme.palette.border.secondary.secondary200,
                fontSize: "14px",
                fontWeight: 400,
                borderRadius: "6px",
                backgroundColor: theme.palette.background.secondary.secondary50,
                color:theme.palette.text.secondary.secondary400 
            }
        },
        label: {
            color: theme.palette.text.neutral.neutral700,
            fontSize: "14px",
            lineHeight: "16.1px"
        },
    },
}));

const TextField = styled((props: TextFieldProps) => {
    const classes = useStyles();
    return (
        <div className={`flex flex-col gap-1 w-auto relative ${props.disabled ? 'pointer-events-none select-none': ''}`}>
            {props.label && (
                <div className={classes.label}>
                    {props.label}
                </div>
            )}
            <MuiTextField {...props} label="" className={`${classes.textField} ${props.InputProps?.readOnly ? classes.readOnlyInput : ''}`} helperText={null} />
            {props.error && !!props.helperText && <ErrorMessage message={props.helperText as string} size={props.size as string} />}
        </div>
    );
})();
export default TextField;