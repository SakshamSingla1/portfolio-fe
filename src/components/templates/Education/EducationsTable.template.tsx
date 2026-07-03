import React, { useMemo, useCallback } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { ADMIN_ROUTES, DEGREE_OPTIONS } from "../../../utils/constant";
import type { Education } from "../../../services/useEducationService";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { FaGraduationCap } from "react-icons/fa";

interface IEducationsTableTemplateProps {
    educations: Education[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
}

const EducationsTableTemplate: React.FC<IEducationsTableTemplateProps> = ({
    educations,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();

    const handleEdit = useCallback((id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.EDUCATION_EDIT, {
                params: { id: String(id) },
                query: query
            })
        );
    }, [navigate, searchParams]);

    const handleView = useCallback((id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.EDUCATION_VIEW, {
                params: { id: String(id) },
                query: query
            })
        );
    }, [navigate, searchParams]);

    const records = useMemo(() => educations?.map((education: Education, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        education.institution,
        DEGREE_OPTIONS.find(opt => opt.value === education.degree)?.label ?? "",
        education.startYear ?? "",
        education.endYear ?? "",
        <ActionButtons key={education.id} onEdit={() => handleEdit(education.id ?? 0)} onView={() => handleView(education.id ?? 0)} />
    ]) ?? [], [educations, pagination.currentPage, pagination.pageSize, handleEdit, handleView]);

    const schema = useMemo(() => ({
        id: 1,
        mobileView: isMobile ? "cards" as const : "responsive" as const,
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: handlePaginationChange,
            handleChangeRowsPerPage: handleRowsPerPageChange
        },
        columns: [
            { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
            { label: "Institution", key: "institution", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Degree", key: "degree", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
            { label: "Start Year", key: "startYear", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "End Year", key: "endYear", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Actions", key: "actions", type: "custom" as ColumnType, props: { className: '' }, priority: "low" as const },
        ],
        hover: true,
        striped: true
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <ListingShell
            title="Education"
            icon={<FaGraduationCap />}
            description="Academic background and degrees"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add Education"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.EDUCATION_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
}
export default EducationsTableTemplate;
