import React from "react";
import type { FormikProps } from "formik";
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

const WhatsappNotificationForm: React.FC<Props> = ({ formik, setEditorRef }) => {
    const isOn = formik.values.isWhatsapp === 1;
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
                name="isWhatsapp"
                label="WhatsApp Channel"
                value={String(formik.values.isWhatsapp ?? 0)}
                onChange={(e) =>
                    formik.setFieldValue("isWhatsapp", Number(e.target.value))
                }
                options={CHANNEL_OPTIONS}
                variant="pills"
            />

            {isOn && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <TextField
                            fullWidth
                            label="WhatsApp To"
                            placeholder="+91 98765 43210 or {{phoneNumber}}"
                            {...formik.getFieldProps("messageTo")}
                        />
                        <TextField
                            fullWidth
                            label="Template Name (Meta-approved)"
                            placeholder="e.g. otp_verification"
                            {...formik.getFieldProps("whatsappTemplateName")}
                        />
                    </div>

                    <div style={{ display: "grid", gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: colors.neutral700 }}>
                            Template Body
                            <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 400, color: colors.neutral400 }}>
                                — must match your Meta-approved template exactly
                            </span>
                        </span>
                        <NotificationBodyEditor
                            value={formik.values.whatsappTemplateBody || ""}
                            onBlur={(content) => formik.setFieldValue("whatsappTemplateBody", content)}
                            onEditorReady={setEditorRef}
                            placeholder="Compose your WhatsApp template body… use {{variableName}} for dynamic content"
                            minHeight={200}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default WhatsappNotificationForm;
