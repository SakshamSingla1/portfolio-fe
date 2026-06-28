import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { HTTP_STATUS } from "../../../utils/types";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";
import { useTemplateService } from "../../../services/useTemplateService";
import type { INotificationTemplateFormPayload } from "../../../services/useTemplateService";
import TemplateFormTemplate from "../../templates/Templates/TemplateForm.template";

const validationSchema = Yup.object().shape({
    template: Yup.string().required("Template name is required"),
});

const TemplateEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
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
        onSubmit: async (values) => {
            try {
                const res = await templateService.updateTemplateById(Number(id), values);
                if (res?.status === HTTP_STATUS.OK) {
                    showSnackbar("success", "Notification template updated");
                    onClose();
                } else {
                    showSnackbar("error", res?.data?.statusMessage ?? "Update failed");
                }
            } catch (err) {
                showSnackbar("error", `${err}`);
            }
        },
    });

    const loadTemplate = async () => {
        try {
            const res = await templateService.getTemplateById(Number(id));
            if (res?.status === HTTP_STATUS.OK) {
                const d = res.data.data;
                formik.setValues({
                    template: d.template,
                    message: d.message,
                    messageTo: d.messageTo,
                    subject: d.subject,
                    messageBody: d.messageBody,
                    emailTo: d.emailTo,
                    emailCc: d.emailCc,
                    emailBcc: d.emailBcc,
                    emailReplyTo: d.emailReplyTo,
                    isSms: d.isSms,
                    isEmail: d.isEmail,
                    isWhatsapp: d.isWhatsapp,
                    whatsappTemplateName: d.whatsappTemplateName,
                    whatsappTemplateBody: d.whatsappTemplateBody,
                    additionalData: d.additionalData,
                    dltTemplateId: d.dltTemplateId,
                    templateGroupId: d.templateGroupId,
                });
            }
        } catch (err) {
            showSnackbar("error", `${err}`);
        }
    };

    const onClose = () => {
        navigate(makeRoute(ADMIN_ROUTES.TEMPLATES, {
            query: {
                page: searchParams.get("page") || "",
                size: searchParams.get("size") || "",
                search: searchParams.get("search") || "",
            },
        }));
    };

    useEffect(() => {
        loadTemplate();
    }, [id]);

    return (
        <div className="grid gap-y-4">
            <div className="text-2xl font-medium my-auto pageTitle">Update Notification Template</div>
            <TemplateFormTemplate formik={formik} mode={MODE.EDIT} />
        </div>
    );
};

export default TemplateEditPage;
