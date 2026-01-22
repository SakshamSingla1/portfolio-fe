import { useMemo, useState, useEffect } from "react";
import { useFormik } from "formik";
import dayjs from "dayjs";
import * as Yup from "yup";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import DatePicker from "../../atoms/DatePicker/DatePicker";
import { MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import {
    type Project,
    type ProjectResponse,
    WorkStatusType,
    WorkStatusOptions,
} from "../../../services/useProjectService";
import { useSkillService, type SkillDropdown } from "../../../services/useSkillService";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import Chip from "../../atoms/Chip/Chip";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";
import { type ImageValue } from "../../../utils/types";
import { useProjectService } from "../../../services/useProjectService";

const validationSchema = Yup.object({
    projectName: Yup.string()
        .required("Project name is required")
        .max(100, "Project name is too long"),

    projectDescription: Yup.string().max(500, "Project description is too long"),

    projectLink: Yup.string()
        .required("Project link is required")
        .url("Must be a valid URL"),

    skillIds: Yup.array()
        .of(Yup.number())
        .min(1, "At least one technology is required"),

    projectStartDate: Yup.date().required("Start date is required"),

    projectEndDate: Yup.date()
        .min(Yup.ref("projectStartDate"), "End date must be after start date")
        .nullable(),

    workStatus: Yup.string().required("Work status is required"),

    projectImages: Yup.array().of(Yup.object({
        url: Yup.string().required("Image URL is required"),
        publicId: Yup.string().required("Image public ID is required"),
    })).nullable(),
});

interface ProjectFormProps {
    onSubmit: (values: Project) => void;
    mode: string;
    projects?: ProjectResponse | null;
}

const ProjectFormTemplate = ({ onSubmit, mode, projects }: ProjectFormProps) => {
    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();

    const skillService = useSkillService();
    const projectService = useProjectService();

    const [skills, setSkills] = useState<SkillDropdown[]>([]);

    const onClose = () => navigate(ADMIN_ROUTES.PROJECTS);

    const formik = useFormik<Project>({
        initialValues: {
            profileId: String(user?.id),
            projectName: "",
            projectDescription: "",
            projectLink: "",
            projectStartDate: "",
            projectEndDate: "",
            workStatus: "",
            projectImages: [],
            skillIds: [],
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            if (mode !== MODE.VIEW) {
                await onSubmit(values);
            } else {
                onClose();
            }
            setSubmitting(false);
        },
    });

    const addProjectImage = (image: ImageValue | null) => {
        if (!image) return;
        formik.setFieldValue("projectImages", [
            ...formik.values.projectImages,
            image,
        ]);
    };

    const removeProjectImage = (index: number) => {
        const updated = [...formik.values.projectImages];
        updated.splice(index, 1);
        formik.setFieldValue("projectImages", updated);
    };

    const uploadProjectImage = async (file: File) => {
        return await projectService.uploadProjectImage(file);
    };

    const loadSkillsDropdown = async (search?: string) => {
        try {
            const response = await skillService.getByProfile({ search: search || "" });
            if (response?.status === HTTP_STATUS.OK) {
                setSkills(response.data.data.content || []);
            } else {
                setSkills([]);
            }
        } catch (err) {
            console.error(err);
            setSkills([]);
        }
    };

    useEffect(() => {
        loadSkillsDropdown();
    }, []);

    const skillOptions = useMemo(
        () =>
            skills.map(skill => ({
                label: (
                    <div className="flex items-center gap-2">
                        <img src={skill.logoUrl} className="w-6 h-6" />
                        {skill.logoName}
                    </div>
                ),
                title: skill.logoName,
                value: skill.id,
            })),
        [skills]
    );

    const selectedSkills = useMemo(
        () => skills.filter(skill => formik.values.skillIds.includes(skill.id)),
        [skills, formik.values.skillIds]
    );

    /* ---------------- EDIT MODE ---------------- */

    useEffect(() => {
        if (!projects) return;

        formik.setValues({
            profileId: String(user?.id),
            projectName: projects.projectName || "",
            projectDescription: projects.projectDescription || "",
            projectLink: projects.projectLink || "",
            projectStartDate: projects.projectStartDate || "",
            projectEndDate: projects.projectEndDate || "",
            workStatus: projects.workStatus || WorkStatusType.CURRENT,
            projectImages: projects.projectImages || [],
            skillIds: projects.skills?.map(s => s.id) || [],
        });
    }, [projects]);

    /* ---------------- UI ---------------- */

    return (
        <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
                {mode === MODE.ADD
                    ? "Create New Project"
                    : mode === MODE.EDIT
                        ? "Edit Project"
                        : "Project Details"}
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-8">

                {/* BASIC INFO */}
                <div className="bg-white p-6 rounded-xl border">
                    <TextField
                        label="Project Name"
                        {...formik.getFieldProps("projectName")}
                        error={Boolean(formik.touched.projectName && formik.errors.projectName)}
                        helperText={formik.errors.projectName}
                        disabled={mode === MODE.VIEW}
                        onBlur={e =>
                            formik.setFieldValue(
                                "projectName",
                                titleModification(e.target.value.trim())
                            )
                        }
                    />
                    <TextField
                        label="Project Link"
                        {...formik.getFieldProps("projectLink")}
                        error={Boolean(formik.touched.projectLink && formik.errors.projectLink)}
                        helperText={formik.errors.projectLink}
                        disabled={mode === MODE.VIEW}
                    />
                </div>

                {/* TECHNOLOGIES */}
                <div className="bg-white p-6 rounded-xl border">
                    <AutoCompleteInput
                        label="Technologies Used"
                        options={skillOptions}
                        value={null}
                        onChange={(option: any) => {
                            if (
                                option &&
                                !formik.values.skillIds.includes(option.value)
                            ) {
                                formik.setFieldValue("skillIds", [
                                    ...formik.values.skillIds,
                                    option.value,
                                ]);
                            }
                        }}
                        onSearch={loadSkillsDropdown}
                        isDisabled={mode === MODE.VIEW}
                    />

                    <div className="flex flex-wrap gap-2 mt-4">
                        {selectedSkills.map(skill => (
                            <Chip
                                key={skill.id}
                                label={
                                    <div className="flex items-center gap-2">
                                        <img src={skill.logoUrl} className="w-5 h-5" />
                                        {skill.logoName}
                                    </div>
                                }
                                onDelete={() =>
                                    formik.setFieldValue(
                                        "skillIds",
                                        formik.values.skillIds.filter(id => id !== skill.id)
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="bg-white p-6 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DatePicker
                        label="Start Date"
                        value={formik.values.projectStartDate ? dayjs(formik.values.projectStartDate) : null}
                        onChange={v => formik.setFieldValue("projectStartDate", v?.toDate())}
                        disabled={mode === MODE.VIEW}
                    />

                    <DatePicker
                        label="End Date"
                        value={formik.values.projectEndDate ? dayjs(formik.values.projectEndDate) : null}
                        onChange={v => formik.setFieldValue("projectEndDate", v?.toDate())}
                        disabled={mode === MODE.VIEW}
                    />

                    <AutoCompleteInput
                        label="Work Status"
                        options={WorkStatusOptions}
                        value={WorkStatusOptions.find(o => o.value === formik.values.workStatus) || null}
                        onChange={(o: any) => formik.setFieldValue("workStatus", o.value)}
                        onSearch={() => { }}
                        isDisabled={mode === MODE.VIEW}
                    />
                </div>

                {/* PROJECT IMAGES */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="text-lg font-semibold mb-4">Project Images</h3>

                    <ImageUpload
                        label="Upload Project Image"
                        value={null}
                        onChange={addProjectImage}
                        onUpload={uploadProjectImage}
                        disabled={mode === MODE.VIEW}
                        helperText="Upload high quality screenshots of your project"
                    />

                    {formik.values.projectImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {formik.values.projectImages.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img.url}
                                        className="w-full h-32 object-cover rounded-lg border"
                                    />
                                    {mode !== MODE.VIEW && (
                                        <button
                                            type="button"
                                            onClick={() => removeProjectImage(index)}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* DESCRIPTION */}
                <div className="bg-white p-6 rounded-xl border">
                    <RichTextEditor
                        value={formik.values.projectDescription}
                        onChange={v => formik.setFieldValue("projectDescription", v)}
                        readonly={mode === MODE.VIEW}
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between">
                    <Button label="Cancel" variant="tertiaryContained" onClick={onClose} />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? "Add" : "Update"}
                            variant="primaryContained"
                            type="submit"
                            disabled={!formik.isValid || formik.isSubmitting}
                        />
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProjectFormTemplate;
