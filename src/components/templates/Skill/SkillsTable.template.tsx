import React from "react";
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

    const handleEdit = (id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.SKILL_EDIT, { query, params: { id: String(id) } }));
    }

    const handleView = (id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.SKILL_VIEW, { query, params: { id: String(id) } }));
    }

    const Action = (id: number) => <ActionButtons onEdit={() => handleEdit(id)} onView={() => handleView(id)} />;

    const getRecords = () => skills?.map((skill: SkillResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        skill.logoName,
        <div className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`} title=''>
            <img src={skill.logoUrl} alt={skill.logoName} className='w-10 h-10' />
        </div>,
        skill.level,
        convertToCamelCase(skill.category),
        Action(skill.id ?? 0)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Logo", key: "logo", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Level", key: "level", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Category", key: "category", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
    ]

    const getSchema = () => ({
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
        columns: getTableColumns(),
        hover: true,
        striped: true
    });

    const statsList: ListingStat[] = [
        { label: "Expert", value: stats?.expertSkillCount ?? 0 },
        { label: "Advanced", value: stats?.advancedSkillCount ?? 0 },
        { label: "Intermediate", value: stats?.intermediateSkillCount ?? 0 },
        { label: "Beginner", value: stats?.beginnerSkillCount ?? 0 },
    ];

    return (
        <ListingShell 
            title="Skills" 
            description="Technical skills and expertise" 
            count={pagination.totalRecords} 
            isAddButtonVisible={true} 
            addButtonLabel="Add Skill" 
            addButtonOnClick={() => navigate(ADMIN_ROUTES.SKILL_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            stats={statsList}
        >
            <TableV1 schema={getSchema()} records={getRecords()} />
        </ListingShell>
    );
}
export default SkillTableTemplate;