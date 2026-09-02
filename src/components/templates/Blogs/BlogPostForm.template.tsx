import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";
import Button from "../../atoms/Button/Button";
import FormShell from "../Shared/FormShell.template";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { isRichTextEmpty } from "../../../utils/helper";
import { useColors } from "../../../utils/types";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useIsMobile } from "../../../hooks/useIsMobile";
import {
    BlogStatus,
    type BlogPostRequest,
    type BlogPostResponse,
} from "../../../services/useBlogPostService";
import { useBlogTagService, type BlogTagResponse } from "../../../services/useBlogTagService";
import type { ImageUploadResponse } from "../../../services/useProfileService";
import {
    FiTrash2, FiHash, FiPlus, FiLoader, FiX, FiMinus,
} from "react-icons/fi";

const generateSlug = (title: string) =>
    title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const wordCount = (html: string) => {
    const text = stripHtml(html);
    return text ? text.split(" ").filter(Boolean).length : 0;
};

interface BlogPostFormValues {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: string;
    readTimeMins: string;
    tagIds: number[];
}

export interface BlogPostFormTemplateProps {
    onSubmit: (values: BlogPostRequest, coverFile: File | null) => Promise<void>;
    onDelete?: () => Promise<void>;
    mode: string;
    post?: BlogPostResponse | null;
}

const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    slug: Yup.string()
        .required("Slug is required")
        .matches(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Lowercase letters, numbers, and hyphens only"
        ),
    content: Yup.string().test(
        "content-required",
        "Post content is required",
        (v) => !isRichTextEmpty(v)
    ),
    status: Yup.string().required("Status is required"),
    excerpt: Yup.string().max(500, "Max 500 characters").nullable(),
    readTimeMins: Yup.number()
        .typeError("Must be a number")
        .min(1, "Min 1 minute")
        .max(999)
        .nullable(),
});

const STATUS_OPTIONS = [
    { value: BlogStatus.DRAFT, label: "Draft", icon: "✏️", hint: "Not visible to visitors." },
    { value: BlogStatus.PUBLISHED, label: "Published", icon: "🌐", hint: "Live to all visitors." },
    { value: BlogStatus.ARCHIVED, label: "Archived", icon: "📦", hint: "Hidden from listings." },
];

