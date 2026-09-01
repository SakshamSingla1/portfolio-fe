import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { isRichTextEmpty, titleModification } from "../../../utils/helper";
import { HTTP_STATUS } from "../../../utils/types";
import { type Project, type ProjectResponse, WorkStatusOptions, WorkStatusType, useProjectService, } from "../../../services/useProjectService";
import { useSkillService, type SkillDropdown, } from "../../../services/useSkillService";
import { FiTrash2 } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import FormShell from "../Shared/FormShell.template";

const validationSchema = Yup.object({
    projectName: Yup.string().required("Project name is required"),
    projectLink: Yup.string().required("Project link is required").url(),
    projectDescription: Yup.string().test(
        "description-required",
        "Description is required",
        (value) => !isRichTextEmpty(value)
    ), skillIds: Yup.array().of(Yup.mixed()).min(1, "Select at least one technology"),
    projectStartDate: Yup.date().required("Start date is required"),
    projectEndDate: Yup.date()
        .min(Yup.ref("projectStartDate"), "End date must be after start date")
        .when('workStatus', {
            is: (value: string) => value === WorkStatusType.CURRENT,
            then: (schema) => schema.notRequired(),
            otherwise: (schema) => schema.required('End date is required'),
        })
        .nullable(),
    workStatus: Yup.string().required("Work status is required"),
    hasImages: Yup.boolean().oneOf([true], "At least one image is required"),
    githubRepositories: Yup.array().of(Yup.string().url("Invalid URL")).min(1, "At least one repository is required"),
});

interface ProjectFormProps {
    onSubmit: (values: Project) => Promise<void>;
    mode: string;
    projects?: ProjectResponse | null;
}

interface ProjectFormValues extends Project {
    hasImages: boolean;
}

