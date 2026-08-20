import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import DatePicker from "../../atoms/DatePicker/DatePicker";
import { MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import { type Publication, type PublicationRequest } from "../../../services/usePublicationService";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import { useColors } from "../../../utils/types";
import FormShell from "../Shared/FormShell.template";

const PUBLICATION_TYPES = [
    { label: "Paper", value: "PAPER" },
    { label: "Article", value: "ARTICLE" },
    { label: "Talk", value: "TALK" },
    { label: "Video", value: "VIDEO" },
    { label: "Podcast", value: "PODCAST" },
];

const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    type: Yup.string().required("Type is required"),
    url: Yup.string().url("Enter a valid URL"),
});

interface PublicationFormProps {
    onSubmit: (values: PublicationRequest) => Promise<void>;
    mode: string;
    publication?: Publication | null;
}

const PublicationFormTemplate = ({
    onSubmit,
    mode,
    publication,
}: PublicationFormProps) => {
    const navigate = useNavigate();
    const colors = useColors();

    const onClose = () => navigate(ADMIN_ROUTES.PUBLICATIONS);

    const formik = useFormik<PublicationRequest>({
        initialValues: {
            title: publication?.title || "",
            type: publication?.type || "",
            url: publication?.url || "",
            publisher: publication?.publisher || "",
            publishedDate: publication?.publishedDate || "",
            description: publication?.description || "",
            coAuthors: publication?.coAuthors || "",
            sortOrder: publication?.sortOrder ?? 0,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            if (mode !== MODE.VIEW) await onSubmit(values);
            setSubmitting(false);
        },
    });

    const cardStyle: React.CSSProperties = {
        background: colors.neutral0,
        border: `1.5px solid ${colors.neutral300}`,
    };

    const sectionTitleStyle: React.CSSProperties = {
        color: colors.neutral800,
    };

    return (
        <FormShell
            title={mode === MODE.ADD ? "Add Publication" : mode === MODE.EDIT ? "Edit Publication" : "Publication Details"}
            subtitle={mode === MODE.ADD ? "Add a publication, talk, or article" : mode === MODE.EDIT ? "Update publication information" : "View publication information"}
            onBack={() => navigate(-1)}
        >
            <div className="px-3 py-4 sm:p-6 space-y-6 sm:space-y-8">
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Title"
                            placeholder="Enter Title"
                            value={formik.values.title}
                            onChange={e => formik.setFieldValue("title", titleModification(e.target.value))}
                            required={true}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={Boolean(formik.touched.title && formik.errors.title) ? formik.errors.title : ""}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Publisher"
                            placeholder="Enter Publisher / Conference / Journal"
                            {...formik.getFieldProps("publisher")}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                    <div className="mt-6">
                        <TextField
                            label="URL"
                            placeholder="https://..."
                            {...formik.getFieldProps("url")}
                            error={formik.touched.url && Boolean(formik.errors.url)}
                            helperText={Boolean(formik.touched.url && formik.errors.url) ? formik.errors.url : ""}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>

                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.secondary500 }} />
                        Publication Type
                    </h3>
                    <CustomRadioGroup
                        name="type"
                        label=""
                        options={PUBLICATION_TYPES}
                        value={formik.values.type || ''}
                        onChange={formik.handleChange}
                        disabled={mode === MODE.VIEW}
                    />
                    {formik.touched.type && formik.errors.type && (
                        <p style={{ color: colors.error400, fontSize: "12px", marginTop: "4px" }}>{formik.errors.type}</p>
                    )}
                </div>

                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.success500 }} />
                        Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DatePicker
                            label="Published Date"
                            value={formik.values.publishedDate ? dayjs(formik.values.publishedDate) : null}
                            onChange={v => formik.setFieldValue("publishedDate", v?.format("YYYY-MM-DD") ?? "")}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Sort Order"
                            placeholder="0"
                            type="number"
                            value={formik.values.sortOrder ?? 0}
                            onChange={e => formik.setFieldValue("sortOrder", Number(e.target.value))}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                    <div className="mt-6">
                        <TextField
                            label="Co-Authors"
                            placeholder="John Doe, Jane Smith"
                            {...formik.getFieldProps("coAuthors")}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                    <div className="mt-6">
                        <TextField
                            label="Description"
                            placeholder="Brief description of the publication"
                            {...formik.getFieldProps("description")}
                            multiline
                            rows={4}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>

                <div className="flex justify-between gap-3">
                    <Button
                        label="Cancel"
                        variant="tertiaryContained"
                        onClick={onClose}
                    />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? "Add" : "Update"}
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting}
                        />
                    )}
                </div>
            </div>
        </FormShell>
    );
};

export default PublicationFormTemplate;
