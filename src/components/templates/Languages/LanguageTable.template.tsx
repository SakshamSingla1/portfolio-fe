import React, { useMemo, useCallback } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { ADMIN_ROUTES } from "../../../utils/constant";
import type { Language } from "../../../services/useLanguageService";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { TbLanguage } from "react-icons/tb";

interface ILanguageTableProps {
    languages: Language[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
}

const LanguageTableTemplate: React.FC<ILanguageTableProps> = ({
    languages,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();

    const query = useCallback(() => ({
        page: searchParams.get("page") || "",
        size: searchParams.get("size") || "",
        search: searchParams.get("search") || "",
    }), [searchParams]);

    const handleEdit = useCallback((id: number) => {
        navigate(makeRoute(ADMIN_ROUTES.LANGUAGES_EDIT, { params: { id: String(id) }, query: query() }));
    }, [navigate, query]);

    const handleView = useCallback((id: number) => {
        navigate(makeRoute(ADMIN_ROUTES.LANGUAGES_VIEW, { params: { id: String(id) }, query: query() }));
    }, [navigate, query]);

    const records = useMemo(() => languages.map((lang, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        lang.languageName,
        lang.proficiency,
        <ActionButtons key={lang.id} onEdit={() => handleEdit(lang.id ?? 0)} onView={() => handleView(lang.id ?? 0)} />,
    ]), [languages, pagination.currentPage, pagination.pageSize, handleEdit, handleView]);

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
            { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: "" }, priority: "low" as const, hideOnMobile: true },
            { label: "Language", key: "language", type: "text" as ColumnType, props: { className: "" }, priority: "high" as const },
            { label: "Proficiency", key: "proficiency", type: "text" as ColumnType, props: { className: "" }, priority: "high" as const },
            { label: "Actions", key: "actions", type: "custom" as ColumnType, props: { className: "" }, priority: "low" as const },
        ],
        hover: true,
        striped: true,
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <ListingShell
            title="Languages"
            icon={<TbLanguage />}
            description="Spoken languages and proficiency levels"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add Language"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.LANGUAGES_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
};

export default LanguageTableTemplate;
