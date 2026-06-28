import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { HTTP_STATUS } from "../../../utils/types";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useTemplateService } from "../../../services/useTemplateService";
import type { INotificationTemplateFormPayload } from "../../../services/useTemplateService";
import TemplateFormTemplate from "../../templates/Templates/TemplateForm.template";

const validationSchema = Yup.object().shape({
    template: Yup.string().max(45, "Template name cannot exceed 45 characters").required("Template name is required"),
});

const TemplateCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const templateService = useTemplateService();

    const formik = useFormik<INotificationTemplateFormPayload>({
        initialValues: {
            template: "",
            isSms: 0,
            isEmail: 0,
            isWhatsapp: 0,
            message: "",
            messageTo: "",
            subject: "",
            messageBody: "",
            emailTo: "",
            emailCc: "",
            emailBcc: "",
            emailReplyTo: "",
            whatsappTemplateName: "",
            whatsappTemplateBody: "",
            additionalData: "",
            dltTemplateId: "",
            templateGroupId: null,
        },
        validationSchema,
        validateOnMount: true,
        onSubmit: async (values) => {
            try {
                const res = await templateService.createTemplate(values);
                if (res?.status === HTTP_STATUS.OK) {
                    showSnackbar("success", "Notification template created");
                    navigate(ADMIN_ROUTES.TEMPLATES);
                }
            } catch {
                showSnackbar("error", "Failed to create notification template");
                formik.setSubmitting(false);
            }
        },
    });

    return (
        <div className="grid gap-y-4">
            <div className="text-2xl font-medium my-auto pageTitle">Add Notification Template</div>
            <TemplateFormTemplate formik={formik} mode={MODE.ADD} />
        </div>
    );
};

export default TemplateCreatePage;