const BlogPostFormTemplate: React.FC<BlogPostFormTemplateProps> = ({
    onSubmit,
    onDelete,
    mode,
    post,
}) => {
    const navigate = useNavigate();
    const colors = useColors();
    const { user } = useAuthenticatedUser();
    const tagService = useBlogTagService();
    const isMobile = useIsMobile();

    const [tagOptions, setTagOptions] = useState<BlogTagResponse[]>([]);
    const [selectedTags, setSelectedTags] = useState<BlogTagResponse[]>([]);
    const [tagCreating, setTagCreating] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
    const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
    const isMountedRef = useRef(true);
    const slugManuallyEdited = useRef(false);
    const submitIntentRef = useRef<"save" | "publish">("save");

    useEffect(() => {
        return () => { isMountedRef.current = false; };
    }, []);

    useEffect(() => {
        tagService.getAll({ size: 200 }).then((res) => {
            if (res?.data?.data?.content) setTagOptions(res.data.data.content);
        });
    }, [tagService]);

    useEffect(() => {
        if (post?.tags) setSelectedTags(post.tags);
        if (post) slugManuallyEdited.current = true;
    }, [post]);

    useEffect(() => {
        return () => {
            if (coverPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(coverPreviewUrl);
        };
    }, [coverPreviewUrl]);

    const formik = useFormik<BlogPostFormValues>({
        initialValues: {
            title: post?.title ?? "",
            slug: post?.slug ?? "",
            content: post?.content ?? "",
            excerpt: post?.excerpt ?? "",
            status: post?.status ?? BlogStatus.DRAFT,
            readTimeMins: post?.readTimeMins != null ? String(post.readTimeMins) : "",
            tagIds: post?.tags?.map((t) => t.id) ?? [],
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            const status =
                submitIntentRef.current === "publish"
                    ? BlogStatus.PUBLISHED
                    : (values.status as BlogPostRequest["status"]);

            const payload: BlogPostRequest = {
                title: values.title,
                slug: values.slug,
                content: isRichTextEmpty(values.content) ? "" : values.content,
                excerpt: values.excerpt || null,
                status,
                readTimeMins: values.readTimeMins ? Number(values.readTimeMins) : null,
                tagIds: values.tagIds,
            };

            await onSubmit(payload, pendingCoverFile);

            if (isMountedRef.current) {
                setSubmitting(false);
            }
        },
    });

    const { setFieldValue } = formik;

    const handleContentChange = useCallback(
        (value: string) => setFieldValue("content", value),
        [setFieldValue]
    );

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        formik.setFieldValue("title", title);
        if (!slugManuallyEdited.current) {
            formik.setFieldValue("slug", generateSlug(title));
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        slugManuallyEdited.current = true;
        formik.setFieldValue(
            "slug",
            e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
        );
    };

    const handleCoverUpload = async (file: File): Promise<ImageUploadResponse> => {
        const url = URL.createObjectURL(file);
        setPendingCoverFile(file);
        setCoverPreviewUrl(url);
        return { url, publicId: "" };
    };

    const handleCoverClear = () => {
        if (coverPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(coverPreviewUrl);
        setPendingCoverFile(null);
        setCoverPreviewUrl(null);
    };

    const handleSaveDraft = () => {
        submitIntentRef.current = "save";
        formik.handleSubmit();
    };

    const handlePublish = () => {
        submitIntentRef.current = "publish";
        formik.handleSubmit();
    };

    const addTag = (tag: BlogTagResponse) => {
        if (selectedTags.some((s) => s.id === tag.id)) return;
        const next = [...selectedTags, tag];
        setSelectedTags(next);
        formik.setFieldValue("tagIds", next.map((t) => t.id));
    };

    const removeTag = (tagId: number) => {
        const next = selectedTags.filter((t) => t.id !== tagId);
        setSelectedTags(next);
        formik.setFieldValue("tagIds", next.map((t) => t.id));
    };

    const handleAddTag = async (name?: string) => {
        const trimmed = (name ?? tagInput).trim();
        if (!trimmed) return;
        const existing = tagOptions.find(
            (t) => t.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (existing) {
            addTag(existing);
            setTagInput("");
            return;
        }
        setTagCreating(true);
        try {
            const res = await tagService.create({ name: trimmed });
            const newTag: BlogTagResponse = res?.data?.data;
            if (newTag?.id) {
                setTagOptions((prev) => [...prev, newTag]);
                addTag(newTag);
            }
        } finally {
            setTagCreating(false);
            setTagInput("");
        }
    };

    const autoReadTime = () => {
        const wc = wordCount(formik.values.content);
        formik.setFieldValue("readTimeMins", String(Math.max(1, Math.round(wc / 200))));
    };

    const isView = mode === MODE.VIEW;
    const usernameSlug = user?.userName ?? "you";
    const wc = wordCount(formik.values.content);
    const readEstimate = Math.max(1, Math.round(wc / 200));

    const statusColors = {
        [BlogStatus.DRAFT]: {
            bg: `${colors.warning500}18`,
            text: colors.warning700 ?? colors.warning500,
            dot: colors.warning500,
        },
        [BlogStatus.PUBLISHED]: {
            bg: `${colors.success500}18`,
            text: colors.success700 ?? colors.success500,
            dot: colors.success500,
        },
        [BlogStatus.ARCHIVED]: {
            bg: `${colors.neutral300}30`,
            text: colors.neutral500,
            dot: colors.neutral400,
        },
    } as Record<string, { bg: string; text: string; dot: string }>;

    const coverValue =
        coverPreviewUrl
            ? { url: coverPreviewUrl, publicId: "" }
            : post?.coverImageUrl
            ? { url: post.coverImageUrl, publicId: "" }
            : null;

    const onClose = () => navigate(ADMIN_ROUTES.BLOGS);

    const cardStyle: React.CSSProperties = {
        background: colors.neutral0,
        border: `1.5px solid ${colors.neutral300}`,
    };

    const sectionTitleStyle: React.CSSProperties = {
        color: colors.neutral800,
    };

    return (
        <>
        <style>{`
            @keyframes spin { to { transform: rotate(360deg) } }
        `}</style>
        <FormShell
            title={
                mode === MODE.ADD
                    ? "New Blog Post"
                    : mode === MODE.EDIT
                    ? "Edit Blog Post"
                    : "Blog Post Details"
            }
            subtitle={
                mode === MODE.ADD
                    ? "Write and publish a new blog post"
                    : mode === MODE.EDIT
                    ? "Update your blog post content and settings"
                    : "View blog post details"
            }
            breadcrumb="Blogs"
            onBack={() => navigate(-1)}
        >
            <div className="px-3 py-4 sm:p-6 space-y-6">

                {/* ── Two-column grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: 24, alignItems: "start" }}>

                    {/* ── LEFT COLUMN ── */}
                    <div className="flex flex-col gap-5">

                        <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                            <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                                Post Details
                            </h3>
                            <div className="flex flex-col gap-6">

                                <div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase" as const, color: colors.neutral400 }}>
                                            Title <span style={{ color: colors.error500 }}>*</span>
                                        </label>
                                        <span style={{ fontSize: 11, color: formik.values.title.length > 100 ? colors.warning500 : colors.neutral400, fontVariantNumeric: "tabular-nums" }}>
                                            {formik.values.title.length}
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Your post title goes here…"
                                        value={formik.values.title}
                                        onChange={handleTitleChange}
                                        onBlur={() => formik.setFieldTouched("title", true)}
                                        disabled={isView}
                                        className="w-full outline-none font-bold"
                                        style={{
                                            display: "block", width: "100%",
                                            fontSize: 26, lineHeight: 1.25, letterSpacing: "-.5px",
                                            background: "transparent", border: "none",
                                            borderBottom: `2.5px solid ${formik.touched.title && formik.errors.title ? colors.error500 : colors.neutral200}`,
                                            color: colors.neutral800, fontFamily: "inherit",
                                            padding: "6px 0 12px", boxSizing: "border-box" as const,
                                        }}
                                    />
                                    {formik.touched.title && formik.errors.title && (
                                        <p style={{ fontSize: 12, color: colors.error500, marginTop: 4 }}>{formik.errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase" as const, color: colors.neutral400, display: "block", marginBottom: 8 }}>
                                        Slug <span style={{ color: colors.error500 }}>*</span>
                                    </label>
                                    <div style={{ display: "flex", alignItems: "stretch", border: `1.5px solid ${formik.touched.slug && formik.errors.slug ? colors.error500 : colors.neutral200}`, borderRadius: 8, overflow: "hidden", background: colors.neutral0 }}>
                                        <span style={{ padding: "9px 10px 9px 13px", background: colors.neutral50, borderRight: `1px solid ${colors.neutral200}`, color: colors.neutral400, fontSize: 12, fontFamily: '"SF Mono","Fira Code",Consolas,monospace', whiteSpace: "nowrap" as const, display: "flex", alignItems: "center" }}>
                                            /@{usernameSlug}/blog/
                                        </span>
                                        <input
                                            type="text"
                                            value={formik.values.slug}
                                            onChange={handleSlugChange}
                                            onBlur={() => formik.setFieldTouched("slug", true)}
                                            disabled={isView}
                                            className="flex-1 outline-none bg-transparent min-w-0"
                                            style={{ padding: "9px 13px", border: "none", color: colors.neutral700, fontFamily: '"SF Mono","Fira Code",Consolas,monospace', fontSize: 12 }}
                                        />
                                    </div>
                                    {formik.touched.slug && formik.errors.slug ? (
                                        <p style={{ fontSize: 12, color: colors.error500, marginTop: 4 }}>{formik.errors.slug}</p>
                                    ) : (
                                        <p style={{ fontSize: 11, color: colors.neutral400, marginTop: 5 }}>Auto-generated from title · edit to customise</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={{ ...cardStyle, overflow: "visible" }}>
                            <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.secondary500 }} />
                                Content
                            </h3>
                            <RichTextEditor
                                label=""
                                placeholder="Write your blog post content here…"
                                value={formik.values.content}
                                onChange={handleContentChange}
                                isEditMode={!isView}
                                error={formik.touched.content && Boolean(formik.errors.content)}
                                helperText={Boolean(formik.touched.content && formik.errors.content) ? formik.errors.content : ""}
                                required
                            />
                            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${colors.neutral100}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
                                <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: `${colors.primary500}12`, color: colors.primary500, border: `1px solid ${colors.primary500}20` }}>
                                    {wc} words
                                </span>
                                <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: `${colors.secondary500}12`, color: colors.secondary500, border: `1px solid ${colors.secondary500}20` }}>
                                    ~{readEstimate} min read
                                </span>
                                <span style={{ marginLeft: "auto", fontSize: 11, color: colors.neutral400 }}>Rich text · HTML</span>
                            </div>
                        </div>

                        <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center" style={sectionTitleStyle}>
                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.warning500 }} />
                                    Excerpt
                                </h3>
                                <span style={{ fontSize: 11, fontVariantNumeric: "tabular-nums", color: formik.values.excerpt.length > 450 ? colors.warning500 : colors.neutral400, fontWeight: 600 }}>
                                    {formik.values.excerpt.length} / 500
                                </span>
                            </div>
                            <textarea
                                placeholder="A concise summary shown on the blog listing page…"
                                value={formik.values.excerpt}
                                onChange={(e) => formik.setFieldValue("excerpt", e.target.value)}
                                onBlur={() => formik.setFieldTouched("excerpt", true)}
                                disabled={isView}
                                rows={3}
                                maxLength={500}
                                className="w-full outline-none resize-none"
                                style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${formik.touched.excerpt && formik.errors.excerpt ? colors.error500 : colors.neutral200}`, borderRadius: 8, background: colors.neutral50, color: colors.neutral700, fontFamily: "inherit", fontSize: 14, lineHeight: 1.6, boxSizing: "border-box" as const }}
                            />
                            <div style={{ marginTop: 8, height: 3, background: `${colors.neutral300}40`, borderRadius: 999, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${Math.min(100, (formik.values.excerpt.length / 500) * 100)}%`, background: formik.values.excerpt.length > 450 ? colors.warning500 : colors.primary500, borderRadius: 999, transition: "width .15s ease" }} />
                            </div>
                            {formik.touched.excerpt && formik.errors.excerpt && (
                                <p style={{ fontSize: 12, color: colors.error500, marginTop: 6 }}>{String(formik.errors.excerpt)}</p>
                            )}
                        </div>

                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="flex flex-col gap-4">

                        <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center" style={sectionTitleStyle}>
                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: statusColors[formik.values.status]?.dot ?? colors.warning500 }} />
                                    Status
                                </h3>
                                <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: statusColors[formik.values.status]?.bg, color: statusColors[formik.values.status]?.text, letterSpacing: ".05em", textTransform: "uppercase" as const }}>
                                    {formik.values.status}
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-3 gap-2">
                                    {STATUS_OPTIONS.map((opt) => {
                                        const sel = formik.values.status === opt.value;
                                        const os = statusColors[opt.value];
                                        return (
                                            <div key={opt.value}
                                                onClick={() => !isView && formik.setFieldValue("status", opt.value)}
                                                style={{ padding: "11px 6px", borderRadius: 10, textAlign: "center" as const, border: `2px solid ${sel ? os.dot : colors.neutral200}`, background: sel ? os.bg : colors.neutral50, cursor: isView ? "default" : "pointer", transition: "all .15s" }}>
                                                <div style={{ fontSize: 18, marginBottom: 4, lineHeight: 1 }}>{opt.icon}</div>
                                                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".5px", color: sel ? os.text : colors.neutral400, textTransform: "uppercase" as const }}>{opt.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p style={{ fontSize: 11, color: colors.neutral400, lineHeight: 1.5 }}>
                                    {STATUS_OPTIONS.find(o => o.value === formik.values.status)?.hint}
                                </p>
                            </div>
                        </div>

                        <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                            <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.success500 }} />
                                Cover Image
                            </h3>
                            <ImageUpload
                                label=""
                                value={coverValue}
                                onChange={(v) => { if (!v) handleCoverClear(); }}
                                onUpload={handleCoverUpload}
                                disabled={isView}
                                maxSize={5}
                                aspectRatio="wide"
                                helperText="PNG, JPG or WebP · max 5 MB"
                            />
                            <p style={{ fontSize: 11, color: colors.neutral400, marginTop: 8, textAlign: "center" as const, lineHeight: 1.5 }}>
                                1200 × 630 px recommended
                            </p>
                        </div>

                        <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center" style={sectionTitleStyle}>
                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                                    Tags
                                </h3>
                                {selectedTags.length > 0 && (
                                    <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 999, background: `${colors.primary500}18`, color: colors.primary600, letterSpacing: ".04em" }}>{selectedTags.length}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                {selectedTags.length > 0 && (
                                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                                        {selectedTags.map((t) => (
                                            <span key={t.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 6px 4px 10px", borderRadius: 999, background: `${colors.primary500}15`, color: colors.primary600, border: `1px solid ${colors.primary500}30`, fontSize: 12, fontWeight: 600 }}>
                                                <FiHash size={10} style={{ opacity: .7 }} />
                                                {t.name}
                                                {!isView && (
                                                    <button type="button" onClick={() => removeTag(t.id)}
                                                        className="flex items-center opacity-50 hover:opacity-100 transition-opacity"
                                                        style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "0 0 0 2px", lineHeight: 1 }}>
                                                        <FiX size={12} />
                                                    </button>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {!isView && (
                                    <div className="flex flex-col gap-2">
                                        <div style={{ display: "flex", alignItems: "center", overflow: "hidden", border: `1.5px solid ${colors.neutral200}`, borderRadius: 12, background: colors.neutral50 }}>
                                            <span style={{ display: "flex", alignItems: "center", paddingLeft: 12, color: colors.neutral400, flexShrink: 0 }}>
                                                <FiHash size={13} />
                                            </span>
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                                                placeholder="Search or type a new tag…"
                                                className="flex-1 outline-none bg-transparent"
                                                style={{ padding: "8px 8px 8px 6px", fontSize: 13, color: colors.neutral800, fontFamily: "inherit", minWidth: 0 }}
                                            />
                                            <button type="button" onClick={() => handleAddTag()} disabled={tagCreating || !tagInput.trim()}
                                                style={{ padding: "0 14px", alignSelf: "stretch" as const, background: tagInput.trim() ? colors.primary500 : colors.neutral200, color: tagInput.trim() ? colors.neutral0 : colors.neutral400, border: "none", cursor: tagInput.trim() && !tagCreating ? "pointer" : "default", fontSize: 12, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5, transition: "background .15s, color .15s" }}>
                                                {tagCreating ? <FiLoader size={13} style={{ animation: "spin 1s linear infinite" }} /> : <FiPlus size={13} />}
                                                {tagCreating ? "Adding…" : "Add"}
                                            </button>
                                        </div>
                                        {(() => {
                                            const q = tagInput.trim().toLowerCase();
                                            const matches = tagOptions.filter(t => !selectedTags.some(s => s.id === t.id) && (q ? t.name.toLowerCase().includes(q) : true));
                                            const showCreate = q && !tagOptions.some(t => t.name.toLowerCase() === q);
                                            if (!q && matches.length === 0) return null;
                                            return (
                                                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                                                    {matches.slice(0, 6).map((t) => (
                                                        <button key={t.id} type="button"
                                                            onClick={() => { addTag(t); setTagInput(""); }}
                                                            style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1px solid ${colors.neutral200}`, background: "transparent", color: colors.neutral600, cursor: "pointer", fontFamily: "inherit", transition: "all .12s" }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.primary500}12`; e.currentTarget.style.borderColor = `${colors.primary500}50`; e.currentTarget.style.color = colors.primary600; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = colors.neutral200; e.currentTarget.style.color = colors.neutral600; }}>
                                                            # {t.name}
                                                        </button>
                                                    ))}
                                                    {showCreate && (
                                                        <button type="button" onClick={() => handleAddTag()}
                                                            style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1px dashed ${colors.primary500}70`, background: `${colors.primary500}10`, color: colors.primary600, cursor: "pointer", fontFamily: "inherit" }}>
                                                            + Create "{tagInput.trim()}"
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                            <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.secondary500 }} />
                                Read Time
                            </h3>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                                {!isView && (
                                    <button type="button"
                                        onClick={() => formik.setFieldValue("readTimeMins", String(Math.max(1, Number(formik.values.readTimeMins || 1) - 1)))}
                                        style={{ width: 34, height: 34, borderRadius: 999, border: `1.5px solid ${colors.neutral200}`, background: colors.neutral50, color: colors.neutral600, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                                        <FiMinus size={15} />
                                    </button>
                                )}
                                <div style={{ textAlign: "center" as const, minWidth: 80 }}>
                                    <div style={{ fontSize: 42, fontWeight: 800, color: colors.neutral800, letterSpacing: "-2px", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                                        {formik.values.readTimeMins || "—"}
                                    </div>
                                    <div style={{ fontSize: 11, color: colors.neutral400, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase" as const, marginTop: 4 }}>
                                        {Number(formik.values.readTimeMins) === 1 ? "minute" : "minutes"}
                                    </div>
                                </div>
                                {!isView && (
                                    <button type="button"
                                        onClick={() => formik.setFieldValue("readTimeMins", String(Math.min(999, Number(formik.values.readTimeMins || 0) + 1)))}
                                        style={{ width: 34, height: 34, borderRadius: 999, border: `1.5px solid ${colors.neutral200}`, background: colors.neutral50, color: colors.neutral600, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                                        <FiPlus size={15} />
                                    </button>
                                )}
                            </div>
                            {formik.touched.readTimeMins && formik.errors.readTimeMins && (
                                <p style={{ fontSize: 12, color: colors.error500, textAlign: "center" as const, marginTop: 8 }}>{String(formik.errors.readTimeMins)}</p>
                            )}
                            {!isView && (
                                <button type="button" onClick={autoReadTime}
                                    style={{ display: "block", width: "100%", marginTop: 14, padding: "8px 0", background: `${colors.primary500}08`, border: `1px solid ${colors.primary500}20`, borderRadius: 8, color: colors.primary600, fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", textAlign: "center" as const, transition: "background .15s" }}>
                                    ⚡ Auto-calculate · {wc} words
                                </button>
                            )}
                            <p style={{ fontSize: 11, color: colors.neutral400, textAlign: "center" as const, marginTop: 10, lineHeight: 1.5 }}>
                                Estimated at ~200 wpm
                            </p>
                        </div>

                    </div>
                </div>

                {/* ── BOTTOM ACTIONS BAR ── */}
                <div className="flex justify-between gap-3">
                    <Button label="Cancel" variant="tertiaryContained" onClick={onClose} />
                    {mode !== MODE.VIEW && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {mode === MODE.EDIT && onDelete && (
                                <button type="button" onClick={onDelete}
                                    className="flex items-center gap-2 transition-all hover:opacity-80"
                                    style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", border: `1.5px solid ${colors.error500}30`, color: colors.error500, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                                    <FiTrash2 size={14} />
                                    Delete
                                </button>
                            )}
                            <Button label="Save draft" variant="tertiaryContained" onClick={handleSaveDraft} disabled={formik.isSubmitting} />
                            <Button label={mode === MODE.ADD ? "Publish" : "Update & Publish"} variant="primaryContained" onClick={handlePublish} disabled={formik.isSubmitting} isLoading={formik.isSubmitting} />
                        </div>
                    )}
                </div>

            </div>
        </FormShell>
        </>
    );
};

export default BlogPostFormTemplate;
