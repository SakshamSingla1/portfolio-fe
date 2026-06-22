import React from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import { type ProjectResponse, WorkStatusType } from "../../../services/useProjectService";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { ADMIN_ROUTES } from "../../../utils/constant";
import type { SkillDropdown } from "../../../services/useSkillService";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface ProjectsTableTemplateProps {
    projects: ProjectResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
}

const ProjectsTableTemplate: React.FC<ProjectsTableTemplateProps> = ({ 
    projects, 
    pagination, 
    handlePaginationChange, 
    handleRowsPerPageChange,
    searchValue,
    onSearchChange
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
        navigate(makeRoute(ADMIN_ROUTES.PROJECTS_EDIT, { query, params: { id: String(id) } }));
    }

    const handleView = (id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.PROJECTS_VIEW, { query, params: { id: String(id) } }));
    }

    const Action = (id: number) => <ActionButtons onEdit={() => handleEdit(id)} onView={() => handleView(id)} />;

    const getRecords = () => projects?.map((project: ProjectResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        project.projectName,
        getTechImages(project.skills),
        project.workStatus === WorkStatusType.CURRENT ? DateUtils.formatDateTimeToDateMonthYear(project.projectStartDate) + " - Present" : DateUtils.formatDateTimeToDateMonthYear(project.projectStartDate) + " - " + DateUtils.formatDateTimeToDateMonthYear(project.projectEndDate || ""),
        Action(project.id ?? 0)
    ])

    const getTechImages = (skills: SkillDropdown[]) => {
        const visibleSkills = skills.slice(0, 3);
        const remaining = skills.length - 3;
        return (
            <div className={`flex items-center space-x-2 ${isMobile ? 'justify-end' : ''}`}>
                {visibleSkills.map((skill) => (
                    <img key={skill.logoName} src={skill.logoUrl} alt={skill.logoName} className="w-10 h-10" />
                ))}
                {remaining > 0 && (
                    <span className="text-sm font-medium text-gray-500">+{remaining}</span>
                )}
            </div>
        );
    };

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: 'low' as const, hideOnMobile: true },
        { label: "Project Name", key: "projectName", type: "text" as ColumnType, props: { className: '' }, priority: 'high' as const },
        { label: "Technologies", key: "technologies", type: "text" as ColumnType, props: { className: '' }, priority: 'medium' as const },
        { label: "Duration", key: "duration", type: "text" as ColumnType, props: { className: '' }, priority: 'medium' as const },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: 'medium' as const },
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

    return (
        <ListingShell 
            title="Projects" 
            description="Portfolio projects and case studies" 
            count={pagination.totalRecords} 
            isAddButtonVisible={true} 
            addButtonLabel="Add Project" 
            addButtonOnClick={() => navigate(ADMIN_ROUTES.PROJECTS_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
        >
            <TableV1 schema={getSchema()} records={getRecords()} />
        </ListingShell>
    );
}
export default ProjectsTableTemplate;
