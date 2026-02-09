import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";

import { MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";
import { StatusOptions, Status } from "../../../utils/types";
import type { TemplateRequest, TemplateResponse } from "../../../services/useTemplateService";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";

interface TemplateFormProps {
  onSubmit: (values: TemplateRequest) => void;
  mode: string;
  template?: TemplateResponse | null;
  loading?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  subject: Yup.string().required("Subject is required"),
  body: Yup.string().required("Body is required"),
  type: Yup.string().required("Type is required"),
  status: Yup.string().required("Status is required"),
});

const templateTypes = [
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "SMS" },
  { value: "NOTIFICATION", label: "Notification" },
];

const TemplateForm: React.FC<TemplateFormProps> = ({
  onSubmit,
  mode,
  template,
  loading = false,
}) => {
  const navigate = useNavigate();

  const formik = useFormik<TemplateRequest>({
    initialValues: {
      name: template?.name ?? "",
      subject: template?.subject ?? "",
      body: template?.body ?? "",
      type: template?.type ?? "",
      status: template?.status ?? Status.ACTIVE,
    },
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (template) {
      formik.setValues(template);
    }
  }, [template]);

  return (
    <div className="mb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === MODE.ADD ? "Create Template" : mode === MODE.EDIT ? "Edit Template" : "Template Details"}
        </h2>
        <p className="text-gray-600">
          Manage email, SMS, and notification templates
        </p>
      </div>
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Template Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name ? String(formik.errors.name) : ""}
              disabled={mode === MODE.VIEW}
            />
            <AutoCompleteInput
              label="Template Type"
              placeHolder="Search and select a template type"
              options={templateTypes}
              value={templateTypes.find(option => option.value === formik.values.type) || null}
              onSearch={() => { }}
              onChange={value => {
                formik.setFieldValue("type", value?.value ?? null);
              }}
              isDisabled={false}
            />
          </div>
          <div className="mt-6">
            <TextField
              label="Subject"
              name="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.subject && Boolean(formik.errors.subject)}
              helperText={formik.touched.subject && formik.errors.subject ? String(formik.errors.subject) : ""}
              disabled={mode === MODE.VIEW}
              fullWidth
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
            Template Body
          </h3>
          <RichTextEditor
            value={formik.values.body}
            onChange={(content) => formik.setFieldValue("body", content)}
            isEditMode={mode !== MODE.VIEW}
          />
          {formik.touched.body && formik.errors.body && (
            <div className="mt-2 text-sm text-red-600">
              {formik.errors.body}
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
            Status
          </h3>
          <CustomRadioGroup
            label="Template Status"
            name="status"
            value={formik.values.status}
            onChange={(e) =>
              formik.setFieldValue("status", e.target.value)
            }
            options={StatusOptions}
            disabled={mode === MODE.VIEW}
          />
        </div>
        <div className="flex justify-between gap-3 pt-4">
          <Button
            label="Cancel"
            variant="tertiaryContained"
            onClick={() =>
              navigate(makeRoute(ADMIN_ROUTES.TEMPLATES, {}))
            }
            disabled={loading}
          />
          {mode !== MODE.VIEW && (
            <Button
              label={mode === MODE.ADD ? "Add" : "Update"}
              variant="primaryContained"
              onClick={() => formik.handleSubmit()}
              disabled={loading || !formik.isValid}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;
