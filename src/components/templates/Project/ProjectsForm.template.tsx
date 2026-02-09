import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import DatePicker from "../../atoms/DatePicker/DatePicker";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import Chip from "../../atoms/Chip/Chip";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";

import { MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import { HTTP_STATUS, type ImageValue } from "../../../utils/types";

import {
    type Project,
    type ProjectResponse,
    WorkStatusOptions,
    WorkStatusType,
    useProjectService,
} from "../../../services/useProjectService";
import {
    useSkillService,
    type SkillDropdown,
} from "../../../services/useSkillService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { FiTrash2 } from "react-icons/fi";

const validationSchema = Yup.object({
    projectName: Yup.string().required("Project name is required"),
    projectLink: Yup.string().required("Project link is required").url(),
    projectDescription: Yup.string().required("Project description is required").min(120, "Description is too short"),
    skillIds: Yup.array().of(Yup.string()).min(1, "Select at least one technology"),
    projectStartDate: Yup.date().required("Start date is required"),
    projectEndDate: Yup.date()
        .min(Yup.ref("projectStartDate"), "End date must be after start date")
        .nullable(),
    workStatus: Yup.string().required("Work status is required"),
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
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const onClose = () => navigate(ADMIN_ROUTES.PROJECTS);

    const formik = useFormik<Project>({
        initialValues: {
            profileId: user?.id?.toString() || "",
            projectName: "",
            projectDescription: "",
            githubRepositories: [],
            projectLink: "",
            projectStartDate: "",
            projectEndDate: "",
            workStatus: WorkStatusType.CURRENT,
            projectImages: [],
            skillIds: [],
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            if (mode !== MODE.VIEW) await onSubmit(values);
            else onClose();
            setSubmitting(false);
        },
    });

    const loadSkills = async (search = "") => {
        try {
            const res = await skillService.getByProfile({ search });
            setSkills(res?.status === HTTP_STATUS.OK ? res.data.data.content : []);
        } catch {
            setSkills([]);
        }
    };

    const uploadProjectImage = async (file: File, index?: number) => {
        setIsUploading(true);
        try {
            const response = await projectService.uploadProjectImage(file);
            if (response.status === HTTP_STATUS.OK) {
                addProjectImage(
                    { url: response.data.data.url, publicId: response.data.data.publicId },
                    index
                );
                return response.data.data;
            }
            throw new Error("Upload failed");
        } catch {
            throw new Error("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const addProjectImage = (image: ImageValue | ImageValue[] | null, index?: number) => {
        if (!image) return;
        const imagesToAdd = Array.isArray(image) ? image : [image];
        if (typeof index === "number") {
            const updated = [...formik.values.projectImages];
            updated[index] = imagesToAdd[0];
            formik.setFieldValue("projectImages", updated);
        } else {
            formik.setFieldValue("projectImages", [
                ...formik.values.projectImages,
                ...imagesToAdd,
            ]);
        }
    };

    const skillOptions = useMemo(
        () =>
            skills.map(skill => ({
                label: (
                    <div className="flex items-center gap-2">
                        <img src={skill.logoUrl} className="w-6 h-6" />
                        {skill.logoName}
                    </div>
                ),
                value: skill.id,
                title: skill.logoName,
            })),
        [skills]
    );

    const selectedSkills = useMemo(
        () => skills.filter(s => formik.values.skillIds.includes(s.id)),
        [skills, formik.values.skillIds]
    );

    const removeProjectImage = (index: number) => {
        const newImages = [...formik.values.projectImages];
        newImages.splice(index, 1);
        formik.setFieldValue("projectImages", newImages);
    };

    const addGithubRepo = () => {
        formik.setFieldValue("githubRepositories", [
            ...formik.values.githubRepositories,
            "",
        ]);
    };

    const updateGithubRepo = (index: number, value: string) => {
        const updated = [...formik.values.githubRepositories];
        updated[index] = value;
        formik.setFieldValue("githubRepositories", updated);
    };

    const removeGithubRepo = (index: number) => {
        const updated = [...formik.values.githubRepositories];
        updated.splice(index, 1);
        formik.setFieldValue("githubRepositories", updated);
    };


    useEffect(() => {
        loadSkills();
    }, []);

    useEffect(() => {
        if (!projects) return;
        formik.setValues({
            profileId: user?.id?.toString() || "",
            projectName: projects.projectName || "",
            projectDescription: projects.projectDescription || "",
            githubRepositories: projects.githubRepositories || [],
            projectLink: projects.projectLink || "",
            projectStartDate: projects.projectStartDate || "",
            projectEndDate: projects.projectEndDate || "",
            workStatus: projects.workStatus || WorkStatusType.CURRENT,
            projectImages: projects.projectImages || [],
            skillIds: projects.skills?.map(s => s.id) || [],
        });
    }, [projects]);

    return (
        <div className="mb-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD
                        ? "Add Project"
                        : mode === MODE.EDIT
                            ? "Edit Project"
                            : "Project Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.ADD
                        ? "Showcase your work and contributions"
                        : mode === MODE.EDIT
                            ? "Update project details"
                            : "View project information"}
                </p>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                        Basic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Project Name"
                            {...formik.getFieldProps("projectName")}
                            onChange={e =>
                                formik.setFieldValue(
                                    "projectName",
                                    titleModification(e.target.value)
                                )
                            }
                            error={formik.touched.projectName && Boolean(formik.errors.projectName)}
                            disabled={mode === MODE.VIEW}
                        />

                        <TextField
                            label="Project Link"
                            {...formik.getFieldProps("projectLink")}
                            error={formik.touched.projectLink && Boolean(formik.errors.projectLink)}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        Technologies Used
                    </h3>

                    <AutoCompleteInput
                        label="Add Technology"
                        options={skillOptions}
                        value={null}
                        onSearch={loadSkills}
                        onChange={(o: any) => {
                            if (o && !formik.values.skillIds.includes(o.value)) {
                                formik.setFieldValue("skillIds", [
                                    ...formik.values.skillIds,
                                    o.value,
                                ]);
                            }
                        }}
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
                                disabled={mode === MODE.VIEW}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                        Timeline
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DatePicker
                            label="Start Date"
                            value={
                                formik.values.projectStartDate
                                    ? dayjs(formik.values.projectStartDate)
                                    : null
                            }
                            onChange={v =>
                                formik.setFieldValue("projectStartDate", v?.toDate())
                            }
                            disabled={mode === MODE.VIEW}
                        />

                        <DatePicker
                            label="End Date"
                            value={
                                formik.values.projectEndDate
                                    ? dayjs(formik.values.projectEndDate)
                                    : null
                            }
                            onChange={v =>
                                formik.setFieldValue("projectEndDate", v?.toDate())
                            }
                            disabled={mode === MODE.VIEW || formik.values.workStatus === WorkStatusType.CURRENT}
                        />

                        <AutoCompleteInput
                            label="Work Status"
                            options={WorkStatusOptions}
                            value={WorkStatusOptions.find(
                                o => o.value === formik.values.workStatus
                            )}
                            onSearch={() => { }}
                            onChange={(o: any) =>
                                formik.setFieldValue("workStatus", o.value)
                            }
                            isDisabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                        GitHub Repositories
                    </h3>

                    {(formik.values.githubRepositories.length
                        ? formik.values.githubRepositories
                        : [""]).map((repo, index) => (
                            <div key={index} className="flex items-center gap-3 mb-3">
                                <TextField
                                    label={`Repository ${index + 1}`}
                                    value={repo}
                                    onChange={e =>
                                        updateGithubRepo(index, e.target.value)
                                    }
                                    placeholder="https://github.com/username/repo"
                                    disabled={mode === MODE.VIEW}
                                    className="flex-1"
                                />
                                {formik.values.githubRepositories.length > 1 &&
                                    mode !== MODE.VIEW && (
                                        <button
                                            onClick={() => removeGithubRepo(index)}
                                            className="p-2 bg-red-50 text-red-500 rounded"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                            </div>
                        ))}

                    {mode !== MODE.VIEW && (
                        <Button
                            label="Add Repository"
                            variant="primaryContained"
                            onClick={addGithubRepo}
                        />
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" aria-hidden="true" />
                        Project Images
                    </h3>
                    {(formik.values.projectImages.length > 0 ? formik.values.projectImages : [null]).map((image, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <ImageUpload
                                label={`Image ${index + 1}`}
                                value={image}
                                onChange={() => { }}
                                onUpload={(file) => uploadProjectImage(file, index)}
                                disabled={mode === MODE.VIEW || isUploading}
                                maxSize={5}
                                aspectRatio="wide"
                                helperText="Project image · Max 5MB"
                            />
                            {formik.values.projectImages.length > 1 && mode !== MODE.VIEW && (
                                <button
                                    onClick={() => removeProjectImage(index)}
                                    className="p-2 bg-red-50 text-red-500 rounded hover:bg-red-100"
                                >
                                    <FiTrash2 />
                                </button>
                            )}
                        </div>
                    ))}
                    {mode !== MODE.VIEW && (
                        <Button
                            label="Add Another Image"
                            variant="primaryContained"
                            onClick={() =>
                                formik.setFieldValue("projectImages", [...formik.values.projectImages, null])
                            }
                            disabled={isUploading}
                        />
                    )}
                </div>


                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mr-3" />
                        Project Description
                    </h3>

                    <RichTextEditor
                        value={formik.values.projectDescription}
                        onChange={v => formik.setFieldValue("projectDescription", v)}
                        isEditMode={mode !== MODE.VIEW}
                    />
                </div>

                <div className="flex justify-between gap-3">
                    <Button label="Cancel" variant="tertiaryContained" onClick={onClose} />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? "Add" : "Update"}
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting || !formik.isValid}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectFormTemplate;
