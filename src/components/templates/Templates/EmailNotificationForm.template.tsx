import React, { useState } from "react";
import type { FormikProps } from "formik";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import TextField from "../../atoms/TextField/TextField";
import NotificationBodyEditor from "../../molecules/NotificationBodyEditor/NotificationBodyEditor";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import type { INotificationTemplateFormPayload } from "../../../services/useTemplateService";

interface Props {
    formik: FormikProps<INotificationTemplateFormPayload>;
    setEditorRef: (editor: any) => void;
    insertVariable: (varName: string) => void;
}

const CHANNEL_OPTIONS = [
    { value: "1", label: "Enabled"  },
    { value: "0", label: "Disabled" },
];

const EmailNotificationForm: React.FC<Props> = ({ formik, setEditorRef }) => {
    const isOn = formik.values.isEmail === 1;
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const colors = useColors();

    return (
        <div
            style={{
                display: "grid",
                gap: 20,
                padding: 20,
                borderRadius: 12,
                border: `1.5px solid ${colors.neutral200}`,
            }}
        >
            <CustomRadioGroup
                name="isEmail"
                label="Email Channel"
                value={String(formik.values.isEmail ?? 0)}
                onChange={(e) =>
                    formik.setFieldValue("isEmail", Number(e.target.value))
                }
                options={CHANNEL_OPTIONS}
                variant="pills"
            />

            {isOn && (
                <>
                    <TextField
                        fullWidth
                        label="Subject *"
                        placeholder="e.g. Hello {{fullName}}, your code is {{otp}}"
                        {...formik.getFieldProps("subject")}
                    />

                    <div style={{ display: "grid", gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: colors.neutral700 }}>
                            Email Body
                            <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 400, color: colors.neutral400 }}>
                                — use variable chips below to insert dynamic values
                            </span>
                        </span>
                        <NotificationBodyEditor
                            value={formik.values.messageBody || ""}
                            onBlur={(content) =>
                                formik.setFieldValue("messageBody", content)
                            }
                            onEditorReady={setEditorRef}
                            placeholder="Compose your email body… use {{variableName}} for dynamic content"
                        />
                    </div>

                    {/* Advanced fields — collapsible */}
                    <div
                        style={{
                            borderRadius: 8,
                            overflow: "hidden",
                            border: `1px solid ${colors.neutral200}`,
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setAdvancedOpen((v) => !v)}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 16px",
                                fontSize: 14,
                                fontWeight: 500,
                                color: colors.neutral600,
                                background: advancedOpen ? colors.neutral100 : "transparent",
                                border: "none",
                                cursor: "pointer",
                                transition: "background 0.15s ease",
                            }}
                        >
                            <span>Advanced (To / CC / BCC / Reply-To)</span>
                            {advancedOpen
                                ? <FiChevronUp size={16} />
                                : <FiChevronDown size={16} />
                            }
                        </button>

                        {advancedOpen && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 16,
                                    padding: 16,
                                    borderTop: `1px solid ${colors.neutral200}`,
                                    background: colors.neutral50,
                                }}
                            >
                                <TextField fullWidth label="Email To"  placeholder="recipient@example.com" {...formik.getFieldProps("emailTo")} />
                                <TextField fullWidth label="Email CC"  placeholder="cc@example.com"        {...formik.getFieldProps("emailCc")} />
                                <TextField fullWidth label="Email BCC" placeholder="bcc@example.com"       {...formik.getFieldProps("emailBcc")} />
                                <TextField fullWidth label="Reply-To"  placeholder="reply@example.com"     {...formik.getFieldProps("emailReplyTo")} />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default EmailNotificationForm;
