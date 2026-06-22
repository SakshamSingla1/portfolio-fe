import React from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { HTTP_STATUS, StatusOptions, type IPagination } from "../../../utils/types";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import { type DocumentUploadResponse } from "../../../services/useResumeService";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import { CgUnblock } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { useResumeService } from "../../../services/useResumeService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { DateUtils } from "../../../utils/helper";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface ResumeTableTemplateProps {
    resumes: DocumentUploadResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    filterContent?: React.ReactNode;
}

const ResumeTableTemplate: React.FC<ResumeTableTemplateProps> = ({
    resumes,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
    filterContent
}) => {
    const { showSnackbar } = useSnackbar();

    const resumeService = useResumeService();

    const isMobile = useIsMobile();

    const handleActivateResume = async (id?: number | null) => {
        if (!id) return;
        try {
            const response = await resumeService.activateResume({ resumeid: id });
            if (response.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Resume activated successfully');
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleView = (url: string, status: string) => {
        if (status === 'DELETED') {
            showSnackbar('error', 'Cannot view deleted resume');
            return;
        }
        window.open(url, '_blank');
    }

    const handleDeleteResume = async (id?: number | null) => {
        if (!id) return;
        try {
            const response = await resumeService.deleteResume(id);
            if (response.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Resume deleted successfully');
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const Action = (resume: DocumentUploadResponse) => {
        return (
            <div className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`}>
                <ActionButtons onView={() => handleView(resume.fileUrl, resume.status)} />
                {resume.status === 'INACTIVE' && (
                    <button
                        onClick={() => handleActivateResume(resume.id)}
                        className="w-6 h-6"
                        title="Activate"
                    >
                        <CgUnblock />
                    </button>
                )}
                {resume.status !== 'DELETED' && (
                    <button
                        onClick={() => handleDeleteResume(resume.id)}
                        className="w-6 h-6"
                        title="Delete"
                    >
                        <MdDelete />
                    </button>
                )}
            </div>
        );
    };

    const getRecords = () => resumes?.map((resume: DocumentUploadResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        resume.fileName,
        StatusOptions.find((status) => status.value === resume.status)?.label,
        DateUtils.dateTimeSecondToDate(resume.updatedAt ?? ""),
        Action(resume)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "File Name", key: "fileName", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Status", key: "status", component: ({ value }: { value: string }) => <ResourceStatus status={value} />, type: "custom" as ColumnType, props: {}, priority: "medium" as const },
        { label: "Uploaded At", key: "uploadedAt", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
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

    return (
        <ListingShell
            title="Resumes"
            description="Manage your resume files"
            count={pagination.totalRecords}
            isAddButtonVisible={false}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filterContent={filterContent}
        >
            <TableV1 schema={getSchema()} records={getRecords()} />
        </ListingShell>
    )
}
export default ResumeTableTemplate;
