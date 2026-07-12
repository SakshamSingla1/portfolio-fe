import React, { useMemo, useCallback } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination, useColors } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute, DateUtils } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { type BlogPostSummary, BlogStatus } from "../../../services/useBlogPostService";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { TbArticle } from "react-icons/tb";

interface IBlogPostTableTemplateProps {
    posts: BlogPostSummary[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    onDelete?: (id: number) => Promise<void>;
    filterContent?: React.ReactNode;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors = useColors();

    const config: Record<string, { bg: string; text: string; dot: string }> = {
        PUBLISHED: { bg: `${colors.success500}18`, text: colors.success700 ?? colors.success500, dot: colors.success500 },
        DRAFT:     { bg: `${colors.warning500}18`, text: colors.warning700 ?? colors.warning500, dot: colors.warning500 },
        ARCHIVED:  { bg: `${colors.neutral400}18`, text: colors.neutral600 ?? colors.neutral500, dot: colors.neutral500 },
    };
    const c = config[status] ?? config.ARCHIVED;

    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 9px", borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" as const,
            background: c.bg, color: c.text, whiteSpace: "nowrap" as const,
        }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
            {status}
        </span>
    );
};

const TagPills: React.FC<{ tags: { id: number; name: string }[] }> = ({ tags }) => {
    const colors = useColors();
    if (!tags?.length) return <span style={{ color: colors.neutral400, fontSize: 12 }}>—</span>;
    const shown = tags.slice(0, 3);
    const extra = tags.length - shown.length;
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {shown.map(t => (
                <span key={t.id} style={{
                    padding: "2px 8px", borderRadius: 999,
                    fontSize: 11, fontWeight: 500,
                    background: `${colors.primary500}15`,
                    color: colors.primary600 ?? colors.primary500,
                    border: `1px solid ${colors.primary500}25`,
                    whiteSpace: "nowrap" as const,
                }}>
                    {t.name}
                </span>
            ))}
            {extra > 0 && (
                <span style={{
                    padding: "2px 8px", borderRadius: 999,
                    fontSize: 11, fontWeight: 500,
                    background: `${colors.neutral400}15`,
                    color: colors.neutral500,
                    whiteSpace: "nowrap" as const,
                }}>
                    +{extra}
                </span>
            )}
        </div>
    );
};

const PostTitleCell: React.FC<{ post: BlogPostSummary }> = ({ post }) => {
    const colors = useColors();
    return (
        <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: colors.neutral800, lineHeight: 1.3 }}>
                {post.title}
            </div>
            {post.excerpt && (
                <div style={{
                    fontSize: 12, color: colors.neutral500, marginTop: 2,
                    lineHeight: 1.4,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    maxWidth: 340,
                }}>
                    {post.excerpt}
                </div>
            )}
        </div>
    );
};

const ViewsCell: React.FC<{ views: number }> = ({ views }) => {
    const colors = useColors();
    if (!views) return <span style={{ color: colors.neutral400, fontSize: 13 }}>—</span>;
    const formatted = views >= 1000 ? `${(views / 1000).toFixed(1)}k` : String(views);
    return <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 13, color: colors.neutral600 }}>{formatted}</span>;
};

const BlogPostTableTemplate: React.FC<IBlogPostTableTemplateProps> = ({
    posts,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
    onDelete,
    filterContent,
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();

    const preservedQuery = useCallback(() => ({
        page: searchParams.get("page") || "",
        size: searchParams.get("size") || "",
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || "",
    }), [searchParams]);

    const handleEdit = useCallback((id: number) => {
        navigate(makeRoute(ADMIN_ROUTES.BLOGS_EDIT, { params: { id: String(id) }, query: preservedQuery() }));
    }, [navigate, preservedQuery]);

    const handleView = useCallback((id: number) => {
        navigate(makeRoute(ADMIN_ROUTES.BLOGS_VIEW, { params: { id: String(id) }, query: preservedQuery() }));
    }, [navigate, preservedQuery]);

    const records = useMemo(() => posts.map((post, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        <PostTitleCell key={`title-${post.id}`} post={post} />,
        <StatusBadge key={`status-${post.id}`} status={post.status} />,
        <TagPills key={`tags-${post.id}`} tags={post.tags ?? []} />,
        <ViewsCell key={`views-${post.id}`} views={post.viewCount} />,
        post.readTimeMins != null ? `${post.readTimeMins}m` : "—",
        post.status === BlogStatus.PUBLISHED && post.publishedAt
            ? DateUtils.dateTimeSecondToDate(post.publishedAt)
            : DateUtils.dateTimeSecondToDate(post.createdAt ?? ""),
        <ActionButtons
            key={`actions-${post.id}`}
            onEdit={() => handleEdit(post.id)}
            onView={() => handleView(post.id)}
            onDelete={onDelete ? () => onDelete(post.id) : undefined}
        />,
    ]), [posts, pagination.currentPage, pagination.pageSize, handleEdit, handleView, onDelete]);

    const schema = useMemo(() => ({
        id: 1,
        mobileView: isMobile ? "cards" as const : "responsive" as const,
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: handlePaginationChange,
            handleChangeRowsPerPage: handleRowsPerPageChange,
        },
        columns: [
            { label: "Sr No.", key: "sr",        type: "number" as ColumnType, props: { className: "" }, priority: "low" as const,    hideOnMobile: true },
            { label: "Post",    key: "title",     type: "custom" as ColumnType, props: { className: "" }, priority: "high" as const },
            { label: "Status",  key: "status",    type: "custom" as ColumnType, props: { className: "" }, priority: "high" as const },
            { label: "Tags",    key: "tags",      type: "custom" as ColumnType, props: { className: "" }, priority: "medium" as const, hideOnMobile: true },
            { label: "Views",   key: "views",     type: "custom" as ColumnType, props: { className: "" }, priority: "low" as const,    hideOnMobile: true },
            { label: "Read",    key: "readTime",  type: "text" as ColumnType,   props: { className: "" }, priority: "low" as const,    hideOnMobile: true },
            { label: "Date",    key: "date",      type: "date" as ColumnType,   props: { className: "" }, priority: "medium" as const },
            { label: "Actions", key: "actions",   type: "custom" as ColumnType, props: { className: "" }, priority: "high" as const },
        ],
        hover: true,
        striped: true,
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <ListingShell
            title="Blog Posts"
            icon={<TbArticle />}
            description="Write, publish, and manage your articles"
            count={pagination.totalRecords}
            isAddButtonVisible
            addButtonLabel="New Post"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.BLOGS_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filterContent={filterContent}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
};

export default BlogPostTableTemplate;
