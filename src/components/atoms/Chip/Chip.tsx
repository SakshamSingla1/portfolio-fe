import { type ReactNode } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { createUseStyles } from "react-jss";
import { useColors } from "../../../utils/types";

interface ChipProps {
    label: string | ReactNode;
    onDelete: () => void;
}

const useStyles = createUseStyles({
    chip: (colors: any) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
        backgroundColor: colors.neutral100,
        color: colors.neutral800,
        border: `1px solid ${colors.neutral200}`,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            backgroundColor: colors.neutral200,
        },
    }),

    deleteBtn: (colors: any) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        color: colors.neutral500,
        transition: "color 0.2s ease",
        "&:hover": {
            color: colors.error500,
        },
        "&:focus-visible": {
            outline: "none",
            boxShadow: `0 0 0 2px ${colors.primary100}`,
            borderRadius: "50%",
        },
    }),
});

const Chip = ({ label, onDelete }: ChipProps) => {
    const colors = useColors();
    const classes = useStyles(colors);

    return (
        <div className={classes.chip}>
            <span>{label}</span>
            <button
                type="button"
                onClick={onDelete}
                className={classes.deleteBtn}
                aria-label={`Remove ${typeof label === "string" ? label : "item"}`}
            >
                <FaTimesCircle size={14} />
            </button>
        </div>
    );
};

export default Chip;
