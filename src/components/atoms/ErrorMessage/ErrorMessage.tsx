import React from 'react'
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
    errorBig: {
        color: theme.palette.text.secondary.secondary500,
        position: 'absolute',
        marginTop: '95px'
    },
    errorSmall: {
        color: theme.palette.text.secondary.secondary500,
        position: 'absolute',
        marginTop: '70px'
    },
    "@media (max-width: 767px)": {
        errorSmall: {
            color: "#EF0000",
            position:'relative',marginTop:'0px',
        },
}
}));

interface ErrorMessageProps {
    message?: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    const classes = useStyles();
    return (
        <div className={`${classes.errorSmall} text-xs`}>{message}</div>
    )
}

export default ErrorMessage