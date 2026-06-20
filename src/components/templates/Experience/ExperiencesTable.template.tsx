import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import { type ExperienceResponse, EmploymentStatus } from "../../../services/useExperienceService";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { DateUtils } from "../../../utils/helper";

interface ExperienceTableTemplateProps {
    experiences: ExperienceResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ExperienceTableTemplate: React.FC<ExperienceTableTemplateProps> = ({ experiences, pagination, handlePaginationChange, handleRowsPerPageChange }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_EDIT, { query, params: { id: id } }));
    }

    const handleView = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_VIEW, { query, params: { id: id } }));
    }

    const Action = (id: string) => <ActionButtons onEdit={() => handleEdit(id)} onView={() => handleView(id)} />;

    const getRecords = () => experiences?.map((experience: ExperienceResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        experience.companyName,
        experience.jobTitle,
        experience.location,
        experience.employmentStatus === EmploymentStatus.CURRENT ? DateUtils.formatDateTimeToDateMonthYear(experience.startDate) + " - Present" : DateUtils.formatDateTimeToDateMonthYear(experience.startDate) + " - " + DateUtils.formatDateTimeToDateMonthYear(experience.endDate || ""),
        Action(experience.id ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: 'low' as const, hideOnMobile: true },
        { label: "Company Name", key: "companyName", type: "text" as ColumnType, props: { className: '' }, priority: 'high' as const },
        { label: "Job Title", key: "jobTitle", type: "text" as ColumnType, props: { className: '' }, priority: 'medium' as const },
        { label: "Location", key: "location", type: "text" as ColumnType, props: { className: '' }, priority: 'medium' as const },
        { label: "Duration", key: "duration", type: "text" as ColumnType, props: { className: '' }, priority: 'medium' as const },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: 'medium' as const },
    ]

    const getSchema = () => ({
        id: "1",
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

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <ListingShell title="Experience" description="Work history and roles" count={pagination.totalRecords} accentColor="#10b981">
            <TableV1 schema={getSchema()} records={getRecords()} />
        </ListingShell>
    );
}
export default ExperienceTableTemplate;
