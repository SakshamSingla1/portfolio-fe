import React, { useEffect, useState } from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { HTTP_STATUS, StatusOptions, type IPagination } from "../../../utils/types";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../organisms/TableV1/TableV1";
import { type DocumentUploadResponse, type ResumeSearchParams } from "../../../services/useResumeService";
import { FiEye, FiSearch, FiChevronDown, FiChevronUp, FiFilter } from "react-icons/fi";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import { CgUnblock } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { useResumeService } from "../../../services/useResumeService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { DateUtils } from "../../../utils/helper";

interface ResumeTableTemplateProps {
    resumes: DocumentUploadResponse[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: ResumeSearchParams;
}

const ResumeTableTemplate: React.FC<ResumeTableTemplateProps> = ({ resumes, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const { showSnackbar } = useSnackbar();

    const resumeService = useResumeService();

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const handleActivateResume = async(id: string) => {
        try { 
            const response = await resumeService.activateResume({ resumeId: id });
            if(response.status === HTTP_STATUS.OK) {
                showSnackbar('success','Resume activated successfully');
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleView = (url: string,status: string) => {
        if(status === 'DELETED') {
            showSnackbar('error','Cannot view deleted resume');
            return;
        }
        window.open(url, '_blank');
    }

    const handleDeleteResume = async(id: string) => {
        try { 
            const response = await resumeService.deleteResume(id);
            if(response.status === HTTP_STATUS.OK) {
                showSnackbar('success','Resume deleted successfully');
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const Action = (resume: DocumentUploadResponse) => {
        return (
            <div className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`}>
                <button onClick={() => handleView(resume.fileUrl, resume.status)} className="w-6 h-6">
                    <FiEye />
                </button>
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
        <div className="grid gap-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Resume List
                        </h1>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className={`${isMobile ? '' : 'flex justify-between items-end space-x-4'}`}>
                    {isMobile ? (
                        <div className="w-full">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-3"
                            >
                                <span className="flex items-center">
                                    <FiFilter />
                                    <span className="ml-2">Filters</span>
                                </span>
                                <span className="transform transition-transform">
                                    {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            </button>
                            {showFilters && (
                                <div className="flex flex-col gap-4">
                                    <AutoCompleteInput
                                        label=""
                                        placeHolder="Select Status"
                                        options={StatusOptions}
                                        value={filters.status ? StatusOptions.find(option => option.value === filters.status) : null}
                                        onChange={(option: any) => {
                                            if (option) {
                                                handleFiltersChange("status", option.value);
                                            } else {
                                                handleFiltersChange("status", "");
                                            }
                                        }}
                                        onSearch={() => { }}
                                    />
                                    <TextField
                                        label=''
                                        variant="outlined"
                                        placeholder="Search..."
                                        value={filters.search}
                                        name='search'
                                        onChange={(event) => {
                                            handleFiltersChange("search", event.target.value)
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"> <FiSearch /></InputAdornment>,
                                        }}
                                        fullWidth
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <div className="w-[250px]">
                                <AutoCompleteInput
                                    label=""
                                    placeHolder="Select Status"
                                    options={StatusOptions}
                                    value={filters.status ? StatusOptions.find(option => option.value === filters.status) : null}
                                    onChange={(option: any) => {
                                        if (option) {
                                            handleFiltersChange("status", option.value);
                                        } else {
                                            handleFiltersChange("status", "");
                                        }
                                    }}
                                    onSearch={() => { }}
                                />
                            </div>
                            <div className="w-[250px]">
                                <TextField
                                    label=''
                                    variant="outlined"
                                    placeholder="Search...."
                                    value={filters.search}
                                    name='search'
                                    onChange={(event) => {
                                        handleFiltersChange("search", event.target.value)
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" className='pl-[11px]'> <FiSearch /></InputAdornment>,
                                    }}
                                    fullWidth
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Table schema={getSchema()} records={getRecords()} />
        </div>
    )
}
export default ResumeTableTemplate;