const ProjectFormTemplate = ({ onSubmit, mode, projects }: ProjectFormProps) => {
    const navigate = useNavigate();
    const colors = useColors();

    const skillService = useSkillService();
    const projectService = useProjectService();

    const [skills, setSkills] = useState<SkillDropdown[]>([]);
    const [selectedSkillObjects, setSelectedSkillObjects] = useState<SkillDropdown[]>(projects?.skills || []);
    const [isLoadingSkills, setIsLoadingSkills] = useState(false);
    const [pendingImageFiles, setPendingImageFiles] = useState<(File | null)[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<(string | null)[]>([]);
    const skillServiceRef = useRef(skillService);
    skillServiceRef.current = skillService;

    const onClose = () => navigate(ADMIN_ROUTES.PROJECTS);

    useEffect(() => {
        return () => {
            imagePreviewUrls.forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [imagePreviewUrls]);

    const formik = useFormik<ProjectFormValues>({
        initialValues: {
            projectName: projects?.projectName || "",
            projectDescription: projects?.projectDescription || "",
            githubRepositories: projects?.githubRepositories || [],
            projectLink: projects?.projectLink || "",
            projectStartDate: projects?.projectStartDate || "",
            projectEndDate: projects?.projectEndDate || "",
            workStatus: projects?.workStatus || WorkStatusType.CURRENT,
            projectImages: projects?.projectImages || [],
            skillIds: projects?.skills?.map(s => s.id).filter((id): id is number => id !== null && id !== undefined) || [],
            hasImages: (projects?.projectImages?.length ?? 0) > 0,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const projectImages = [...values.projectImages];

            if (pendingImageFiles.some(f => f !== null)) {
                const uploadPromises = pendingImageFiles.map(async (file, index) => {
                    if (file) {
                        try {
                            const response = await projectService.uploadProjectImage(file);
                            if (response.status === HTTP_STATUS.OK) {
                                const asset = response.data.data;
                                return { index, image: { url: asset.path, publicId: asset.publicId } };
                            }
                        } catch {
                            return null;
                        }
                    }
                    return null;
                });

                const uploadResults = await Promise.all(uploadPromises);
                uploadResults.forEach(result => {
                    if (result) {
                        projectImages[result.index] = result.image;
                    }
                });
            }

            const payload = {
                projectName: values.projectName,
                projectDescription: isRichTextEmpty(values.projectDescription) ? "" : values.projectDescription,
                githubRepositories: values.githubRepositories,
                projectLink: values.projectLink,
                projectStartDate: values.projectStartDate,
                projectEndDate: values.projectEndDate,
                workStatus: values.workStatus,
                projectImages,
                skillIds: values.skillIds,
            };
            setSubmitting(true);
            if (mode !== MODE.VIEW) await onSubmit(payload);
            else onClose();
            setSubmitting(false);
        },
    });

    const { setFieldValue } = formik;

    const handleDescriptionChange = useCallback(
        (value: string) => setFieldValue("projectDescription", value),
        [setFieldValue]
    );

    const loadSkills = useCallback(async (search = "") => {
        setIsLoadingSkills(true);
        try {
            const res = await skillServiceRef.current.getByProfile({ 
                page: "0",
                size: "1000",
                search });
            setSkills(res?.status === HTTP_STATUS.OK ? res.data.data.content : []);
        } catch {
            setSkills([]);
        } finally {
            setIsLoadingSkills(false);
        }
    }, []);

    useEffect(() => {
        if (projects?.skills) {
            setSelectedSkillObjects(projects.skills);
        }
    }, [projects?.skills]);

    const uploadProjectImage = async (file: File, index?: number) => {
        const targetIndex = index ?? formik.values.projectImages.length;
        const newPendingFiles = [...pendingImageFiles];
        const newPreviewUrls = [...imagePreviewUrls];
        
        newPendingFiles[targetIndex] = file;
        newPreviewUrls[targetIndex] = URL.createObjectURL(file);
        
        setPendingImageFiles(newPendingFiles);
        setImagePreviewUrls(newPreviewUrls);
        formik.setFieldValue("hasImages", true);
        
        return { url: newPreviewUrls[targetIndex] || "", publicId: "" };
    };


    const skillOptions = useMemo(
        () =>
            skills
                .filter(skill => skill.id !== null && skill.id !== undefined && !formik.values.skillIds.includes(skill.id))
                .map(skill => ({
                    label: (
                        <div className="flex items-center gap-2">
                            <img src={skill.logoUrl} className="w-6 h-6" />
                            {skill.logoName}
                        </div>
                    ),
                    value: skill.id ?? 0,
                    title: skill.logoName,
                    original: skill,
                })),
        [skills, formik.values.skillIds]
    );

    const selectedSkillsList = useMemo(
        () => selectedSkillObjects,
        [selectedSkillObjects]
    );

    const removeProjectImage = (index: number) => {
        const newImages = [...formik.values.projectImages];
        newImages.splice(index, 1);
        formik.setFieldValue("projectImages", newImages);
        
        const newPendingFiles = [...pendingImageFiles];
        const newPreviewUrls = [...imagePreviewUrls];
        
        if (newPreviewUrls[index] && newPreviewUrls[index]?.startsWith('blob:')) {
            URL.revokeObjectURL(newPreviewUrls[index]!);
        }
        newPendingFiles.splice(index, 1);
        newPreviewUrls.splice(index, 1);
        
        setPendingImageFiles(newPendingFiles);
        setImagePreviewUrls(newPreviewUrls);
        
        if (newImages.length === 0) {
            formik.setFieldValue("hasImages", false);
        }
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
    }, [loadSkills]);

    const cardStyle: React.CSSProperties = {
        background: colors.neutral0,
        border: `1.5px solid ${colors.neutral300}`,
    };

    const sectionTitleStyle: React.CSSProperties = {
        color: colors.neutral800,
    };

    return (
        <FormShell
            title={mode === MODE.ADD ? "Add Project" : mode === MODE.EDIT ? "Edit Project" : "Project Details"}
            subtitle={mode === MODE.ADD ? "Showcase your work and contributions" : mode === MODE.EDIT ? "Update project details" : "View project information"}
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
                            label="Project Name"
                            {...formik.getFieldProps("projectName")}
                            onChange={e =>
                                formik.setFieldValue(
                                    "projectName",
                                    titleModification(e.target.value)
                                )
                            }
                            required={true}
                            error={formik.touched.projectName && Boolean(formik.errors.projectName)}
                            helperText={Boolean(formik.touched.projectName && formik.errors.projectName) ? formik.errors.projectName : ""}
                            disabled={mode === MODE.VIEW}
                        />

                        <TextField
                            label="Project Link"
                            {...formik.getFieldProps("projectLink")}
                            required={true}
                            error={formik.touched.projectLink && Boolean(formik.errors.projectLink)}
                            helperText={Boolean(formik.touched.projectLink && formik.errors.projectLink) ? formik.errors.projectLink : ""}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>

                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        Technologies Used
                    </h3>

                    <AutoCompleteInput
                        label="Add Technology"
                        placeHolder="Type to search technologies (React, Node.js, Python...)"
                        options={skillOptions}
                        value={null}
                        onSearch={loadSkills}
                        loading={isLoadingSkills}
                        onChange={(o: any) => {
                            if (o && !formik.values.skillIds.includes(o.value)) {
                                formik.setFieldValue("skillIds", [
                                    ...formik.values.skillIds,
                                    o.value,
                                ]);
                                setSelectedSkillObjects(prev => [...prev, o.original]);
                            }
                        }}
                        required={true}
                        error={formik.touched.skillIds && Boolean(formik.errors.skillIds)}
                        helperText={formik.errors.skillIds && formik.touched.skillIds ? Array.isArray(formik.errors.skillIds) ? formik.errors.skillIds.join(', ') : formik.errors.skillIds : "Search and select the technologies used in this project"}
                        isDisabled={mode === MODE.VIEW}
                    />

                    <div className="flex flex-wrap gap-2 mt-4">
                        {selectedSkillsList.map(skill => (
                            <Chip
                                key={skill.id}
                                label={
                                    <div className="flex items-center gap-2">
                                        <img src={skill.logoUrl} className="w-5 h-5" />
                                        {skill.logoName}
                                    </div>
                                }
                                onDelete={() => {
                                    formik.setFieldValue(
                                        "skillIds",
                                        formik.values.skillIds.filter(id => String(id) !== String(skill.id))
                                    );
                                    setSelectedSkillObjects(prev => prev.filter(s => String(s.id) !== String(skill.id)));
                                }}
                                disabled={mode === MODE.VIEW}
                            />
                        ))}
                    </div>
                </div>

                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                        Timeline
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DatePicker
                            label="Start Date"
                            value={formik.values.projectStartDate ? dayjs(formik.values.projectStartDate) : null}
                            onChange={v => formik.setFieldValue("projectStartDate", v?.toDate())}
                            required={true}
                            error={formik.touched.projectStartDate && Boolean(formik.errors.projectStartDate)}
                            helperText={Boolean(formik.touched.projectStartDate && formik.errors.projectStartDate) ? formik.errors.projectStartDate : ""}
                            disabled={mode === MODE.VIEW}
                        />

                        <DatePicker
                            label="End Date"
                            value={formik.values.projectEndDate ? dayjs(formik.values.projectEndDate) : null}
                            onChange={v => formik.setFieldValue("projectEndDate", v?.toDate())}
                            required={true}
                            error={formik.touched.projectEndDate && Boolean(formik.errors.projectEndDate)}
                            helperText={Boolean(formik.touched.projectEndDate && formik.errors.projectEndDate) ? formik.errors.projectEndDate : ""}
                            disabled={mode === MODE.VIEW || formik.values.workStatus === WorkStatusType.CURRENT}
                        />

                        <AutoCompleteInput
                            label="Work Status"
                            options={WorkStatusOptions}
                            value={WorkStatusOptions.find(o => o.value === formik.values.workStatus)}
                            onSearch={() => { }}
                            onChange={(o: any) => formik.setFieldValue("workStatus", o.value)}
                            required={true}
                            error={formik.touched.workStatus && Boolean(formik.errors.workStatus)}
                            helperText={Boolean(formik.touched.workStatus && formik.errors.workStatus) ? formik.errors.workStatus : ""}
                            isDisabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>

                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                        GitHub Repositories
                    </h3>
                    {(formik.values.githubRepositories.length ? formik.values.githubRepositories : [""]).map((repo, index) => {
                        return (
                            <div key={index} className="flex items-center gap-3 mb-3">
                                <TextField
                                    label={`Repository ${index + 1}`}
                                    value={repo}
                                    onChange={e => updateGithubRepo(index, e.target.value)}
                                    onBlur={() => formik.setFieldTouched(`githubRepositories.${index}`, true)}
                                    placeholder="https://github.com/username/repo"
                                    disabled={mode === MODE.VIEW}
                                    required
                                />
                                {formik.values.githubRepositories.length > 1 &&
                                    mode !== MODE.VIEW && (
                                        <button
                                            type="button"
                                            onClick={() => removeGithubRepo(index)}
                                            className="p-2 rounded transition"
                                            style={{ backgroundColor: colors.error50, color: colors.error600 }}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                            </div>
                        );
                    })}
                    {mode !== MODE.VIEW && (
                        <Button
                            label="Add Repository"
                            variant="primaryContained"
                            onClick={addGithubRepo}
                        />
                    )}
                    {typeof formik.errors.githubRepositories === "string" &&
                        formik.touched.githubRepositories && (
                            <p className="mb-3 text-xs" style={{ color: colors.error600 }}>
                                {formik.errors.githubRepositories}
                            </p>
                        )}
                </div>
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm gap-3" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 bg-orange-500 rounded-xl mr-3" />
                        Project Images
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {(formik.values.projectImages.length > 0 ? formik.values.projectImages : [null]).map((image, index) => {
                            const isPrimary = index === 0;
                            const displayValue = imagePreviewUrls[index] 
                                ? { url: imagePreviewUrls[index]!, publicId: "" }
                                : image;
                            return (
                                <div key={index} className="relative group/img-container w-[260px]">
                                    <div
                                        className="relative p-2 rounded-sm shadow-inner group-hover/img-container:shadow-xl group-hover/img-container:shadow-blue-500/5 transition-all duration-500"
                                        style={{ background: colors.neutral50, border: `1.5px solid ${colors.neutral300}` }}
                                    >
                                        <ImageUpload
                                            label={isPrimary ? "Primary Project Cover" : `Additional Asset ${index + 1}`}
                                            value={displayValue}
                                            onChange={(val) => {
                                                if (val === null) {
                                                    removeProjectImage(index);
                                                }
                                            }}
                                            onUpload={(file) => uploadProjectImage(file, index)}
                                            disabled={mode === MODE.VIEW || formik.isSubmitting}
                                            maxSize={5}
                                            aspectRatio="wide"
                                            helperText={isPrimary ? "Main visual for this project" : "Gallery asset · Max 5MB"}
                                            required={true}
                                            error={formik.submitCount > 0 && Boolean(formik.errors.hasImages)}
                                        />

                                        {isPrimary && !!displayValue && (
                                            <div className="absolute top-11 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest shadow-lg z-10 border border-white/20" style={{ backgroundColor: colors.primary600 }}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                Cover Image
                                            </div>
                                        )}

                                        {formik.values.projectImages.length > 1 && mode !== MODE.VIEW && (
                                            <button
                                                type="button"
                                                onClick={() => removeProjectImage(index)}
                                                className="absolute top-11 right-4 p-2.5 rounded-xl bg-red-500 text-white shadow-xl opacity-0 group-hover/img-container:opacity-100 transition-all duration-300 hover:scale-110 z-20 hover:bg-red-600"
                                                title="Remove image"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {mode !== MODE.VIEW && (
                        <div className="mt-3">
                            <Button
                                label="Add Another Image"
                                variant="primaryContained"
                                onClick={() => {
                                    formik.setFieldValue("projectImages", [...formik.values.projectImages, null]);
                                    setPendingImageFiles([...pendingImageFiles, null]);
                                    setImagePreviewUrls([...imagePreviewUrls, null]);
                                }}
                                disabled={formik.isSubmitting}
                            />
                        </div>
                    )}
                    {formik.submitCount > 0 && formik.errors.hasImages && (
                        <p className="mb-3 text-xs" style={{ color: colors.error600 }}>
                            {String(formik.errors.hasImages)}
                        </p>
                    )}
                </div>

                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 bg-pink-500 rounded-full mr-3" />
                        Project Description
                    </h3>

                    <RichTextEditor
                        label="Project Description"
                        placeholder="Enter Details for your project"
                        value={formik.values.projectDescription}
                        onChange={handleDescriptionChange}
                        isEditMode={mode !== MODE.VIEW}
                        error={formik.touched.projectDescription && Boolean(formik.errors.projectDescription)}
                        helperText={Boolean(formik.touched.projectDescription && formik.errors.projectDescription) ? formik.errors.projectDescription : ""}
                        required={true}
                    />
                </div>

                <div className="flex justify-between gap-3">
                    <Button label="Cancel" variant="tertiaryContained" onClick={onClose} />
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

export default React.memo(ProjectFormTemplate);
