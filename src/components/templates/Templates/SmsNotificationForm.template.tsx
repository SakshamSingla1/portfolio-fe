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

const SmsNotificationForm: React.FC<Props> = ({ formik, setEditorRef }) => {
    const isOn = formik.values.isSms === 1;
    const plain = (formik.values.message || "").replace(/<[^>]*>/g, "");
    const segments = Math.max(1, Math.ceil(plain.length / 160));
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
                name="isSms"
                label="SMS Channel"
                value={String(formik.values.isSms ?? 0)}
                onChange={(e) =>
                    formik.setFieldValue("isSms", Number(e.target.value))
                }
                options={CHANNEL_OPTIONS}
                variant="pills"
            />

            {isOn && (
                <>
                    <TextField
                        fullWidth
                        label="SMS To"
                        placeholder="+91 98765 43210 or {{phoneNumber}}"
                        {...formik.getFieldProps("messageTo")}
                    />

                    <div style={{ display: "grid", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 14, fontWeight: 500, color: colors.neutral700 }}>
                                SMS Body
                            </span>
                            {plain.length > 0 && (
                                <span style={{ fontSize: 12, color: colors.neutral400 }}>
                                    {plain.length} chars · {segments}{" "}
                                    {segments === 1 ? "segment" : "segments"}
                                    {segments > 1 && (
                                        <span style={{ marginLeft: 4, color: colors.warning600 }}>
                                            (multi-part)
                                        </span>
                                    )}
                                </span>
                            )}
                        </div>
                        <NotificationBodyEditor
                            value={formik.values.message || ""}
                            onBlur={(content) => formik.setFieldValue("message", content)}
                            onEditorReady={setEditorRef}
                            placeholder="Compose your SMS… keep it under 160 chars per segment"
                            minHeight={180}
                        />
                    </div>

                    <TextField
                        fullWidth
                        label="DLT Template ID"
                        placeholder="Enter DLT registered template ID (India)"
                        {...formik.getFieldProps("dltTemplateId")}
                    />
                </>
            )}
        </div>
    );
};

export default SmsNotificationForm;
