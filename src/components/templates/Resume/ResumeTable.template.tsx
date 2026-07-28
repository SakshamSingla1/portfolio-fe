import React, { useMemo, useCallback, useState } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { HTTP_STATUS, type IPagination } from "../../../utils/types";
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
import { FaFileAlt } from "react-icons/fa";
import { DeleteConfirmation } from "../../molecules/DeleteConfirmation/DeleteConfirmation";

interface ResumeTableTemplateProps {
    resumes: DocumentUploadResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    filterContent?: React.ReactNode;
    onRefresh?: () => void;
    isLoading?: boolean;
}

const ResumeTableTemplate: React.FC<ResumeTableTemplateProps> = ({
    resumes,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
    filterContent,
    onRefresh,
    isLoading
}) => {
    const { showSnackbar } = useSnackbar();

    const resumeService = useResumeService();

    const isMobile = useIsMobile();

    const [idPendingDelete, setIdPendingDelete] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleActivateResume = useCallback(async (id?: number | null) => {
        if (!id) return;
        try {
            const response = await resumeService.activateResume({ resumeId: id });
            if (response.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Resume activated successfully');
                onRefresh?.();
            }
        } catch {
            showSnackbar('error', 'Failed to activate resume');
        }
    }, [resumeService, showSnackbar, onRefresh]);

    const handleView = useCallback((url: string, status: string) => {
        if (status === 'DELETED') {
            showSnackbar('error', 'Cannot view deleted resume');
            return;
        }
        window.open(url, '_blank');
    }, [showSnackbar]);

    const confirmDeleteResume = useCallback(async () => {
        if (idPendingDelete == null) return;
        setDeleting(true);
        try {
            const response = await resumeService.deleteResume(idPendingDelete);
            if (response.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Resume deleted successfully');
                onRefresh?.();
            }
        } catch {
            showSnackbar('error', 'Failed to delete resume');
        } finally {
            setDeleting(false);
            setIdPendingDelete(null);
        }
    }, [resumeService, showSnackbar, onRefresh, idPendingDelete]);

    const records = useMemo(() => resumes?.map((resume: DocumentUploadResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        resume.fileName,
        resume.status,
        DateUtils.dateTimeSecondToDate(resume.updatedAt ?? ""),
        <div key={resume.id} className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`}>
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
                    onClick={() => setIdPendingDelete(resume.id ?? null)}
                    className="w-6 h-6"
                    title="Delete"
                >
                    <MdDelete />
                </button>
            )}
        </div>
    ]) ?? [], [resumes, pagination.currentPage, pagination.pageSize, isMobile, handleView, handleActivateResume]);

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
            { label: "File Name", key: "fileName", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
            { label: "Status", key: "status", component: ({ value }: { value: string }) => <ResourceStatus status={value} />, type: "custom" as ColumnType, props: {}, priority: "medium" as const },
            { label: "Uploaded At", key: "uploadedAt", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        ],
        hover: true,
        striped: true
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <>
            <ListingShell
                title="Resumes"
                icon={<FaFileAlt />}
                description="Manage your resume files"
                count={pagination.totalRecords}
                isAddButtonVisible={false}
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                filterContent={filterContent}
            >
                <TableV1 schema={schema} records={records} isLoading={isLoading} />
            </ListingShell>
            <DeleteConfirmation
                open={idPendingDelete != null}
                title="Delete this resume?"
                description="This action cannot be undone."
                onDelete={confirmDeleteResume}
                onCancel={() => setIdPendingDelete(null)}
                deleteButtonText={deleting ? "Deleting..." : "Delete"}
            />
        </>
    )
}
export default ResumeTableTemplate;
