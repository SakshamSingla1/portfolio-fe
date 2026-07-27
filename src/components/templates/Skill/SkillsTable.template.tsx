import React, { useMemo, useCallback } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell, { type ListingStat } from "../Shared/ListingShell.template";
import { type SkillResponse, type SkillStats } from "../../../services/useSkillService";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { convertToCamelCase } from "../../../utils/helper";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { FaCode } from "react-icons/fa";

interface SkillTableTemplateProps {
    skills: SkillResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    stats: SkillStats | null;
}

const SkillTableTemplate: React.FC<SkillTableTemplateProps> = ({
    skills,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
    stats
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
        navigate(makeRoute(ADMIN_ROUTES.SKILL_EDIT, { query, params: { id: String(id) } }));
    }, [navigate, searchParams]);

    const handleView = useCallback((id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.SKILL_VIEW, { query, params: { id: String(id) } }));
    }, [navigate, searchParams]);

    const records = useMemo(() => skills?.map((skill: SkillResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        skill.logoName,
        <div key={skill.id} className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`} title=''>
            <img src={skill.logoUrl} alt={skill.logoName} className='w-10 h-10' loading="lazy" width={40} height={40} />
        </div>,
        skill.level,
        convertToCamelCase(skill.category),
        <ActionButtons key={`action-${skill.id}`} onEdit={() => handleEdit(skill.id ?? 0)} onView={() => handleView(skill.id ?? 0)} />
    ]) ?? [], [skills, pagination.currentPage, pagination.pageSize, isMobile, handleEdit, handleView]);

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
            { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
            { label: "Logo", key: "logo", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Level", key: "level", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Category", key: "category", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        ],
        hover: true,
        striped: true
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    const statsList: ListingStat[] = [
        { label: "Expert", value: stats?.expertSkillCount ?? 0 },
        { label: "Advanced", value: stats?.advancedSkillCount ?? 0 },
        { label: "Intermediate", value: stats?.intermediateSkillCount ?? 0 },
        { label: "Beginner", value: stats?.beginnerSkillCount ?? 0 },
    ];

    return (
        <ListingShell
            title="Skills"
            icon={<FaCode />}
            description="Technical skills and expertise"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add Skill"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.SKILL_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            stats={statsList}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
}
export default SkillTableTemplate;
