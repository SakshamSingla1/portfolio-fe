import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { HTTP_STATUS } from "../../../utils/types";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { makeRoute, isRichTextEmpty } from "../../../utils/helper";
import { useTemplateService } from "../../../services/useTemplateService";
import type { INotificationTemplateFormPayload } from "../../../services/useTemplateService";
import TemplateFormTemplate from "../../templates/Templates/TemplateForm.template";

// Each channel's fields are only meaningful (and required) once that channel
// is switched on — a template with the Email channel enabled but no subject,
// or WhatsApp enabled but no Meta-approved template name, can't actually send.
const validationSchema = Yup.object().shape({
    template: Yup.string().max(45, "Template name cannot exceed 45 characters").required("Template name is required"),
    subject: Yup.string().when("isEmail", {
        is: 1,
        then: (schema) => schema.required("Subject is required when the Email channel is enabled"),
    }),
    messageBody: Yup.string().when("isEmail", {
        is: 1,
        then: (schema) => schema.test("not-empty", "Email body is required when the Email channel is enabled", (v) => !isRichTextEmpty(v)),
    }),
    emailTo: Yup.string().email("Enter a valid email address"),
    emailCc: Yup.string().email("Enter a valid email address"),
    emailBcc: Yup.string().email("Enter a valid email address"),
    emailReplyTo: Yup.string().email("Enter a valid email address"),
    message: Yup.string().when("isSms", {
        is: 1,
        then: (schema) => schema.test("not-empty", "SMS body is required when the SMS channel is enabled", (v) => !isRichTextEmpty(v)),
    }),
    whatsappTemplateName: Yup.string().when("isWhatsapp", {
        is: 1,
        then: (schema) => schema.required("Meta-approved template name is required when the WhatsApp channel is enabled"),
    }),
    whatsappTemplateBody: Yup.string().when("isWhatsapp", {
        is: 1,
        then: (schema) => schema.test("not-empty", "Template body is required when the WhatsApp channel is enabled", (v) => !isRichTextEmpty(v)),
    }),
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

    const { setValues } = formik;

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
        const loadTemplate = async () => {
            try {
                const res = await templateService.getTemplateById(Number(id));
                if (res?.status === HTTP_STATUS.OK) {
                    const d = res.data.data;
                    setValues({
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
        loadTemplate();
    }, [id, templateService, setValues, showSnackbar]);

    return (
        <div className="grid gap-y-4">
            <div className="text-2xl font-medium my-auto pageTitle">Update Notification Template</div>
            <TemplateFormTemplate formik={formik} mode={MODE.EDIT} />
        </div>
    );
};

export default TemplateEditPage;
