import React from "react";
import { useColors } from "../../../utils/types";

export interface RadioOption {
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

export interface CustomRadioGroupProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    label?: string;
    required?: boolean;
    options: RadioOption[];
    variant?: "default" | "pills" | "cards";
    orientation?: "horizontal" | "vertical";
}

// ── Radio indicator ─────────────────────────────────────────────────────────────
// Pure CSS transition — no external animation library
const RadioDot: React.FC<{
    selected: boolean;
    colors: ReturnType<typeof useColors>;
}> = ({ selected, colors }) => (
    <span
        style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: `2px solid ${selected ? colors.primary500 : colors.neutral300}`,
            background: colors.neutral0,
            transition: "border-color 0.2s ease",
            boxSizing: "border-box",
        }}
    >
        <span
            style={{
                display: "block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: colors.primary500,
                // CSS-only spring-like pop: scale + opacity driven by `selected`
                transform: selected ? "scale(1)" : "scale(0)",
                opacity: selected ? 1 : 0,
                transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease",
            }}
        />
    </span>
);

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
    name,
    value,
    onChange,
    onBlur,
    error = false,
    helperText,
    disabled = false,
    label,
    required = false,
    options,
    variant = "default",
    orientation = "horizontal",
}) => {
    const colors = useColors();

    const fireChange = (optionValue: string) => {
        if (disabled) return;
        onChange({
            target: { name, value: optionValue },
            currentTarget: { name, value: optionValue },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    const onKeyDown = (e: React.KeyboardEvent, v: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fireChange(v);
        }
    };

    const FieldLabel = label ? (
        <span
            style={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                color: colors.neutral700,
                marginBottom: 10,
            }}
        >
            {label}
            {required && (
                <span style={{ color: colors.error500, marginLeft: 4 }}>*</span>
            )}
        </span>
    ) : null;

    const ErrorMsg = error && helperText ? (
        <p style={{ fontSize: 12, color: colors.error500, marginTop: 6 }}>
            {helperText}
        </p>
    ) : null;

    // ── Default ─────────────────────────────────────────────────────────────────
    if (variant === "default") {
        return (
            <div>
                {FieldLabel}
                <div
                    role="radiogroup"
                    aria-label={label}
                    style={{
                        display: "flex",
                        flexDirection: orientation === "vertical" ? "column" : "row",
                        flexWrap: "wrap",
                        gap: orientation === "vertical" ? 12 : 20,
                    }}
                >
                    {options.map((opt) => {
                        const sel = value === opt.value;
                        return (
                            <label
                                key={opt.value}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 10,
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    opacity: disabled ? 0.5 : 1,
                                    userSelect: "none",
                                }}
                            >
                                {/* Visually hidden native radio for a11y */}
                                <input
                                    type="radio"
                                    name={name}
                                    value={opt.value}
                                    checked={sel}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    disabled={disabled}
                                    style={{
                                        position: "absolute",
                                        width: 1,
                                        height: 1,
                                        opacity: 0,
                                        pointerEvents: "none",
                                    }}
                                />
                                <span style={{ marginTop: 1 }}>
                                    <RadioDot selected={sel} colors={colors} />
                                </span>
                                <div>
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: colors.neutral800,
                                            lineHeight: "20px",
                                        }}
                                    >
                                        {opt.label}
                                    </span>
                                    {opt.description && (
                                        <p
                                            style={{
                                                fontSize: 12,
                                                color: colors.neutral400,
                                                margin: "2px 0 0",
                                            }}
                                        >
                                            {opt.description}
                                        </p>
                                    )}
                                </div>
                            </label>
                        );
                    })}
                </div>
                {ErrorMsg}
            </div>
        );
    }

    // ── Pills ───────────────────────────────────────────────────────────────────
    if (variant === "pills") {
        return (
            <div>
                {FieldLabel}
                <div
                    role="radiogroup"
                    aria-label={label}
                    style={{
                        display: "flex",
                        flexDirection: orientation === "vertical" ? "column" : "row",
                        flexWrap: "wrap",
                        gap: 8,
                    }}
                >
                    {options.map((opt) => {
                        const sel = value === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                role="radio"
                                aria-checked={sel}
                                disabled={disabled}
                                onClick={() => fireChange(opt.value)}
                                onKeyDown={(e) => onKeyDown(e, opt.value)}
                                onBlur={(e) =>
                                    onBlur?.(e as unknown as React.FocusEvent<HTMLInputElement>)
                                }
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 14px",
                                    borderRadius: 10,
                                    border: `1.5px solid ${sel ? colors.primary400 : colors.neutral200}`,
                                    background: colors.neutral0,
                                    color: colors.neutral700,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    opacity: disabled ? 0.5 : 1,
                                    outline: "none",
                                    userSelect: "none",
                                    boxShadow: sel
                                        ? `0 0 0 3px ${colors.primary100}`
                                        : `0 1px 2px ${colors.neutral100}`,
                                    transition:
                                        "border-color 0.2s ease, box-shadow 0.2s ease",
                                }}
                            >
                                <RadioDot selected={sel} colors={colors} />
                                {opt.icon && (
                                    <span
                                        style={{
                                            display: "flex",
                                            color: colors.neutral500,
                                        }}
                                    >
                                        {opt.icon}
                                    </span>
                                )}
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
                {ErrorMsg}
            </div>
        );
    }

    // ── Cards ───────────────────────────────────────────────────────────────────
    return (
        <div>
            {FieldLabel}
            <div
                role="radiogroup"
                aria-label={label}
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        orientation === "vertical"
                            ? "1fr"
                            : "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: 12,
                }}
            >
                {options.map((opt) => {
                    const sel = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={sel}
                            disabled={disabled}
                            onClick={() => fireChange(opt.value)}
                            onKeyDown={(e) => onKeyDown(e, opt.value)}
                            onBlur={(e) =>
                                onBlur?.(e as unknown as React.FocusEvent<HTMLInputElement>)
                            }
                            style={{
                                position: "relative",
                                textAlign: "left",
                                padding: 16,
                                borderRadius: 12,
                                border: `1.5px solid ${sel ? colors.primary400 : colors.neutral200}`,
                                background: colors.neutral0,
                                cursor: disabled ? "not-allowed" : "pointer",
                                opacity: disabled ? 0.5 : 1,
                                outline: "none",
                                userSelect: "none",
                                boxShadow: sel
                                    ? `0 0 0 3px ${colors.primary100}, 0 2px 8px ${colors.neutral100}`
                                    : `0 1px 3px ${colors.neutral100}`,
                                transition:
                                    "border-color 0.2s ease, box-shadow 0.2s ease",
                            }}
                        >
                            {/* Checkmark circle — top right */}
                            <span
                                style={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `2px solid ${sel ? colors.primary500 : colors.neutral300}`,
                                    background: sel ? colors.primary500 : "transparent",
                                    transition: "all 0.2s ease",
                                    boxSizing: "border-box",
                                }}
                            >
                                {/* SVG checkmark — CSS opacity transition, no library */}
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                    style={{
                                        opacity: sel ? 1 : 0,
                                        transform: sel ? "scale(1)" : "scale(0.5)",
                                        transition:
                                            "opacity 0.15s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                    }}
                                >
                                    <path
                                        d="M2 5l2.5 2.5L8 3"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>

                            {opt.icon && (
                                <div
                                    style={{
                                        marginBottom: 8,
                                        fontSize: 20,
                                        color: sel ? colors.primary500 : colors.neutral400,
                                        transition: "color 0.18s ease",
                                    }}
                                >
                                    {opt.icon}
                                </div>
                            )}

                            <p
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    paddingRight: 28,
                                    color: colors.neutral800,
                                    margin: 0,
                                    lineHeight: "20px",
                                }}
                            >
                                {opt.label}
                            </p>

                            {opt.description && (
                                <p
                                    style={{
                                        fontSize: 12,
                                        paddingRight: 28,
                                        color: colors.neutral400,
                                        margin: "4px 0 0",
                                        lineHeight: "16px",
                                    }}
                                >
                                    {opt.description}
                                </p>
                            )}
                        </button>
                    );
                })}
            </div>
            {ErrorMsg}
        </div>
    );
};

export default CustomRadioGroup;
